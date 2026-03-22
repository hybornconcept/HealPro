import { factory } from "../lib/factory";
import { patients } from "../lib/db/schema/patients.schema";
import { appointments } from "../lib/db/schema/appointments.schema";
import { dependents, policies } from "../lib/db/schema/insurance.schema";

import { hospitals } from "../lib/db/schema/hospital.schema";
import { eq, and, desc, or, ilike } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import {
  createPatientSchema,
  updatePatientSchema,
  getPatientsQuerySchema,
  patientIdParamSchema,
  idDocumentUploadSchema,
} from "../lib/validations/patients.validation";

const patientRoute = factory
  .createApp()
  .get("/", zValidator("query", getPatientsQuerySchema), async (c) => {
    try {
      const db = c.get("db");
      const query = c.req.valid("query");

      const limit = query.limit || 50;
      const offset = query.page ? (query.page - 1) * limit : 0;
      const search = query.search;

      let whereClause;
      if (search) {
        const searchPattern = `%${search}%`;
        whereClause = or(
          ilike(patients.fullName, searchPattern),
          ilike(patients.email, searchPattern)
        );
      }

      const patientList = await db
        .select()
        .from(patients)
        .where(whereClause)
        .orderBy(desc(patients.createdAt))
        .limit(limit)
        .offset(offset);

      return c.json({ success: true, data: patientList });
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
  // Create new patient
  .post("/", zValidator("json", createPatientSchema), async (c) => {
    console.log(`[PATIENT] POST /api/patients - Request received`);
    console.log(`[PATIENT] Origin: ${c.req.header("Origin")}`);
    console.log(`[PATIENT] Content-Type: ${c.req.header("Content-Type")}`);
    
    try {
      const db = c.get("db");
      const body = c.req.valid("json");
      console.log(`[PATIENT] Body received, userId: ${body.userId}`);

      // Separate special fields from patient data
      const { sponsorId, policyRole, policyRelationship, ...patientFields } =
        body;

      // VALIDATION: Check Dependents Limit
      // VALIDATION: Check Dependents Limit
      if (policyRole === "dependent") {
        if (!sponsorId) {
          return c.json(
            { success: false, error: "Sponsor ID is required for dependents" },
            400
          );
        }

        // Find Policy by Policy Number (sponsorId)
        const policy = await db
          .select()
          .from(policies)
          .where(eq(policies.policyNumber, sponsorId))
          .limit(1);

        if (policy.length === 0) {
          return c.json(
            {
              success: false,
              error: "Policy not found for the given Sponsor ID",
            },
            400
          );
        }

        const policyId = policy[0].id;

        // Check existing dependents count
        const existingDependents = await db
          .select()
          .from(dependents)
          .where(eq(dependents.policyId, policyId));

        if (existingDependents.length >= 3) {
          return c.json(
            {
              success: false,
              error: "Principal has reached the maximum limit of 3 dependents.",
            },
            400
          );
        }
      }

      const patientData = {
        ...patientFields,
        // If dependent, we might want to store policyRelationship somewhere or just rely on dependents table
        // For now, we store what we can in patients table
        height: patientFields.height
          ? parseInt(patientFields.height)
          : undefined,
        weight: patientFields.weight
          ? parseInt(patientFields.weight)
          : undefined,
        dateOfBirth: patientFields.dateOfBirth
          ? new Date(patientFields.dateOfBirth)
          : undefined,
      };

      const newPatient = await db
        .insert(patients)
        .values(patientData)
        .returning();

      const newPatientId = newPatient[0].id;

      // HANDLE DEPENDENTS
      if (policyRole === "dependent" && sponsorId) {
        // Link this new patient as a dependent of the Principal's Policy
        const policy = await db
          .select()
          .from(policies)
          .where(eq(policies.policyNumber, sponsorId))
          .limit(1);

        if (policy.length > 0) {
          await db.insert(dependents).values({
            policyId: policy[0].id,
            dependentPatientId: newPatientId,
            relationship: policyRelationship || "Dependent",
            uniqueDependentId: `DEP-${newPatientId}`, // Optional, generating a unique ID
          });
        }
      }

      return c.json({ success: true, data: newPatient[0] }, 201);
    } catch (error) {
      console.error('[PATIENT] Error creating patient:', error);
      
      // Log the full error details for debugging
      if (error instanceof Error) {
        console.error('[PATIENT] Error name:', error.name);
        console.error('[PATIENT] Error message:', error.message);
        console.error('[PATIENT] Error stack:', error.stack);
      }
      
      let errorMessage = "Failed to create patient";
      
      // Check for specific database errors
      if (error instanceof Error) {
        // Postgres unique constraint violation
        if (error.message.includes('unique') || error.message.includes('duplicate')) {
          errorMessage = "A patient with this email or user ID already exists";
        } 
        // Foreign key violation
        else if (error.message.includes('foreign key')) {
          errorMessage = "Invalid user ID - user account not found";
        }
        // General database error
        else {
          errorMessage = error.message;
        }
      }
      
      return c.json(
        {
          success: false,
          error: errorMessage,
        },
        500
      );
    }
  })
  // Get patient dashboard data (for logged-in patient)
  .get("/dashboard", async (c) => {
    try {
      const db = c.get("db");
      // In a real app, you'd get the patient ID from the authenticated user
      // For now, we'll assume it's passed as a query param or from auth
      const patientId = c.req.query("patientId");
      const email = c.req.query("email");
      const userId = c.req.query("userId");

      if (!patientId && !email && !userId) {
        return c.json(
          { success: false, error: "Patient ID, Email, or User ID required" },
          400
        );
      }

      let patient: (typeof patients.$inferSelect)[] = [];
      if (patientId) {
        patient = await db
          .select()
          .from(patients)
          .where(eq(patients.id, parseInt(patientId)))
          .limit(1);
      }

      if (patient.length === 0 && userId) {
        patient = await db
          .select()
          .from(patients)
          .where(eq(patients.userId, userId))
          .limit(1);
      }

      if (patient.length === 0 && email) {
        patient = await db
          .select()
          .from(patients)
          .where(eq(patients.email, email))
          .limit(1);
      }

      if (!patient || patient.length === 0) {
        console.log(
          `Patient not found for email: ${email} or id: ${patientId}`
        );
        return c.json({ success: false, error: "Patient not found" }, 404);
      }

      // If we found by email, we need the ID for appointments
      const targetPatientId = patient[0].id;
      console.log(`Found patient ID: ${targetPatientId} for email: ${email}`);
      console.log("DEBUG: appointments defined?", !!appointments);
      console.log("DEBUG: hospitals defined?", !!hospitals);

      // Get patient's appointments
      const patientAppointments = await db
        .select()
        .from(appointments)
        .leftJoin(hospitals, eq(appointments.hospitalId, hospitals.id))
        .where(eq(appointments.patientId, targetPatientId))
        .orderBy(desc(appointments.scheduledDate));

      console.log(
        `Found ${patientAppointments.length} appointments for patient ID: ${targetPatientId}`
      );

      // DEBUG: Check if there are ANY appointments for this patient
      const allPatientApts = await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, targetPatientId));
      console.log(
        `DEBUG: Total appointments for patient ${targetPatientId} (unordered): ${allPatientApts.length}`
      );
      if (allPatientApts.length > 0) {
        console.log("DEBUG: First appointment:", allPatientApts[0]);
      } else {
        // Check if there are ANY appointments in the table at all
        const anyApts = await db.select().from(appointments).limit(1);
        console.log("DEBUG: Any appointments in table?", anyApts.length);
        if (anyApts.length > 0)
          console.log("DEBUG: Sample appointment:", anyApts[0]);
      }

      // Get dependents - commented out as dependents table uses policyId, not patientId
      // TODO: Implement proper policy-based dependent querying
      const patientDependents: any[] = [];
      // const patientDependents = await db
      //   .select()
      //   .from(dependents)
      //   .where(eq(dependents.policyId, targetPolicyId));

      // Format data for frontend (matching HealPro structure)
      const dashboardData = {
        userProfile: {
          name: patient[0].fullName || "Unknown Patient",
          email: patient[0].email || "",
          phone: patient[0].phone || "",
          address: patient[0].address || "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            patient[0].fullName || "Unknown Patient"
          )}&background=random`,
          stats: {
            past: patientAppointments.filter(
              ({ appointments: apt }) => apt.status === "completed"
            ).length,
            upcoming: patientAppointments.filter(({ appointments: apt }) =>
              ["pending", "confirmed", "waiting"].includes(apt.status)
            ).length,
          },
          dependents: patientDependents.map((d) => ({
            label: d.relationship,
            value: `Dependent ${d.id}`,
          })),
          personalDetails: [
            { label: "Full Name", value: patient[0].fullName },
            {
              label: "Date of Birth",
              value:
                patient[0].dateOfBirth?.toISOString().split("T")[0] ||
                "Not provided",
            },
            { label: "Gender", value: patient[0].gender || "Not provided" },
            {
              label: "Phone Number",
              value: patient[0].phone || "Not provided",
            },
            {
              label: "Occupation",
              value: patient[0].occupation || "Not provided",
            },
            { label: "State", value: patient[0].state || "Not provided" },
            { label: "Address", value: patient[0].address || "Not provided" },
            {
              label: "ID Type",
              value: patient[0].identificationType || "Not provided",
            },
            {
              label: "ID Number",
              value: patient[0].identificationNumber || "Not provided",
            },
          ],
          medicalDetails: [
            {
              label: "Blood Group",
              value: patient[0].bloodGroup || "Not provided",
            },
            { label: "Genotype", value: patient[0].genotype || "Not provided" },
            {
              label: "Height",
              value: patient[0].height
                ? `${patient[0].height} cm`
                : "Not provided",
            },
            {
              label: "Weight",
              value: patient[0].weight
                ? `${patient[0].weight} kg`
                : "Not provided",
            },
            { label: "Allergies", value: patient[0].allergies || "None" },
            {
              label: "Pre-existing Conditions",
              value: patient[0].conditions || "None",
            },
            {
              label: "Current Medications",
              value: patient[0].currentMedications || "None",
            },
            {
              label: "Primary Care Physician",
              value: patient[0].primaryCarePhysician || "None",
            },
            {
              label: "Family Medical History",
              value: patient[0].familyMedicalHistory || "None",
            },
            {
              label: "Past Medical History",
              value: patient[0].pastMedicalHistory || "None",
            },
          ],
        },
        contactDetails: [
          {
            label: "Next of Kin",
            value: patient[0].nokName || "Not provided",
          },
          {
            label: "Relationship",
            value: patient[0].nokRelationship || "Not provided",
          },
          {
            label: "NOK Phone",
            value: patient[0].nokPhone || "Not provided",
          },
          {
            label: "Primary Care Physician",
            value: patient[0].primaryCarePhysician || "Not provided",
          },
          {
            label: "Policy Holder",
            value:
              patient[0].policyRole === "principal"
                ? "Principal (Primary)"
                : "Dependent",
          },
          {
            label: "HMO Provider",
            value: patient[0].hmoProvider || "Not provided",
          },
          {
            label: "Policy / Member ID",
            value: patient[0].insurancePolicyNumber || "Not provided",
          },
          {
            label: "Plan Tier",
            value: patient[0].planTier || "Not provided",
          },
          // Only show corporate code if principal
          ...(patient[0].policyRole === "principal" && patient[0].corporateCode
            ? [
                {
                  label: "Corporate / Company Code",
                  value: patient[0].corporateCode,
                },
              ]
            : []),
          // Show relationship if dependent
          ...(patient[0].policyRole === "dependent" &&
          patient[0].policyRelationship
            ? [
                {
                  label: "Relationship to Holder",
                  value: patient[0].policyRelationship,
                },
              ]
            : []),
        ],
        appointments: patientAppointments.map(
          ({ appointments: apt, hospitals: hospital }) => ({
            date: apt.scheduledDate.toISOString().split("T")[0],
            time: apt.scheduledTime,
            facility: hospital ? hospital.facilityName : "Unknown Facility",
            // unit: apt.unit, // Removed as per user request to remove column, and likely not in schema
            // type: apt.appointmentType, // Removed as per user request
            reason: apt.reason,
            status: apt.status,
            additionalNotes: apt.additionalNotes || "",
            coverage: apt.coveragePercentage || 0,
            claimStatus: apt.status === "completed" ? "Approved" : "In-Review",
          })
        ),
        hospitalInfo: {
          name: "General Hospital Lagos",
          address: "Victoria Island, Lagos State",
          phone: "+234 123 456 7890",
          email: "info@generalhospitallagos.ng",
        },
        serviceTimeline: [
          {
            title: "Check lab",
            date: "23 Nov 2024 • 5:23 PM",
            details: "Blood test, urine analysis, cholesterol screening",
            status: "completed",
          },
          {
            title: "Control of lab results",
            date: "18 Nov 2024 • 5:23 PM",
            details: "Review blood work, discuss findings with physician",
            status: "pending",
          },
        ],
      };

      return c.json({
        success: true,
        data: dashboardData,
        debug: {
          targetPatientId,
          appointmentsFound: patientAppointments.length,
          totalAppointmentsForPatient: allPatientApts.length,
          anyAppointmentsInTable: (
            await db.select().from(appointments).limit(1)
          ).length,
        },
      });
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
  // Get specific patient by ID
  .get("/:id", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      const patient = await db
        .select()
        .from(patients)
        .where(eq(patients.id, id));

      if (patient.length === 0) {
        return c.json({ success: false, error: "Patient not found" }, 404);
      }

      return c.json({ success: true, data: patient[0] });
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
  // Update patient
  .put(
    "/:id",
    zValidator("param", patientIdParamSchema),
    zValidator("json", updatePatientSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const body = c.req.valid("json");

        const updateData = {
          ...body,
          height: body.height ? parseInt(body.height.toString()) : undefined,
          weight: body.weight ? parseInt(body.weight.toString()) : undefined,
          dateOfBirth: body.dateOfBirth
            ? new Date(body.dateOfBirth)
            : undefined,
          metadata: body.metadata ? JSON.stringify(body.metadata) : undefined,
        };

        const updatedPatient = await db
          .update(patients)
          .set(updateData)
          .where(eq(patients.id, id))
          .returning();

        if (updatedPatient.length === 0) {
          return c.json({ success: false, error: "Patient not found" }, 404);
        }

        return c.json({ success: true, data: updatedPatient[0] });
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
  // Delete patient
  .delete("/:id", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      const deletedPatient = await db
        .delete(patients)
        .where(eq(patients.id, id))
        .returning();

      if (deletedPatient.length === 0) {
        return c.json({ success: false, error: "Patient not found" }, 404);
      }

      return c.json({ success: true, data: deletedPatient[0] });
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
  // Get patient appointment statistics
  .get("/:id/stats", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      const patientAppointments = await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, id));

      const stats = {
        total: patientAppointments.length,
        completed: patientAppointments.filter(
          (apt) => apt.status === "completed"
        ).length,
        upcoming: patientAppointments.filter((apt) =>
          ["pending", "confirmed", "waiting"].includes(apt.status)
        ).length,
        cancelled: patientAppointments.filter(
          (apt) => apt.status === "cancelled"
        ).length,
        noShow: patientAppointments.filter((apt) => apt.status === "no-show")
          .length,
      };

      return c.json({ success: true, data: stats });
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
  // Get patient medical history/timeline
  .get("/:id/history", zValidator("param", patientIdParamSchema), async (c) => {
    try {
      const db = c.get("db");
      const { id } = c.req.valid("param");

      // Get completed appointments with clinical encounters
      const patientAppointments = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.patientId, id),
            eq(appointments.status, "completed")
          )
        )
        .orderBy(desc(appointments.scheduledDate));

      // For now, return appointment-based history
      // In a full implementation, this would include clinical encounters
      const history = patientAppointments.map((apt) => ({
        id: apt.id,
        type: apt.appointmentType,
        date: apt.scheduledDate.toISOString().split("T")[0],
        time: apt.scheduledTime,
        facility: "General Hospital Lagos", // Would come from hospital table
        unit: apt.unit,
        reason: apt.reason,
        status: "completed",
      }));

      return c.json({ success: true, data: history });
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
  // Upload patient identification document
  .post(
    "/:id/upload-id",
    zValidator("param", patientIdParamSchema),
    zValidator("form", idDocumentUploadSchema),
    async (c) => {
      try {
        const db = c.get("db");
        const { id } = c.req.valid("param");
        const { file } = c.req.valid("form");

        // Verify patient exists
        const patient = await db
          .select()
          .from(patients)
          .where(eq(patients.id, id));

        if (patient.length === 0) {
          return c.json({ success: false, error: "Patient not found" }, 404);
        }

        // Delete existing ID document if it exists
        if (patient[0].idDocumentUrl) {
          try {
            const oldFilename = patient[0].idDocumentUrl.split("/").pop();
            if (oldFilename) {
              await c.env.BUCKET.delete(oldFilename);
            }
          } catch (error) {
            console.error("Error deleting old ID document:", error);
          }
        }

        // Upload new ID document
        const imageBuffer = await file.arrayBuffer();
        const filename = `patient-${id}-id-${Date.now()}-${file.name}`;
        await c.env.BUCKET.put(filename, imageBuffer, {
          httpMetadata: { contentType: file.type },
        });

        const documentUrl = `${c.env.R2_PUBLIC_URL}/${filename}`;

        // Update patient record with new document URL
        const updatedPatient = await db
          .update(patients)
          .set({ idDocumentUrl: documentUrl })
          .where(eq(patients.id, id))
          .returning();

        return c.json({
          success: true,
          message: "ID document uploaded successfully",
          data: { url: documentUrl },
        });
      } catch (error) {
        console.error("Error uploading ID document:", error);
        return c.json(
          {
            success: false,
            message: "Failed to upload ID document",
          },
          500
        );
      }
    }
  );

export default patientRoute;
