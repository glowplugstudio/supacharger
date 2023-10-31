CREATE OR REPLACE FUNCTION public.delete_profiles_old_avatar_url()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  status int;
  content text;
  old_file_url text := old.avatar_url;
  new_file_url text := new.avatar_url;
begin
  if coalesce(old_file_url, '') <> ''
      and (tg_op = 'DELETE' or (old_file_url <> coalesce(new_file_url, ''))) then
    select
      into status, content
      result.status, result.content
      from private.delete_storage_object_from_url(old_file_url) as result;
    if status <> 200 then
      raise warning 'Could not delete file from storage: % %', status, content;
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$function$
;

CREATE TRIGGER before_profiles_avatar_url_changes BEFORE DELETE OR UPDATE OF avatar_url ON public.profiles FOR EACH ROW EXECUTE FUNCTION delete_profiles_old_avatar_url();
