import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { patients } from "./patients.schema";
import { hospitals } from "./hospital.schema";

export const transferRequests = pgTable("transfer_requests", {
  id: serial("id").primaryKey(),

  patientId: integer("patient_id")
    .references(() => patients.id)
    .notNull(),

  fromHospitalId: integer("from_hospital_id")
    .references(() => hospitals.id)
    .notNull(),

  toHospitalId: integer("to_hospital_id")
    .references(() => hospitals.id)
    .notNull(),

  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, accepted, rejected, completed
  reason: text("reason"),

  recordsShared: boolean("records_shared").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transferRequestsRelations = relations(
  transferRequests,
  ({ one }) => ({
    patient: one(patients, {
      fields: [transferRequests.patientId],
      references: [patients.id],
    }),
    fromHospital: one(hospitals, {
      fields: [transferRequests.fromHospitalId],
      references: [hospitals.id],
    }),
    toHospital: one(hospitals, {
      fields: [transferRequests.toHospitalId],
      references: [hospitals.id],
    }),
  })
);
