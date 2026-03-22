import { factory } from "../lib/factory";
import { appointments, patients, hospitals, hmos } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentsQuerySchema,
  appointmentIdParamSchema,
} from "../lib/validations/appointments.validation";

const appointmentRoute = factory
  .createApp()
  .get("/", zValidator("query", getAppointmentsQuerySchema), async (c) => {
    try {
      const db = c.get("db");
      const query = c.req.valid("query");
      const allAppointments = await db.select().from(appointments);
      return c.json({ success: true, data: allAppointments });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .post("/", zValidator("json", createAppointmentSchema), async (c) => {
    try {
      const db = c.get("db");
      const user = c.get("user");

      if (!user) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
      }

      // 1. Verify User Role
      // Note: user.role might be "patient" or "admin". We allow patients.
      // If you strictly want "patient" status:
      // if (user.role !== "patient") { ... }

      // 2. Find Patient Record
      // IMPORTANT: Don't auto-create patient records for hospital/HMO admins
      const patientRecord = await db
        .select()
        .from(patients)
        .where(eq(patients.userId, user.id));

      let patientId;
      if (patientRecord.length === 0) {
        // Check if this user is a hospital or HMO admin
        const isHospital = await db
          .select()
          .from(hospitals)
          .where(eq(hospitals.email, user.email))
          .limit(1);

        const isHMO = await db
          .select()
          .from(hmos)
          .where(eq(hmos.email, user.email))
          .limit(1);

        if (isHospital.length > 0 || isHMO.length > 0) {
          return c.json(
            {
              success: false,
              error:
                "Hospital and HMO admins cannot create appointments as patients. Please use the facility dashboard.",
            },
            403
          );
        }

        // Auto-create patient profile only for actual patients
        const newPatient = await db
          .insert(patients)
          .values({
            userId: user.id,
            email: user.email,
            fullName: user.name,
          })
          .returning();

        if (newPatient.length === 0) {
          return c.json(
            {
              success: false,
              error: "Failed to create patient profile automatically.",
            },
            500
          );
        }
        patientId = newPatient[0].id;
      } else {
        patientId = patientRecord[0].id;
      }

      const body = c.req.valid("json");

      // 3. Find or Create Hospital
      let hospitalId = body.hospitalId;

      if (!hospitalId && body.facilityName) {
        const existingHospital = await db
          .select()
          .from(hospitals)
          .where(eq(hospitals.facilityName, body.facilityName));

        if (existingHospital.length > 0) {
          hospitalId = existingHospital[0].id;
        } else {
          // Create new hospital placeholder
          const newHospital = await db
            .insert(hospitals)
            .values({
              facilityName: body.facilityName,
              state: body.state,
              licenseNumber: "N/A", // Placeholder
              verificationStatus: false,
            })
            .returning();
          hospitalId = newHospital[0].id;
        }
      }

      if (!hospitalId) {
        return c.json(
          { success: false, error: "Hospital could not be identified" },
          400
        );
      }

      const appointmentData = {
        patientId,
        hospitalId,
        reason: body.reason,
        scheduledDate: new Date(body.scheduledDate),
        scheduledTime: body.scheduledTime,
        status: "pending",
        appointmentType: body.appointmentType,
        unit: body.unit,
        duration: body.duration,
        priority: body.priority,
        additionalNotes: body.additionalNotes,
        hmoPlan: body.hmoPlan,
        coveragePercentage: body.coveragePercentage,
        estimatedCost: body.estimatedCost,
        assignedProvider: body.assignedProvider,
        providerSpecialty: body.providerSpecialty,
        requiresFollowUp: body.requiresFollowUp,
        followUpDate: body.followUpDate
          ? new Date(body.followUpDate)
          : undefined,
        followUpNotes: body.followUpNotes,
        metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
      };

      const newAppointment = await db
        .insert(appointments)
        .values(appointmentData)
        .returning();

      return c.json({ success: true, data: newAppointment[0] });
    } catch (error) {
      console.error("Appointment creation error:", error);
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .get("/:id", zValidator("param", appointmentIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const appointment = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, id));
      if (appointment.length === 0) {
        return c.json({ success: false, error: "Appointment not found" }, 404);
      }
      return c.json({ success: true, data: appointment[0] });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  })
  .put(
    "/:id",
    zValidator("param", appointmentIdParamSchema),
    zValidator("json", updateAppointmentSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");
        const updateData = {
          ...body,
          scheduledDate: body.scheduledDate
            ? new Date(body.scheduledDate)
            : undefined,
          followUpDate: body.followUpDate
            ? new Date(body.followUpDate)
            : undefined,
          metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
        };
        const updatedAppointment = await db
          .update(appointments)
          .set(updateData)
          .where(eq(appointments.id, id))
          .returning();
        if (updatedAppointment.length === 0) {
          return c.json(
            { success: false, error: "Appointment not found" },
            404
          );
        }
        return c.json({ success: true, data: updatedAppointment[0] });
      } catch (error) {
        return c.json(
          {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          500
        );
      }
    }
  )
  .delete("/:id", zValidator("param", appointmentIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");
      const deletedAppointment = await db
        .delete(appointments)
        .where(eq(appointments.id, id))
        .returning();
      if (deletedAppointment.length === 0) {
        return c.json({ success: false, error: "Appointment not found" }, 404);
      }
      return c.json({ success: true, data: deletedAppointment[0] });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        500
      );
    }
  });

export default appointmentRoute;
