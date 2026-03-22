import { z } from "zod";

// Hospital creation schema - Updated to match database schema
export const createHospitalSchema = z.object({
  // Auth & Organization
  userId: z.string().optional(),
  organizationId: z.string().optional(), // Can be auto-generated in backend

  // Identity
  facilityName: z.string().min(1, "Facility name is required"),
  facilityType: z.string().optional(),
  facilityTier: z.string().optional(),

  // Contact
  contactPerson: z.string().optional(),
  primaryPhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),

  // Location
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  operatingHours: z.string().optional(),

  // Compliance & CMD
  licenseNumber: z.string().min(1, "License number is required"),
  taxId: z.string().optional(),
  cmdName: z.string().optional(),
  cmdFolio: z.string().optional(),

  // Services
  specialties: z.string().optional(), // JSON string from frontend
  equipment: z.string().optional(), // JSON string from frontend
  bedCapacity: z.number().int().positive().optional().nullable(),

  // Financials
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),

  // Legacy/Additional fields (for backward compatibility)
  zipCode: z.string().optional(),
  country: z.string().default("Nigeria"),
  alternatePhone: z.string().optional(),
  representativeName: z.string().optional(),
  representativePosition: z.string().optional(),
  representativePhone: z.string().optional(),
  representativeEmail: z.string().email().optional().or(z.literal("")),
  acceptedInsurance: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  servicesOffered: z.array(z.string()).optional(),
  bedCount: z.number().int().positive().optional(),
  staffCount: z.number().int().positive().optional(),
  yearEstablished: z.number().int().positive().optional(),
  consentTerms: z.boolean().default(false),
  consentDataSharing: z.boolean().default(false),
  consentVerification: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
});

// Hospital update schema (partial)
export const updateHospitalSchema = createHospitalSchema.partial();

// Query schema for GET requests
export const getHospitalsQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

// Params schema for ID-based routes
export const hospitalIdParamSchema = z.object({
  id: z.string().transform(Number),
});

export const hospitalDocUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(["license", "admin_id", "other"]).default("other"),
});
