create extension if not exists "http" with schema "extensions";

CREATE OR REPLACE FUNCTION private.delete_storage_object(bucket text, object text, OUT status integer, OUT content text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  project_url text;
  service_role_key text;
  url text;
begin
  select ds.decrypted_secret into project_url
  from vault.decrypted_secrets ds where ds.name = 'SUPABASE_URL';
  select ds.decrypted_secret into service_role_key
  from vault.decrypted_secrets ds where ds.name = 'SUPABASE_SERVICE_ROLE_KEY';

  url = project_url||'/storage/v1/object/'||bucket||'/'||object;

  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)], --  full access needed
    NULL,
    NULL)::extensions.http_request) as result;
end;
$function$
;

create or replace function private.delete_storage_object_from_url(object_url text, OUT status integer, OUT content text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  bucket_name text;
  object_name text;
begin
  select split_part(storage.filename(object_url), '?', 1) into object_name;

  if substring(object_url from 'object/') is not null then
    -- object_url has this formats:
    -- - [...][/object]/authenticated/{bucket_name}/{object_full_path}
    -- - [...][/object]/public/{bucket_name}/{object_full_path}
    -- - [...][/object]/sign/{bucket_name}/{object_full_path}
    select split_part(split_part(object_url, '/object/', 2), '/', 2) into bucket_name;
  elsif (
    starts_with(object_url, '/authenticated') or
    starts_with(object_url, '/public') or
    starts_with(object_url, '/sign')
  ) then
    -- object_url has format [/authenticated | /public | /sign]/{bucket_name}/{object_full_path}
    select split_part(object_url, '/', 3) into bucket_name;
  else
    -- object_url has format /{bucket_name}/{object_full_path}
    select split_part(object_url, '/', 2) into bucket_name;
  end if;

  select into status, content
    result.status::int, result.content::text
    from private.delete_storage_object(
      bucket_name,
      object_name
    ) as result;
end;
$function$
;
