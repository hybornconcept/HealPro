import { text, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at", { mode: "date" }).$default(
    () => new Date()
  ),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
};

export const roleEnum = pgEnum("role", [
  "patient",
  "hospital_admin",
  "hmo_admin",
  "super_admin",
]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "pending",
  "confirmed",
  "rejected",
  "completed",
  "cancelled",
  "missed",
]);
export const networkStatusEnum = pgEnum("network_status", [
  "active",
  "suspended",
  "pending",
]);
export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "approved",
  "rejected",
  "paid",
]);
