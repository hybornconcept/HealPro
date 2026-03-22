import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "./db/schema";
// import { createDb } from "./db";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Variables } from "./types";
import { organization, admin, bearer } from "better-auth/plugins";
// import { env } from "cloudflare:workers";
import { emailService } from "./services/email.service";

export const createAuth = async (
  db: PostgresJsDatabase<typeof schema>,
  env: any
) => {
  if (env.RESEND_API_KEY) {
    console.log("✅ [AUTH] RESEND_API_KEY found, initializing email service");
    emailService.initialize(env.RESEND_API_KEY, env.TEST_EMAIL);
  } else {
    console.warn("⚠️ [AUTH] RESEND_API_KEY not found in environment variables");
  }

  // Custom Lightweight Hasher for Cloudflare Workers (PBKDF2 via node:crypto)
  // Using node:crypto is often more stable in workers for synchronous operations
  const { pbkdf2Sync, randomBytes } = await import("node:crypto");

  const hashPassword = async (password: string) => {
    try {
        console.log("[AUTH] Hashing password (node:crypto)...");
        const salt = randomBytes(16);
        const iterations = 1000;
        const keyLen = 32;
        const digest = "sha256";
        
        const hash = pbkdf2Sync(password, salt, iterations, keyLen, digest);
        
        // Format: v1:iterations:salt(base64):hash(base64)
        const hashStr = `v1:${iterations}:${salt.toString("base64")}:${hash.toString("base64")}`;
        return hashStr;
    } catch (e) {
        console.error("[AUTH] Hashing Failed:", e);
        throw e;
    }
  };

  const verifyPassword = async (password: string, hashStr: string) => {
    try {
      const parts = hashStr.split(":");
      if (parts[0] !== "v1") return false;
      
      const iterations = parseInt(parts[1]);
      const salt = Buffer.from(parts[2], "base64");
      const originalHash = parts[3];
      const keyLen = 32;
      const digest = "sha256";

      const hash = pbkdf2Sync(password, salt, iterations, keyLen, digest);
      const newHashStr = hash.toString("base64");
      
      return newHashStr === originalHash;
    } catch (e) { 
        console.error("[AUTH] Verification Error:", e);
        return false; 
    }
  };

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    // Use custom hasher
    password: {
        hash: hashPassword,
        verify: verifyPassword
    },
    basePath: "/api/auth", // Explicit definition
    user: {
      changeEmail: {
        enabled: true,
      },
      modelName: "userTable",
      additionalFields: {
        userType: {
          type: "string",
          required: false,
          defaultValue: "patient",
          input: true, // Allow input from client
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: false,
      async afterSignUp(user: any, request: any) {
        try {
          // await emailService.sendEmail({
          //   to: user.email,
          //   subject: "Welcome to HealPro!",
          //   html: `
          //     <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          //       <div style="text-align: center; margin-bottom: 30px;">
          //         <h1 style="color: #2563eb; font-size: 24px; font-weight: bold;">HealPro.</h1>
          //       </div>
          //
          //       <p style="font-size: 16px;">Dear ${user.name || "User"},</p>
          //
          //       <p style="font-size: 16px; line-height: 1.5;">
          //         Welcome to HealPro! We are thrilled to have you on board.
          //       </p>
          //
          //       <p style="font-size: 16px; line-height: 1.5;">
          //         Your account has been successfully created. You can now access all our healthcare services and manage your profile.
          //       </p>
          //
          //       <div style="margin-top: 30px; text-align: center;">
          //         <a href="${
          //           env.CLIENT_URL || "http://localhost:5173"
          //         }/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to your Account</a>
          //       </div>
          //
          //       <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
          //          <p style="font-size: 12px; color: #666;">&copy; ${new Date().getFullYear()} HealPro. All rights reserved.</p>
          //       </div>
          //     </div>
          //   `,
          // });
          console.log(
            `📧 [AUTH-SIGNUP] Welcome email suspended for: ${user.email}`
          );
        } catch (e) {
          console.error("Failed to send welcome email", e);
        }
      },
      async afterSignIn(user: any, request: any) {
        try {
          const date = new Date().toLocaleString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          // await emailService.sendEmail({
          //   to: user.email,
          //   subject: "Successful Login to HealPro",
          //   html: `
          //     <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          //       <div style="text-align: center; margin-bottom: 30px;">
          //         <h1 style="color: #2563eb; font-size: 24px; font-weight: bold;">HealPro.</h1>
          //       </div>
          //
          //       <p style="font-size: 16px;">Dear ${user.name || "User"},</p>
          //
          //       <p style="font-size: 16px; line-height: 1.5;">
          //         You successfully logged into your HealPro account on <strong>${date}</strong>.
          //       </p>
          //
          //       <p style="font-size: 16px; line-height: 1.5;">
          //         If you did not initiate this session, please contact our Support Team on 0700 HEALPRO or send an email to <a href="mailto:support@healpro.com" style="color: #2563eb; text-decoration: none;">support@healpro.com</a> immediately.
          //       </p>
          //
          //       <div style="margin-top: 20px;">
          //         <p style="font-size: 16px; line-height: 1.5;">
          //           <strong>Please note: Never share your password with anyone. Create passwords that are hard to guess and don't include personal information in your password.</strong>
          //         </p>
          //         <p style="font-size: 16px; line-height: 1.5;">
          //           Thank you for choosing HealPro.
          //         </p>
          //       </div>

          //       <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
          //          <p style="font-size: 12px; color: #666;">&copy; ${new Date().getFullYear()} HealPro. All rights reserved.</p>
          //       </div>
          //     </div>
          //   `,
          // });
        } catch (e) {
          console.error("Failed to send login notification", e);
        }
      },
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
      },
    },
    trustedOrigins: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:4173",
      "https://healpro-frontend.healpro.workers.dev",
      "https://healprofrontend.healpro.workers.dev",
      "https://healpro.org",
      "https://www.healpro.org"
    ], // Allow frontend origins
    plugins: [
      // organization({
      //   async sendInvitationEmail(data) {
      //     const inviteLink = `${env.CLIENT_URL}/accept-invitation/${data.id}`;
      //     try {
      //       await emailService.sendEmail({
      //         to: data.email,
      //         subject: `Invitation to join ${data.organization.name}`,
      //         html: `
      //           <div>You have been invited to join <strong>${data.organization.name}</strong>.</div>
      //           <br>
      //           <div><a href="${inviteLink}" style="display: inline-block; background-color: #ea580c; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accept Invitation</a></div>
      //           <br>
      //           <div>Invitation Link: ${inviteLink}</div>
      //           <div>This invitation expires in 7 days.</div>
      //         `,
      //       });
      //       console.log(`Invitation email sent to ${data.email}`);
      //     } catch (error) {
      //       console.error(
      //         `Failed to send invitation email to ${data.email}:`,
      //         error
      //       );
      //     }
      //   },
      // }),
      // Removed openAPI() - too CPU intensive for Workers
      // admin({
      //   // Replace with the actual user ID
      // }),
      bearer(),
    ],
  });
};
