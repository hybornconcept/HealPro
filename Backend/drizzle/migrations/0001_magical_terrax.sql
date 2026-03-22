ALTER TABLE "claims" ADD COLUMN "invoice_number" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "claims" ADD COLUMN "service_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "claims" ADD COLUMN "service_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "claims" ADD COLUMN "service_code" varchar(50);--> statement-breakpoint
ALTER TABLE "claims" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "claims" ADD COLUMN "unit_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_email_unique" UNIQUE("email");