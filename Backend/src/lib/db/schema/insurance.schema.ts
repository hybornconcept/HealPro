import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { hmos } from "./hmo.schema";
import { patients } from "./patients.schema";
import { hospitals } from "./hospital.schema";
import { appointments } from "./appointments.schema";
import { claimStatusEnum, networkStatusEnum } from "./utils.schema";

// PLANS
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  hmoId: integer("hmo_id")
    .references(() => hmos.id)
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  tier: varchar("tier", { length: 50 }),
  maxDependents: integer("max_dependents").default(3),
  annualLimit: integer("annual_limit"),
});

// POLICIES
export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  principalPatientId: integer("principal_patient_id")
    .references(() => patients.id)
    .notNull(),
  planId: integer("plan_id")
    .references(() => plans.id)
    .notNull(),
  policyNumber: varchar("policy_number", { length: 100 }).notNull().unique(),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date"),
  expiryDate: timestamp("expiry_date"),
});

// DEPENDENTS
export const dependents = pgTable("dependents", {
  id: serial("id").primaryKey(),
  policyId: integer("policy_id")
    .references(() => policies.id)
    .notNull(),
  dependentPatientId: integer("dependent_patient_id")
    .references(() => patients.id)
    .notNull()
    .unique(),
  relationship: varchar("relationship", { length: 50 }).notNull(),
  uniqueDependentId: varchar("unique_dependent_id", { length: 100 }),
});

// HOSPITAL <-> HMO NETWORK
export const hospitalHmoNetworks = pgTable(
  "hospital_hmo_networks",
  {
    id: serial("id").primaryKey(),
    hospitalId: integer("hospital_id")
      .references(() => hospitals.id)
      .notNull(),
    hmoId: integer("hmo_id")
      .references(() => hmos.id)
      .notNull(),
    status: networkStatusEnum("status").default("active"),
  },
  (t) => ({
    unq: uniqueIndex("hospital_hmo_unique_idx").on(t.hospitalId, t.hmoId),
  })
);

// CLAIMS
// CLAIMS
export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull(), // Not unique, groups items
  serviceDate: timestamp("service_date").notNull(),

  // Service Item Details
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  serviceCode: varchar("service_code", { length: 50 }),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(), // Stored in lowest unit (e.g., kobo/cents) or standard unit
  amount: integer("amount").notNull(), // Line item total

  // Relationships (Repeated for each item)
  policyId: integer("policy_id")
    .references(() => policies.id)
    .notNull(),
  patientId: integer("patient_id")
    .references(() => patients.id)
    .notNull(),
  hospitalId: integer("hospital_id")
    .references(() => hospitals.id)
    .notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),

  diagnosis: text("diagnosis"),
  status: claimStatusEnum("status").default("pending"),
  authCode: varchar("auth_code", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// RELATIONS
export const plansRelations = relations(plans, ({ one, many }) => ({
  hmo: one(hmos, { fields: [plans.hmoId], references: [hmos.id] }),
  policies: many(policies),
}));

export const policiesRelations = relations(policies, ({ one, many }) => ({
  plan: one(plans, { fields: [policies.planId], references: [plans.id] }),
  principal: one(patients, {
    fields: [policies.principalPatientId],
    references: [patients.id],
  }),
  dependents: many(dependents),
}));

export const dependentsRelations = relations(dependents, ({ one }) => ({
  policy: one(policies, {
    fields: [dependents.policyId],
    references: [policies.id],
  }),
  profile: one(patients, {
    fields: [dependents.dependentPatientId],
    references: [patients.id],
  }),
}));

export const hospitalHmoNetworksRelations = relations(
  hospitalHmoNetworks,
  ({ one }) => ({
    hmo: one(hmos, {
      fields: [hospitalHmoNetworks.hmoId],
      references: [hmos.id],
    }),
    hospital: one(hospitals, {
      fields: [hospitalHmoNetworks.hospitalId],
      references: [hospitals.id],
    }),
  })
);
