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

async function verify() {
  console.log("Verifying database reset...");
  try {
    const result = await db.execute(sql`SELECT count(*) FROM user_table`);
    console.log("User count:", result[0].count);
    process.exit(0);
  } catch (error) {
    console.error("Error verifying database:", error);
    process.exit(1);
  }
}

verify();
