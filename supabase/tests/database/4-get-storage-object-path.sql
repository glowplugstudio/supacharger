BEGIN;
CREATE EXTENSION "basejump-supabase_test_helpers";

select plan(18);

---- test get_storage_object_path
-- full urls
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/public/avatars/picture.jpg'),
  'avatars/picture.jpg'
);
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/authenticated/avatars/picture.jpg'),
  'avatars/picture.jpg'
);
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/sign/avatars/picture.jpg'),
  'avatars/picture.jpg'
);
-- full urls (deeper path)
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/public/avatars/in/a/path/picture.jpg'),
  'avatars/in/a/path/picture.jpg'
);
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/authenticated/avatars/in/a/path/picture.jpg'),
  'avatars/in/a/path/picture.jpg'
);
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/sign/avatars/in/a/path/picture.jpg'),
  'avatars/in/a/path/picture.jpg'
);
-- [/authenticated | /public | /sign]/{bucket_name}/{object_full_path}
select is(
  private.get_storage_object_path('/public/avatars/picture.jpg'),
  'avatars/picture.jpg'
);
select is(
  private.get_storage_object_path('/authenticated/avatars/picture.jpg'),
  'avatars/picture.jpg'
);
select is(
  private.get_storage_object_path('/sign/avatars/picture.jpg'),
  'avatars/picture.jpg'
);
-- [/authenticated | /public | /sign]/{bucket_name}/{object_full_path} (deeper path)
select is(
  private.get_storage_object_path('/public/avatars/in/a/second/path/picture.jpg'),
  'avatars/in/a/second/path/picture.jpg'
);
select is(
  private.get_storage_object_path('/authenticated/avatars/in/a/second/path/picture.jpg'),
  'avatars/in/a/second/path/picture.jpg'
);
select is(
  private.get_storage_object_path('/sign/avatars/in/a/second/path/picture.jpg'),
  'avatars/in/a/second/path/picture.jpg'
);
-- /{bucket_name}/{object_full_path}
select is(
  private.get_storage_object_path('/avatars/picture.jpg'),
  'avatars/picture.jpg'
);
-- /{bucket_name}/{object_full_path} (deeper path)
select is(
  private.get_storage_object_path('/avatars/in/a/second/deeper/path/picture.jpg'),
  'avatars/in/a/second/deeper/path/picture.jpg'
);
-- urls with search parameters
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/public/avatars/picture.jpg?foo=bar'),
  'avatars/picture.jpg'
);
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/authenticated/avatars/picture.jpg?foo=bar'),
  'avatars/picture.jpg'
);
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/sign/avatars/picture.jpg?foo=bar'),
  'avatars/picture.jpg'
);
-- urls with search parameters (deeper path)
select is(
  private.get_storage_object_path('https://example.com/storage/v1/object/public/avatars/in/a/path/picture.jpg?foo=bar'),
  'avatars/in/a/path/picture.jpg'
);

select * from finish();
ROLLBACK;