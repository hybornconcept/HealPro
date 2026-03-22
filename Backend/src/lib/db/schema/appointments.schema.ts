import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  timestamp,
  boolean,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { patients } from "./patients.schema";
import { hospitals } from "./hospital.schema";
import { policies } from "./insurance.schema";

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),

  // Who?
  patientId: integer("patient_id")
    .references(() => patients.id)
    .notNull(),
  // Which Insurance covers this visit? (NEW)
  policyId: integer("policy_id").references(() => policies.id),
  // Where?
  hospitalId: integer("hospital_id")
    .references(() => hospitals.id)
    .notNull(),

  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),

  appointmentType: varchar("appointment_type", { length: 50 }).default(
    "consultation"
  ),
  unit: varchar("unit", { length: 100 }),
  duration: integer("duration").default(30),
  priority: varchar("priority", { length: 20 }).default("normal"),
  additionalNotes: text("additional_notes"),
  hmoPlan: varchar("hmo_plan", { length: 50 }),

  assignedProvider: varchar("assigned_provider", { length: 200 }),
  providerSpecialty: varchar("provider_specialty", { length: 100 }),

  requiresFollowUp: boolean("requires_follow_up").default(false),
  followUpDate: timestamp("follow_up_date"),
  followUpNotes: text("follow_up_notes"),

  metadata: json("metadata"),

  // Scheduling
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: varchar("scheduled_time", { length: 20 }).notNull(),

  // Costs (Kept your original fields)
  coveragePercentage: integer("coverage_percentage"),
  estimatedCost: integer("estimated_cost"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clinicalEncounters = pgTable("clinical_encounters", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id")
    .references(() => appointments.id)
    .notNull(),
  encounterDate: timestamp("encounter_date").notNull(),

  // Vitals
  bloodPressureSystolic: integer("blood_pressure_systolic"),
  bloodPressureDiastolic: integer("blood_pressure_diastolic"),
  temperature: integer("temperature"),

  // Notes
  chiefComplaint: text("chief_complaint").notNull(),
  treatmentPlan: text("treatment_plan"),
  prescriptions: text("prescriptions"),

  // Who did it?
  providerName: varchar("provider_name", { length: 200 }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const clinicalEncountersRelations = relations(
  clinicalEncounters,
  ({ one }) => ({
    appointment: one(appointments, {
      fields: [clinicalEncounters.appointmentId],
      references: [appointments.id],
    }),
  })
);

export const appointmentsRelations = relations(
  appointments,
  ({ one, many }) => ({
    patient: one(patients, {
      fields: [appointments.patientId],
      references: [patients.id],
    }),
    hospital: one(hospitals, {
      fields: [appointments.hospitalId],
      references: [hospitals.id],
    }),
    policy: one(policies, {
      fields: [appointments.policyId],
      references: [policies.id],
    }),
    clinicalEncounters: many(clinicalEncounters),
  })
);
