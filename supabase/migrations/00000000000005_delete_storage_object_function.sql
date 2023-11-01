create extension if not exists "http" with schema "extensions";

CREATE OR REPLACE FUNCTION private.delete_storage_object(object_path text, OUT status integer, OUT content text)
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

  url = project_url||'/storage/v1/object/'||object_path;

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

create or replace function private.get_storage_object_path(object_url text, out object_path text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  object_name text;
  path_parts text[];
  ret record;
begin
  select storage.foldername(object_url) into path_parts;
  select split_part(storage.filename(object_url), '?', 1) into object_name;

  -- object_url can have these formats:
  -- - [...][/object]/authenticated/{bucket_name}/{object_full_path}
  -- - [...][/object]/public/{bucket_name}/{object_full_path}
  -- - [...][/object]/sign/{bucket_name}/{object_full_path}
  -- - [/authenticated | /public | /sign]/{bucket_name}/{object_full_path}
  -- - /{bucket_name}/{object_full_path}

  path_parts = path_parts[coalesce(array_position(path_parts, 'object') + 1,1):array_length(path_parts,1)];
  path_parts = path_parts[coalesce(array_position(path_parts, 'authenticated') + 1,1):array_length(path_parts,1)];
  path_parts = path_parts[coalesce(array_position(path_parts, 'public') + 1,1):array_length(path_parts,1)];
  path_parts = path_parts[coalesce(array_position(path_parts, 'sign') + 1,1):array_length(path_parts,1)];

  if path_parts[1] = '' then
    path_parts = path_parts[2:array_length(path_parts,1)];
  end if;

  select
    (case
      when array_length(path_parts, 1) > 0
        then array_to_string(path_parts, '/') || '/'
        else ''
    end) || object_name into object_path;
end;
$function$
;

create or replace function private.delete_storage_object_from_url(object_url text, OUT status integer, OUT content text)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  object_path text;
begin
  select private.get_storage_object_path(object_url) into object_path;

  select into status, content
    result.status::int, result.content::text
    from private.delete_storage_object(object_path) as result;
end;
$function$
;
