BEGIN;
CREATE EXTENSION "basejump-supabase_test_helpers";

select plan(8);

---- test log_activity_on_insert
select tests.create_supabase_user('test_user1');
select isnt((select p.created_at from public.profiles p where p.user_id = tests.get_supabase_uid('test_user1')), null);
select is((select p.created_by from public.profiles p where p.user_id = tests.get_supabase_uid('test_user1')), null);

---- test log_activity_on_update
select tests.create_supabase_user('test_user2');
select is((select p.updated_at from public.profiles p where p.user_id = tests.get_supabase_uid('test_user2')), null);
select is((select p.updated_by from public.profiles p where p.user_id = tests.get_supabase_uid('test_user2')), null);
-- execute a random update with postgres role
update public.profiles set first_name = 'test_user2.1' where user_id = tests.get_supabase_uid('test_user2');
select is((select p.updated_at from public.profiles p where p.user_id = tests.get_supabase_uid('test_user2')), now());
select is((select p.updated_by from public.profiles p where p.user_id = tests.get_supabase_uid('test_user2')), null);
-- execute a random update with authenticated role
select tests.authenticate_as('test_user2');
update public.profiles set first_name = 'test_user2.2' where user_id = tests.get_supabase_uid('test_user2');
select is((select p.updated_at from public.profiles p where p.user_id = tests.get_supabase_uid('test_user2')), now());
select is((select p.updated_by from public.profiles p where p.user_id = tests.get_supabase_uid('test_user2')), tests.get_supabase_uid('test_user2'));

select * from finish();
ROLLBACK;