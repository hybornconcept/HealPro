import { z } from "zod";

// Patient creation schema
export const createPatientSchema = z.object({
  userId: z.string().min(1, "User ID is required"), // Link to auth user
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  dateOfBirth: z.string().optional(), // ISO date string
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  occupation: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(), // Added state field

  // NOK
  nokName: z.string().optional(),
  nokRelationship: z.string().optional(),
  nokPhone: z.string().optional(),

  // Insurance
  hmoProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  planTier: z.string().optional(),
  corporateCode: z.string().optional(),
  sponsorId: z.string().optional(),
  policyRole: z.enum(["principal", "dependent"]).optional(),
  policyRelationship: z.string().optional(),

  // Medical
  bloodGroup: z.string().optional(),
  genotype: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  allergies: z.string().optional(), // JSON string or comma separated
  conditions: z.string().optional(), // JSON string or comma separated

  primaryCarePhysician: z.string().optional(),
  currentMedications: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationType: z.string().optional(),
  identificationNumber: z.string().optional(),
  idDocumentUrl: z.string().url().optional(),
  consentReceiveTreatment: z.boolean().default(false),
  consentUseDisclosure: z.boolean().default(false),
  consentPrivacyPolicy: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

// Patient update schema (partial)
export const updatePatientSchema = createPatientSchema.partial();

// Query schema for GET requests
export const getPatientsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

// Params schema for ID-based routes
export const patientIdParamSchema = z.object({
  id: z.string().transform(Number),
});

// File upload schema for ID documents
export const idDocumentUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => {
      const allowedTypes = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      return allowedTypes.includes(file.type);
    }, "Invalid file type. Allowed: SVG, PNG, JPG, GIF, PDF, DOC, DOCX.")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size too large. Maximum size is 5MB."
    ),
});
