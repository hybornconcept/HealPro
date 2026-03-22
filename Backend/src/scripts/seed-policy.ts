import { createDb } from "../lib/db";
import { hmos } from "../lib/db/schema/hmo.schema";
import { policies, plans } from "../lib/db/schema/insurance.schema";
import { patients } from "../lib/db/schema/patients.schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/healpro_local";
const db = createDb(DATABASE_URL);

async function main() {
  console.log("Starting seed process...");

  // 1. Get or Create HMO
  let hmo = await db.select().from(hmos).limit(1);
  let hmoId;
  if (hmo.length === 0) {
    console.log("Creating HMO...");
    const newHmo = await db
      .insert(hmos)
      .values({
        companyName: "Test HMO",
        email: "test@hmo.com",
        customerServicePhone: "1234567890",
        address: "123 Test St",
        // state: "Lagos", // state not in schema based on Step 249
        // status: "active", // status not in schema based on Step 249
      })
      .returning();
    hmoId = newHmo[0].id;
  } else {
    hmoId = hmo[0].id;
    console.log("Using existing HMO:", hmoId);
  }

  // 2. Get or Create Plan
  let plan = await db.select().from(plans).limit(1);
  let planId;
  if (plan.length === 0) {
    console.log("Creating Plan...");
    const newPlan = await db
      .insert(plans)
      .values({
        hmoId: hmoId,
        name: "Gold Plan",
        tier: "Tier 1",
        annualLimit: 1000000,
      })
      .returning();
    planId = newPlan[0].id;
  } else {
    planId = plan[0].id;
    console.log("Using existing Plan:", planId);
  }

  // 3. Get Patient (ID 4)
  const patientId = 4;
  const patient = await db
    .select()
    .from(patients)
    .where(eq(patients.id, patientId));
  if (patient.length === 0) {
    console.error("Patient ID 4 not found!");
    return;
  }
  console.log("Found Patient:", patient[0].fullName);

  // 4. Create Policy
  const policyNumber = "POL-TEST-001";
  let policy = await db
    .select()
    .from(policies)
    .where(eq(policies.policyNumber, policyNumber));

  if (policy.length === 0) {
    console.log("Creating Policy...");
    await db.insert(policies).values({
      principalPatientId: patientId,
      planId: planId,
      policyNumber: policyNumber,
      isActive: true,
      startDate: new Date(),
      expiryDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
    });
  } else {
    console.log("Policy already exists");
  }

  // 5. Update Patient
  console.log("Updating Patient Policy Number...");
  await db
    .update(patients)
    .set({ insurancePolicyNumber: policyNumber })
    .where(eq(patients.id, patientId));

  console.log("Seed complete!");
}

main().catch((err) => {
  console.error("Error seeding data:", err);
  process.exit(1);
});
