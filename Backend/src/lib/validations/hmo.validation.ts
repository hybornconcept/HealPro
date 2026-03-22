import { z } from "zod";

// HMO creation schema - UPDATED TO MATCH NEW STRUCTURE
export const createHmoSchema = z.object({
  userId: z.string().optional(), // Added by frontend after user registration
  organizationId: z.string().min(1, "Organization ID is required"),
  companyName: z.string().min(1, "Company name is required"),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  licenseType: z.string().optional(),
  // NEW SIMPLIFIED CONTACT FIELDS
  contactPhone: z.string().optional(),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")), // Admin login email
  coverageStates: z.string().optional(), // JSON string
  planTypes: z.string().optional(), // JSON string
  hasApi: z.boolean().optional(),
  apiUrl: z.string().url().optional().or(z.literal("")),
});

// HMO update schema (partial)
export const updateHmoSchema = createHmoSchema.partial();

// Query schema for GET requests
export const getHmosQuerySchema = z.object({
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
});

// Params schema for ID-based routes
export const hmoIdParamSchema = z.object({
  id: z.string().transform(Number),
});
