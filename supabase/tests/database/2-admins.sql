BEGIN;
CREATE EXTENSION "basejump-supabase_test_helpers";

select plan(6);

-- non admin
select tests.create_supabase_user('test_user_non_admin');
select is(private.is_profile_admin(tests.get_supabase_uid('test_user_non_admin')), false);
select is(public.is_current_profile_admin(), false);
select tests.authenticate_as('test_user_non_admin');
select is(public.is_current_profile_admin(), false);

-- set the role back to postgres
-- (tests.authenticate_as_service_role() function doesn't work actually)
select set_config('role', 'postgres', true); -- setting role to `service_role` loses permissions on tests schema, so we use `postgres`
select set_config('request.jwt.claims', null, true); -- reset jwt authentication

-- admin
select tests.create_supabase_user('test_user_admin');
insert into public.admins (admin_id) values (tests.get_supabase_uid('test_user_admin'));
select is(private.is_profile_admin(tests.get_supabase_uid('test_user_admin')), true);
select is(public.is_current_profile_admin(), false);
select tests.authenticate_as('test_user_admin');
select is(public.is_current_profile_admin(), true);

select * from finish();
ROLLBACK;