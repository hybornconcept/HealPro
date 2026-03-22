import { factory } from "../lib/factory";
// import { db } from "../lib/db";
import { hospitals } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createHospitalSchema,
  updateHospitalSchema,
  getHospitalsQuerySchema,
  hospitalIdParamSchema,
  hospitalDocUploadSchema,
} from "../lib/validations/hospital.validation";

const hospitalRoute = factory
  .createApp()
  // Get hospital profile by email (for logged-in provider)
  .get("/profile", async (c) => {
    try {
      const db = c.get("db");
      const email = c.req.query("email");

      if (!email) {
        return c.json({ success: false, error: "Email is required" }, 400);
      }

      const hospital = await db
        .select()
        .from(hospitals)
        .where(eq(hospitals.email, email))
        .limit(1);

      if (hospital.length === 0) {
        return c.json({ success: false, error: "Hospital not found" }, 404);
      }

      return c.json({ success: true, data: hospital[0] });
    } catch (error: any) {
      console.error("[HOSPITAL PROFILE] Error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .get("/", zValidator("query", getHospitalsQuerySchema), async (c) => {
    try {
      const db = c.get("db");
      const query = c.req.valid("query");
      const allHospitals = await db.select().from(hospitals);
      return c.json({ success: true, data: allHospitals });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .post("/", zValidator("json", createHospitalSchema), async (c) => {
    try {
      const db = c.get("db");
      const body = c.req.valid("json");

      // Log the incoming data for debugging
      console.log(
        "[HOSPITAL CREATE] Received data:",
        JSON.stringify(body, null, 2)
      );

      // Generate organizationId if not provided
      const organizationId =
        body.organizationId ||
        `ORG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Construct payload with ONLY fields that exist in the database
      const dbPayload = {
        userId: body.userId,
        organizationId: organizationId,
        facilityName: body.facilityName,
        facilityType: body.facilityType,
        facilityTier: body.facilityTier,
        primaryPhone: body.primaryPhone,
        contactPerson: body.contactPerson,
        website: body.website,
        email: body.email,
        address: body.address,
        state: body.state,
        city: body.city,
        operatingHours: body.operatingHours,
        licenseNumber: body.licenseNumber,
        taxId: body.taxId,
        cmdName: body.cmdName,
        cmdFolio: body.cmdFolio,
        specialties: body.specialties,
        equipment: body.equipment,
        bedCapacity: body.bedCapacity,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
      };

      const newHospital = await db.transaction(async (tx) => {
        const [hospital] = await tx
          .insert(hospitals)
          .values(dbPayload)
          .returning();
        return hospital;
      });

      console.log("[HOSPITAL CREATE] Success:", newHospital.id);
      return c.json({ success: true, data: newHospital });
    } catch (error: any) {
      console.error("[HOSPITAL CREATE] Error:", error);
      console.error("[HOSPITAL CREATE] Error message:", error.message);
      console.error("[HOSPITAL CREATE] Error stack:", error.stack);
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .get("/:id", zValidator("param", hospitalIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const hospital = await db
        .select()
        .from(hospitals)
        .where(eq(hospitals.id, id));
      if (hospital.length === 0) {
        return c.json({ success: false, error: "Hospital not found" }, 404);
      }
      return c.json({ success: true, data: hospital[0] });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .put(
    "/:id",
    zValidator("param", hospitalIdParamSchema),
    zValidator("json", updateHospitalSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");
        const updatedHospital = await db
          .update(hospitals)
          .set(body)
          .where(eq(hospitals.id, id))
          .returning();
        if (updatedHospital.length === 0) {
          return c.json({ success: false, error: "Hospital not found" }, 404);
        }
        return c.json({ success: true, data: updatedHospital[0] });
      } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
      }
    }
  )
  .delete("/:id", zValidator("param", hospitalIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const deletedHospital = await db
        .delete(hospitals)
        .where(eq(hospitals.id, id))
        .returning();
      if (deletedHospital.length === 0) {
        return c.json({ success: false, error: "Hospital not found" }, 404);
      }
      return c.json({ success: true, data: deletedHospital[0] });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  })
  .post(
    "/:id/upload-docs",
    zValidator("param", hospitalIdParamSchema),
    zValidator("form", hospitalDocUploadSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const { file, type } = c.req.valid("form");

        // Verify hospital exists
        const hospital = await db
          .select()
          .from(hospitals)
          .where(eq(hospitals.id, id));

        if (hospital.length === 0) {
          return c.json({ success: false, error: "Hospital not found" }, 404);
        }

        // Upload document
        const buffer = await file.arrayBuffer();
        const filename = `hospital-${id}-${type}-${Date.now()}-${file.name}`;

        await c.env.BUCKET.put(filename, buffer, {
          httpMetadata: { contentType: file.type },
        });

        const documentUrl = `${c.env.R2_PUBLIC_URL}/${filename}`;

        // Update hospital record based on type (optional, if we want to store specific URLs in columns)
        // For now, we might just return the URL, or store it in a metadata field or specific column if it exists
        // Looking at schema, we don't have specific columns for file URLs other than maybe 'licenseNumber' which is a string
        // We might want to add columns for these later, or store in metadata.
        // For now, let's just return success.

        return c.json({
          success: true,
          message: "Document uploaded successfully",
          data: { url: documentUrl, type },
        });
      } catch (error: any) {
        console.error("Error uploading document:", error);
        return c.json(
          {
            success: false,
            message: "Failed to upload document",
            error: error.message,
          },
          500
        );
      }
    }
  );

export default hospitalRoute;
