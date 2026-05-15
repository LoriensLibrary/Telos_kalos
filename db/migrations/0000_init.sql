CREATE TABLE "dexa_scans" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"scan_number" integer NOT NULL,
	"label" text NOT NULL,
	"fat" real NOT NULL,
	"lean" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"init" text NOT NULL,
	"status" text NOT NULL,
	"goals" jsonb NOT NULL,
	"analyst" text NOT NULL,
	"triangle" jsonb NOT NULL,
	"triangle_proj" jsonb NOT NULL,
	"met_fat" text NOT NULL,
	"met_fat_d" text NOT NULL,
	"met_lean" text NOT NULL,
	"met_lean_d" text NOT NULL,
	"met_visc" text NOT NULL,
	"met_visc_d" text NOT NULL,
	"wear_hrv" text NOT NULL,
	"wear_sleep" text NOT NULL,
	"wear_recov" text NOT NULL,
	"wear_glu" text NOT NULL,
	"adherence" jsonb NOT NULL,
	"next_label" text NOT NULL,
	"sug_change" text NOT NULL,
	"sug_reason" text NOT NULL,
	"sug_conf" text NOT NULL,
	"flag" text,
	"brief_when" text NOT NULL,
	"brief_rows" jsonb NOT NULL,
	"brief_pts" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_drafts" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text,
	"member_name" text NOT NULL,
	"init" text NOT NULL,
	"drafted_at" text NOT NULL,
	"trigger" text NOT NULL,
	"body" text NOT NULL,
	"conf" text NOT NULL,
	"source" text NOT NULL,
	"state" text DEFAULT 'pending' NOT NULL,
	"is_live" integer DEFAULT 0 NOT NULL,
	"model" text,
	"input_tokens" integer,
	"output_tokens" integer,
	"edited_body" text,
	"decision_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dexa_scans" ADD CONSTRAINT "dexa_scans_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;