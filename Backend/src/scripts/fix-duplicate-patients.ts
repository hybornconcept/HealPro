import postgres from "postgres";
import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config();

const sql = postgres(env.DATABASE_URL!);

async function fixDuplicatePatients() {
  console.log(
    "Starting migration: Fix duplicate patients and add unique constraint"
  );

  try {
    // Step 1: Merge data from patient ID 3 into patient ID 4
    console.log("Step 1: Merging data from patient ID 3 to patient ID 4...");
    await sql`
      UPDATE patients 
      SET 
        blood_group = 'B+',
        genotype = 'AS',
        height = 82,
        weight = 87,
        allergies = 'Enim consequat Qui',
        conditions = 'Nam sit consectetur',
        primary_care_physician = 'Quo ullam hic assume',
        identification_type = 'Voters Card',
        identification_number = '757',
        date_of_birth = '2005-09-22',
        gender = 'Female',
        address = 'Voluptas ad laborum',
        updated_at = NOW()
      WHERE id = 4
    `;
    console.log("✓ Data merged successfully");

    // Step 2: Delete the duplicate patient record
    console.log("Step 2: Deleting duplicate patient record (ID 3)...");
    await sql`DELETE FROM patients WHERE id = 3`;
    console.log("✓ Duplicate record deleted");

    // Step 3: Add unique constraint to email column
    console.log("Step 3: Adding unique constraint to email column...");
    try {
      await sql`ALTER TABLE patients ADD CONSTRAINT patients_email_unique UNIQUE (email)`;
      console.log("✓ Unique constraint added");
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        console.log("⚠ Unique constraint already exists, skipping...");
      } else {
        throw error;
      }
    }

    console.log("\n✅ Migration completed successfully!");

    // Verify the fix
    console.log("\nVerifying fix...");
    const patients = await sql`
      SELECT id, full_name, email, blood_group, genotype, user_id 
      FROM patients 
      WHERE email = 'yikoge2665@aikunkun.com'
      ORDER BY id
    `;
    console.log("Patients with email yikoge2665@aikunkun.com:", patients);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

fixDuplicatePatients()
  .then(() => {
    console.log("\nMigration script finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nMigration script failed:", error);
    process.exit(1);
  });
