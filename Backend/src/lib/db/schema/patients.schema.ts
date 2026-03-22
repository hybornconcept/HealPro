import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./auth.schema";
import { policies } from "./insurance.schema";
import { appointments } from "./appointments.schema";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id)
    .unique(),

  // Personal Details
  fullName: varchar("full_name", { length: 200 }),
  email: varchar("email", { length: 255 }).unique(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 16 }),
  address: text("address"),
  state: varchar("state", { length: 100 }), // Added state
  phone: varchar("phone_number", { length: 32 }),

  // Identification
  identificationType: varchar("identification_type", { length: 50 }),
  identificationNumber: varchar("identification_number", { length: 100 }),
  idDocumentUrl: text("id_document_url"),

  // Medical Profile
  bloodGroup: varchar("blood_group", { length: 5 }),
  genotype: varchar("genotype", { length: 5 }),
  height: integer("height"), // Added height (cm)
  weight: integer("weight"), // Added weight (kg)
  allergies: text("allergies"),
  currentMedications: text("current_medications"),
  pastMedicalHistory: text("past_medical_history"),

  // Emergency
  emergencyContactName: varchar("emergency_contact_name", { length: 200 }),
  emergencyContactRelation: varchar("emergency_contact_relation", {
    length: 50,
  }), // Added relation
  emergencyPhone: varchar("emergency_phone", { length: 32 }),

  // Additional Fields
  occupation: varchar("occupation", { length: 100 }),

  // NOK
  nokName: varchar("nok_name", { length: 200 }),
  nokRelationship: varchar("nok_relationship", { length: 50 }),
  nokPhone: varchar("nok_phone", { length: 32 }),

  // Insurance
  hmoProvider: varchar("hmo_provider", { length: 100 }),
  insurancePolicyNumber: varchar("insurance_policy_number", { length: 100 }),
  planTier: varchar("plan_tier", { length: 50 }),
  corporateCode: varchar("corporate_code", { length: 50 }),
  policyRole: varchar("policy_role", { length: 20 }),
  policyRelationship: varchar("policy_relationship", { length: 50 }),

  // Medical Extended
  conditions: text("conditions"),
  familyMedicalHistory: text("family_medical_history"),
  primaryCarePhysician: varchar("primary_care_physician", { length: 200 }),

  // Consents
  consentReceiveTreatment: boolean("consent_receive_treatment").default(false),
  consentUseDisclosure: boolean("consent_use_disclosure").default(false),
  consentPrivacyPolicy: boolean("consent_privacy_policy").default(false),

  // Meta
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(userTable, {
    fields: [patients.userId],
    references: [userTable.id],
  }),
  policies: many(policies),
  appointments: many(appointments),
}));
