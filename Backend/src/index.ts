import { Hono } from "hono";
import { factory } from "./lib/factory";
import { createAuth } from "./lib/auth";
import customCors from "./middlewares/cors";
import patientRoute from "./routes/patients.route";
import hmoRoute from "./routes/hmo.route";
import hospitalRoute from "./routes/hospital.route";
import appointmentRoute from "./routes/appointments.route";
import { claimsRoute } from "./routes/claims.route";
import { roleRoute } from "./routes/role.route";
import { simpleAuthRoute } from "./routes/simple-auth.route";





// Create app instance using factory
const app = factory
  .createApp({ strict: false })
  .basePath("/api")
  // Add global middleware
  .use("*", customCors);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});











// Commenting out better-auth handler - it's too CPU-intensive for Workers
// app.on(["POST", "GET"], "/auth/*", async (c) => {
//   const auth = c.get("auth");
//   console.log(`[AUTH] Request: ${c.req.method} ${c.req.url}`);
//   if (!auth) {
//     console.error("[AUTH] Auth object is missing in context!");
//     return c.json({ error: "Auth not initialized" }, 500);
//   }
//   return auth.handler(c.req.raw);
// });

export const routes = app
  .route("/auth", simpleAuthRoute)  // Lightweight auth system
  .route("/patients", patientRoute)
  .route("/hmos", hmoRoute)
  .route("/hospitals", hospitalRoute)
  .route("/appointments", appointmentRoute)
  .route("/claims", claimsRoute)
  .route("/role", roleRoute);

export default {
  // The Hono app handles regular HTTP requests
  fetch: routes.fetch,
};
