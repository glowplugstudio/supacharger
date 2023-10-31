CREATE OR REPLACE FUNCTION public.log_activity_on_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
	begin
		NEW.created_by := auth.uid();
		NEW.created_at := now();

		RETURN NEW;
	end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_activity_on_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
	begin
		NEW.updated_at := now();
		NEW.updated_by := auth.uid();

		RETURN NEW;
	end;
$function$
;

CREATE TRIGGER log_activity_profiles_insert BEFORE INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION log_activity_on_insert();

CREATE TRIGGER log_activity_profiles_update BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION log_activity_on_update();

CREATE TRIGGER log_activity_admins_insert BEFORE INSERT ON public.admins FOR EACH ROW EXECUTE FUNCTION log_activity_on_insert();

CREATE TRIGGER log_activity_admins_update BEFORE UPDATE ON public.admins FOR EACH ROW EXECUTE FUNCTION log_activity_on_update();

