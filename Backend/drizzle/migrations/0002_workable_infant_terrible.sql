CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"hospital_id" integer NOT NULL,
	"appointment_id" integer,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transfer_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"from_hospital_id" integer NOT NULL,
	"to_hospital_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"reason" text,
	"records_shared" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hmos" ADD COLUMN "contact_phone" varchar(32);--> statement-breakpoint
ALTER TABLE "hmos" ADD COLUMN "contact_name" varchar(200);--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_from_hospital_id_hospitals_id_fk" FOREIGN KEY ("from_hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transfer_requests" ADD CONSTRAINT "transfer_requests_to_hospital_id_hospitals_id_fk" FOREIGN KEY ("to_hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmos" DROP COLUMN "nhia_number";--> statement-breakpoint
ALTER TABLE "hmos" DROP COLUMN "customer_service_phone";--> statement-breakpoint
ALTER TABLE "hmos" DROP COLUMN "claims_email";--> statement-breakpoint
ALTER TABLE "hmos" DROP COLUMN "dispute_email";