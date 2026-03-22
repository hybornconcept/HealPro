import { factory } from "../lib/factory";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { claims, policies } from "../lib/db/schema/insurance.schema";
import { eq } from "drizzle-orm";

export const claimsRoute = factory.createApp().post(
  "/",
  zValidator(
    "json",
    z.object({
      invoiceNumber: z.string(),
      serviceDate: z.string(), // ISO Date string
      patientId: z.coerce.number(),
      hospitalId: z.coerce.number(),
      policyNumber: z.string(),
      items: z.array(
        z.object({
          serviceName: z.string(),
          serviceCode: z.string().optional(),
          quantity: z.number(),
          unitPrice: z.number(),
          amount: z.number(),
        })
      ),
    }),
    (result, c) => {
      if (!result.success) {
        console.log("Validation Error:", JSON.stringify(result.error, null, 2));
        return c.json(
          {
            success: false,
            message: "Validation Failed",
            errors: result.error,
          },
          400
        );
      }
    }
  ),
  async (c) => {
    const db = c.get("db");
    const body = c.req.valid("json");
    console.log("Claims Submission Body:", JSON.stringify(body, null, 2));

    const {
      invoiceNumber,
      serviceDate,
      patientId,
      hospitalId,
      policyNumber,
      items,
    } = body;

    try {
      // Resolve Policy ID
      const policy = await db
        .select()
        .from(policies)
        .where(eq(policies.policyNumber, policyNumber))
        .limit(1);

      if (policy.length === 0) {
        console.log(`Policy not found for number: ${policyNumber}`);
        return c.json(
          { success: false, message: "Policy not found for the given number" },
          400
        );
      }
      const policyId = policy[0].id;

      // Insert each item as a separate row in the claims table
      const claimPromises = items.map((item) => {
        return db.insert(claims).values({
          invoiceNumber,
          serviceDate: new Date(serviceDate),
          patientId,
          hospitalId,
          policyId,
          serviceName: item.serviceName,
          serviceCode: item.serviceCode,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
          status: "pending",
        });
      });

      await Promise.all(claimPromises);

      return c.json({
        success: true,
        message: "Claims submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting claims:", error);
      return c.json(
        { success: false, message: "Failed to submit claims" },
        500
      );
    }
  }
);
