import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./auth.schema";
import { plans, hospitalHmoNetworks } from "./insurance.schema";

export const hmos = pgTable("hmos", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => userTable.id)
    .unique(), // Link to Admin Login
  organizationId: varchar("organization_id", { length: 255 }).unique(),

  // --- Corporate Identity ---
  companyName: varchar("company_name", { length: 200 }).notNull(),
  website: varchar("website", { length: 255 }),
  address: text("address"),
  logoUrl: text("logo_url"),

  // --- Compliance ---
  licenseType: varchar("license_type", { length: 50 }), // National/Regional/State

  // --- Operational Contacts - SIMPLIFIED ---
  contactPhone: varchar("contact_phone", { length: 32 }), // Contact person phone
  contactName: varchar("contact_name", { length: 200 }), // Contact person name
  email: varchar("email", { length: 255 }), // Admin email - used for LOGIN

  // --- Coverage & Config (Arrays stored as text/JSON) ---
  coverageStates: text("coverage_states"), // e.g. ["Lagos", "Abuja"]
  planTypes: text("plan_types"), // e.g. ["Retail", "Corporate"]

  // --- API Configuration ---
  hasApi: boolean("has_api").default(false),
  apiUrl: varchar("api_url", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
});

export const hmosRelations = relations(hmos, ({ one, many }) => ({
  user: one(userTable, { fields: [hmos.userId], references: [userTable.id] }),
  plans: many(plans),
  hospitalNetworks: many(hospitalHmoNetworks),
}));
