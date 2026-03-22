CREATE TYPE "public"."appointment_status" AS ENUM('pending', 'confirmed', 'rejected', 'completed', 'cancelled', 'missed');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('pending', 'approved', 'rejected', 'paid');--> statement-breakpoint
CREATE TYPE "public"."network_status" AS ENUM('active', 'suspended', 'pending');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('patient', 'hospital_admin', 'hmo_admin', 'super_admin');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"policy_id" integer,
	"hospital_id" integer NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"appointment_type" varchar(50) DEFAULT 'consultation',
	"unit" varchar(100),
	"duration" integer DEFAULT 30,
	"priority" varchar(20) DEFAULT 'normal',
	"additional_notes" text,
	"hmo_plan" varchar(50),
	"assigned_provider" varchar(200),
	"provider_specialty" varchar(100),
	"requires_follow_up" boolean DEFAULT false,
	"follow_up_date" timestamp,
	"follow_up_notes" text,
	"metadata" json,
	"scheduled_date" timestamp NOT NULL,
	"scheduled_time" varchar(20) NOT NULL,
	"coverage_percentage" integer,
	"estimated_cost" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clinical_encounters" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"encounter_date" timestamp NOT NULL,
	"blood_pressure_systolic" integer,
	"blood_pressure_diastolic" integer,
	"temperature" integer,
	"chief_complaint" text NOT NULL,
	"treatment_plan" text,
	"prescriptions" text,
	"provider_name" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	"type" text NOT NULL,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_table" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text DEFAULT 'patient',
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"phone_number" text,
	"phone_number_verified" boolean,
	"user_type" text DEFAULT 'patient',
	CONSTRAINT "user_table_email_unique" UNIQUE("email"),
	CONSTRAINT "user_table_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hmos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"organization_id" varchar(255),
	"company_name" varchar(200) NOT NULL,
	"website" varchar(255),
	"address" text,
	"logo_url" text,
	"nhia_number" varchar(100),
	"license_type" varchar(50),
	"customer_service_phone" varchar(32),
	"email" varchar(255),
	"claims_email" varchar(255),
	"dispute_email" varchar(255),
	"coverage_states" text,
	"plan_types" text,
	"has_api" boolean DEFAULT false,
	"api_url" varchar(255),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "hmos_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "hmos_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "hospitals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"organization_id" varchar(255),
	"facility_name" varchar(200) NOT NULL,
	"facility_type" varchar(50),
	"facility_tier" varchar(50),
	"primary_phone" varchar(32),
	"contact_person" varchar(200),
	"website" varchar(255),
	"email" varchar(255),
	"address" text,
	"state" varchar(100),
	"city" varchar(100),
	"operating_hours" varchar(100),
	"license_number" varchar(100) NOT NULL,
	"tax_id" varchar(50),
	"cmd_name" varchar(200),
	"cmd_folio" varchar(50),
	"specialties" text,
	"equipment" text,
	"bed_capacity" integer,
	"bank_name" varchar(100),
	"account_number" varchar(20),
	"account_name" varchar(200),
	"verification_status" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "hospitals_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "hospitals_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"full_name" varchar(200),
	"email" varchar(255),
	"date_of_birth" timestamp,
	"gender" varchar(16),
	"address" text,
	"state" varchar(100),
	"phone_number" varchar(32),
	"identification_type" varchar(50),
	"identification_number" varchar(100),
	"id_document_url" text,
	"blood_group" varchar(5),
	"genotype" varchar(5),
	"height" integer,
	"weight" integer,
	"allergies" text,
	"current_medications" text,
	"past_medical_history" text,
	"emergency_contact_name" varchar(200),
	"emergency_contact_relation" varchar(50),
	"emergency_phone" varchar(32),
	"occupation" varchar(100),
	"nok_name" varchar(200),
	"nok_relationship" varchar(50),
	"nok_phone" varchar(32),
	"hmo_provider" varchar(100),
	"insurance_policy_number" varchar(100),
	"plan_tier" varchar(50),
	"corporate_code" varchar(50),
	"policy_role" varchar(20),
	"policy_relationship" varchar(50),
	"conditions" text,
	"family_medical_history" text,
	"primary_care_physician" varchar(200),
	"consent_receive_treatment" boolean DEFAULT false,
	"consent_use_disclosure" boolean DEFAULT false,
	"consent_privacy_policy" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "patients_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" serial PRIMARY KEY NOT NULL,
	"policy_id" integer NOT NULL,
	"patient_id" integer NOT NULL,
	"hospital_id" integer NOT NULL,
	"appointment_id" integer,
	"amount" integer NOT NULL,
	"diagnosis" text,
	"status" "claim_status" DEFAULT 'pending',
	"auth_code" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dependents" (
	"id" serial PRIMARY KEY NOT NULL,
	"policy_id" integer NOT NULL,
	"dependent_patient_id" integer NOT NULL,
	"relationship" varchar(50) NOT NULL,
	"unique_dependent_id" varchar(100),
	CONSTRAINT "dependents_dependent_patient_id_unique" UNIQUE("dependent_patient_id")
);
--> statement-breakpoint
CREATE TABLE "hospital_hmo_networks" (
	"id" serial PRIMARY KEY NOT NULL,
	"hospital_id" integer NOT NULL,
	"hmo_id" integer NOT NULL,
	"status" "network_status" DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"hmo_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"tier" varchar(50),
	"max_dependents" integer DEFAULT 3,
	"annual_limit" integer
);
--> statement-breakpoint
CREATE TABLE "policies" (
	"id" serial PRIMARY KEY NOT NULL,
	"principal_patient_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"policy_number" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true,
	"start_date" timestamp,
	"expiry_date" timestamp,
	CONSTRAINT "policies_policy_number_unique" UNIQUE("policy_number")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinical_encounters" ADD CONSTRAINT "clinical_encounters_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_table_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hmos" ADD CONSTRAINT "hmos_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hospitals" ADD CONSTRAINT "hospitals_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_user_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependents" ADD CONSTRAINT "dependents_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dependents" ADD CONSTRAINT "dependents_dependent_patient_id_patients_id_fk" FOREIGN KEY ("dependent_patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hospital_hmo_networks" ADD CONSTRAINT "hospital_hmo_networks_hospital_id_hospitals_id_fk" FOREIGN KEY ("hospital_id") REFERENCES "public"."hospitals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hospital_hmo_networks" ADD CONSTRAINT "hospital_hmo_networks_hmo_id_hmos_id_fk" FOREIGN KEY ("hmo_id") REFERENCES "public"."hmos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_hmo_id_hmos_id_fk" FOREIGN KEY ("hmo_id") REFERENCES "public"."hmos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_principal_patient_id_patients_id_fk" FOREIGN KEY ("principal_patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "policies" ADD CONSTRAINT "policies_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "hospital_hmo_unique_idx" ON "hospital_hmo_networks" USING btree ("hospital_id","hmo_id");