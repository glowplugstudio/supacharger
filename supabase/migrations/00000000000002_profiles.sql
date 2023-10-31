create table "public"."profiles" (
    "user_id" uuid not null,
    "first_name" text,
    "last_name" text,
    "profile_title" text,
    "profile_description" text,
    "avatar_url" text,
    "profile_language" text,
    "is_email_notifications_enabled" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid default auth.uid(),
    "updated_at" timestamp with time zone,
    "updated_by" uuid,
    "profile_is_suspended" boolean not null default false
);


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(user_id) not valid;

alter table "public"."profiles" validate constraint "profiles_created_by_fkey";

alter table "public"."profiles" add constraint "profiles_updated_by_fkey" FOREIGN KEY (updated_by) REFERENCES profiles(user_id) not valid;

alter table "public"."profiles" validate constraint "profiles_updated_by_fkey";

CREATE OR REPLACE FUNCTION public.is_current_profile_suspended()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$select profile_is_suspended from profiles where user_id = auth.uid();$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  full_name text;
  first_name text;
  last_name text;
begin
  full_name := coalesce(trim(BOTH new.raw_user_meta_data->>'full_name'), '');

  select
    CASE
      WHEN POSITION(' ' IN full_name) = 0 THEN nullif(full_name, '')
      ELSE LEFT(full_name, LENGTH(full_name) - POSITION(' ' IN REVERSE(full_name)))
    END,
    CASE
      WHEN POSITION(' ' IN full_name) = 0 THEN null
      ELSE SUBSTR(full_name, LENGTH(full_name) - POSITION(' ' IN REVERSE(full_name)) + 2)
    END
    INTO first_name, last_name;

  insert into public.profiles (user_id, first_name, last_name)
  values (new.id, first_name, last_name);

  return new;
end;
$function$
;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "authenticated can only select their profile"
on "public"."profiles"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "authenticated can only update their profile if not suspended"
on "public"."profiles"
as permissive
for update
to authenticated
using (((user_id = auth.uid()) AND (NOT is_current_profile_suspended())))
with check ((user_id = auth.uid()));


CREATE OR REPLACE FUNCTION private.is_profile_suspended(profile_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$select p.profile_is_suspended from public.profiles p where p.user_id = profile_id;$function$
;

CREATE OR REPLACE FUNCTION public.is_current_profile_suspended()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$select private.is_profile_suspended(auth.uid());$function$
;
