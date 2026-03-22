import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { patients } from "./patients.schema";
import { hospitals } from "./hospital.schema";
import { appointments } from "./appointments.schema";

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .references(() => patients.id)
    .notNull(),
  hospitalId: integer("hospital_id")
    .references(() => hospitals.id)
    .notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id),

  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),

  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  patient: one(patients, {
    fields: [reviews.patientId],
    references: [patients.id],
  }),
  hospital: one(hospitals, {
    fields: [reviews.hospitalId],
    references: [hospitals.id],
  }),
  appointment: one(appointments, {
    fields: [reviews.appointmentId],
    references: [appointments.id],
  }),
}));
