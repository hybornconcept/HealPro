import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./auth.schema";
import { hospitalHmoNetworks } from "./insurance.schema";
import { appointments } from "./appointments.schema";

export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id)
    .unique(), // Link to Admin Login
  organizationId: varchar("organization_id", { length: 255 }).unique(),

  // --- Identity ---
  facilityName: varchar("facility_name", { length: 200 }).notNull(),
  facilityType: varchar("facility_type", { length: 50 }), // Clinic, Hospital, etc.
  facilityTier: varchar("facility_tier", { length: 50 }), // Primary, Secondary, Tertiary

  // --- Contact ---
  primaryPhone: varchar("primary_phone", { length: 32 }), // mapped from 'phone'
  contactPerson: varchar("contact_person", { length: 200 }),
  website: varchar("website", { length: 255 }),
  email: varchar("email", { length: 255 }), // Public contact email

  // --- Location ---
  address: text("address"),
  state: varchar("state", { length: 100 }),
  city: varchar("city", { length: 100 }), // You might want to add this to your form later
  operatingHours: varchar("operating_hours", { length: 100 }), // e.g., "24/7" or "8am-5pm"

  // --- Compliance & CMD ---
  licenseNumber: varchar("license_number", { length: 100 }).notNull(),
  taxId: varchar("tax_id", { length: 50 }),
  cmdName: varchar("cmd_name", { length: 200 }), // Chief Medical Director
  cmdFolio: varchar("cmd_folio", { length: 50 }), // CMD License No

  // --- Services (Storing arrays as Text/JSON is easiest for tags) ---
  // Usage: JSON.stringify(formData.specialties)
  specialties: text("specialties"),
  equipment: text("equipment"),
  bedCapacity: integer("bed_capacity"),

  // --- Financials ---
  bankName: varchar("bank_name", { length: 100 }),
  accountNumber: varchar("account_number", { length: 20 }),
  accountName: varchar("account_name", { length: 200 }),

  // --- Metadata ---
  verificationStatus: boolean("verification_status").default(false), // Logic for Admin approval
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hospitalsRelations = relations(hospitals, ({ one, many }) => ({
  user: one(userTable, {
    fields: [hospitals.userId],
    references: [userTable.id],
  }),
  hmoNetworks: many(hospitalHmoNetworks),
  appointments: many(appointments),
}));
