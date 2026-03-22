import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function reset() {
  console.log("Resetting database...");
  try {
    await db.execute(sql`
      DROP TABLE IF EXISTS
        user_table,
        session,
        account,
        verification,
        organization,
        member,
        invitation,
        patients,
        hospitals,
        hmos,
        appointments,
        clinical_encounters,
        dependents
      CASCADE;
    `);
    console.log("Database reset complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

reset();
