import { db } from "../lib/db";
import { policies, patients } from "../lib/db/schema/insurance.schema";
import { patients as patientsTable } from "../lib/db/schema/patients.schema";

async function main() {
  console.log("Checking Policies...");
  const allPolicies = await db.select().from(policies);
  console.log("All Policies:", JSON.stringify(allPolicies, null, 2));

  console.log("\nChecking Patients...");
  const allPatients = await db.select().from(patientsTable);
  console.log("All Patients:", JSON.stringify(allPatients, null, 2));
}

main().catch(console.error);
