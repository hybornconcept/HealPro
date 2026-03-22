import { factory } from "../lib/factory";
import { patients } from "../lib/db/schema/patients.schema";
import { hospitals } from "../lib/db/schema/hospital.schema";
import { hmos } from "../lib/db/schema/hmo.schema";
import { SimpleAuth } from "../lib/simple-auth";
import { eq } from "drizzle-orm";

export const roleRoute = factory.createApp().get("/", async (c) => {
  const db = c.get("db");
  const sessionToken = c.req.header("cookie")?.match(/session_token=([^;]+)/)?.[1];

  if (!sessionToken) {
    console.log("[ROLE CHECK] No session token found");
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const auth = new SimpleAuth(db);
  const sessionData = await auth.getSession(sessionToken);

  if (!sessionData || !sessionData.user) {
    console.log("[ROLE CHECK] Invalid or expired session");
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  const userId = sessionData.user.id;

  console.log(`[ROLE CHECK] Checking role for userId: ${userId}`);

  // PERFORMANCE OPTIMIZATION: Run all queries in parallel instead of sequential
  // This is much faster for large databases as queries execute concurrently
  const [patientResult, hospitalResult, hmoResult] = await Promise.all([
    db.select().from(patients).where(eq(patients.userId, userId)).limit(1),
    db.select().from(hospitals).where(eq(hospitals.userId, userId)).limit(1),
    db.select().from(hmos).where(eq(hmos.userId, userId)).limit(1),
  ]);

  // Check patient first (most common users)
  if (patientResult.length > 0) {
    console.log(`[ROLE CHECK] Found in patients table by email`);
    return c.json({ success: true, role: "patient", redirect: "/user" });
  }

  // Check hospital
  if (hospitalResult.length > 0) {
    console.log(`[ROLE CHECK] Found in hospitals table by email`);
    return c.json({ success: true, role: "hospital", redirect: "/facility" });
  }

  // Check HMO
  if (hmoResult.length > 0) {
    console.log(`[ROLE CHECK] Found in hmos table by email`);
    return c.json({ success: true, role: "hmo", redirect: "/hmo" });
  }

  console.log(`[ROLE CHECK] User not found in any role table`);
  return c.json({ success: false, error: "Role not found" }, 404);
});
