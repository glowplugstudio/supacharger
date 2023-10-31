create table "public"."admins" (
    "admin_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone,
    "created_by" uuid,
    "updated_by" uuid
);


alter table "public"."admins" enable row level security;

CREATE UNIQUE INDEX admins_pkey ON public.admins USING btree (admin_id);

alter table "public"."admins" add constraint "admins_pkey" PRIMARY KEY using index "admins_pkey";

alter table "public"."admins" add constraint "admins_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES profiles(user_id) not valid;

alter table "public"."admins" validate constraint "admins_admin_id_fkey";

alter table "public"."admins" add constraint "admins_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(user_id) not valid;

alter table "public"."admins" validate constraint "admins_created_by_fkey";

alter table "public"."admins" add constraint "admins_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES profiles(user_id) not valid;

alter table "public"."admins" validate constraint "admins_updated_by_fkey";

CREATE OR REPLACE FUNCTION public.is_current_profile_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$select exists(select 1 from admins where admin_id = auth.uid())$function$
;

create policy "admins can do all operations"
on "public"."admins"
as permissive
for all
to authenticated
using (is_current_profile_admin())
with check (is_current_profile_admin());

create policy "admins can do all operations"
on "public"."profiles"
as permissive
for all
to authenticated
using (is_current_profile_admin());

CREATE OR REPLACE FUNCTION private.is_profile_admin(profile_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$select exists(select 1 from public.admins a where a.admin_id = profile_id)$function$
;

CREATE OR REPLACE FUNCTION public.is_current_profile_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$select private.is_profile_admin(auth.uid())$function$
;
