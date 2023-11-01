BEGIN;
CREATE EXTENSION "basejump-supabase_test_helpers";

select plan(10);

---- test handle_new_user triggered function for user without name
select tests.create_supabase_user('test_user_email');
select ok(exists(select 1 from public.profiles p where p.user_id = tests.get_supabase_uid('test_user_email')), 'New user is inserted into public.profiles');
select results_eq(
  'select first_name, last_name from public.profiles p where p.user_id = tests.get_supabase_uid(''test_user_email'')',
  $$values (null, null)$$,
  'New user has null names'
);

---- test handle_new_user triggered function for user from provider (with and without name)
-- only first name
select tests.create_supabase_user('test_user_google_f', 'test1@gmail.com', null, '{"full_name": "John"}'::jsonb);
select results_eq(
  'select first_name, last_name from public.profiles p where p.user_id = tests.get_supabase_uid(''test_user_google_f'')',
  $$values ('John', null)$$,
  'New user has first name'
);
-- first and last name
select tests.create_supabase_user('test_user_google_fl', 'test2@gmail.com', null, '{"full_name": "John Doe"}'::jsonb);
select results_eq(
  'select first_name, last_name from public.profiles p where p.user_id = tests.get_supabase_uid(''test_user_google_fl'')',
  $$values ('John', 'Doe')$$,
  'New user has first and last name'
);
-- first, middle and last
select tests.create_supabase_user('test_user_google_fml', 'test3@gmail.com', null, '{"full_name": "John Mike Doe"}'::jsonb);
select results_eq(
  'select first_name, last_name from public.profiles p where p.user_id = tests.get_supabase_uid(''test_user_google_fml'')',
  $$values ('John Mike', 'Doe')$$,
  'New user has first, middle and last name'
);

---- test is_profile_suspended and is_current_profile_suspended functions
-- suspended user
select tests.create_supabase_user('test_user_suspended');
update public.profiles p set profile_is_suspended = true where p.user_id = tests.get_supabase_uid('test_user_suspended');
select is(private.is_profile_suspended(tests.get_supabase_uid('test_user_suspended')), true);
select is(public.is_current_profile_suspended(), null);
select tests.authenticate_as('test_user_suspended');
select is(public.is_current_profile_suspended(), true);

-- set the role back to postgres
-- (tests.authenticate_as_service_role() function doesn't work actually)
select set_config('role', 'postgres', true); -- setting role to `service_role` loses permissions on tests schema, so we use `postgres`
select set_config('request.jwt.claims', null, true); -- reset jwt authentication

-- not suspended user
select tests.create_supabase_user('test_user_not_suspended');
select is(private.is_profile_suspended(tests.get_supabase_uid('test_user_not_suspended')), false);
select tests.authenticate_as('test_user_not_suspended');
select is(public.is_current_profile_suspended(), false);

select * from finish();
ROLLBACK;
