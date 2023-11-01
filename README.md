# supacharger

Stack used:

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (available at `pnpm exec shadcn-ui`)
- [Supabase](https://supabase.com/)

## Getting Started

> ⚠️ You need [pnpm](https://pnpm.io/) installed to manage dependencies.

First, install the dependencies:

```bash
pnpm install
```

Second, start the local Supabase environment. To do so, follow these steps:

1. Install [Docker](https://www.docker.com/).
2. Setup the environment variables (.e.g the external auth providers secrets), see [.env.example](./.env.example) for details.
3. Start the local Supabase environment:
   ```bash
   pnpm supabase:start
   ```
   This command downloads all the Docker containers needed by Supabase and sets up the local Supabase environment. It also applies the default migrations, that can be found in [supabase/migrations](./supabase/migrations). See [Database configuration](#database-configuration) below for more details.
   > If you're getting errors like `Error response from daemon...`, just wait a few seconds and try again.
4. The previous command gives you some URLs and keys for your Supabase instance. Copy the `API URL` and the `anon key` into your `.env` file accordingly. These values are used by Next.js to connect to your Supabase instance.
5. Access the local Supabase Studio (`Studio URL` in the output of the previous command, defaults to [http://127.0.0.1:54323](http://127.0.0.1:54323)) and run this SQL command in the [SQL editor](http://127.0.0.1:54323/project/default/sql):
   ```sql
   # read the variables from the output of the previous command
   select vault.create_secret('<YOUR_SUPABASE_URL_WITHOUT_TRAILING_SLASH>', 'SUPABASE_URL');
   select vault.set_secret('<YOUR_SUPABASE_SERVICE_ROLE_KEY>', 'SUPABASE_SERVICE_ROLE_KEY');
   ```

Third, run the development server:

```bash
pnpm dev
```

Finally, open [http://localhost:3000](http://localhost:3000) with your browser.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Authentication

We use [Supabase Auth UI](https://github.com/supabase/auth-ui) for auth components. To configure which providers to use, change the `AUTH_PROVIDERS` constant in the [Auth.tsx](./src/components/Auth.tsx) component.

## Typing

Supabase offers automatic code generation based on the tables your database. To generate types, run:

```bash
pnpm codegen:supabase
```

See Supabase CLI gen [docs](https://supabase.com/docs/reference/cli/supabase-gen-types).

## Database features

Within your Supabase database, we have provided two PostgreSQL functions that can help you defining RLS policies and alter data on triggers.

### Migrations

Migrations are managed by Supabase using Supabase CLI. See these [docs](https://supabase.com/docs/guides/cli/local-development) for more details.

### `private` schema

The `private` schema contains tables and functions that are needed in the business logic but should not be exposed to the [public API](https://supabase.com/docs/guides/api).

See [private_schema.sql](./supabase/migrations/00000000000001_private_schema.sql) migration for more details.

### Profiles table

The `profiles` table is used to track who are the users. This table is populated automatically when a user signs up, using the `auth.users`'s `id` column as primary key.

See [profiles.sql](./supabase/migrations/00000000000002_profiles.sql) migration for more details.

#### Suspended users

The `profiles` table has a `profile_is_suspended` column that the user can set to true for itself. Is a user has the `profile_is_suspended` column set to true, they cannot update their profile.

The `private.is_profile_suspended(profile_id uuid)` function can be used to check if the user with the given `profile_id` is suspended.

The `public.is_current_profile_suspended()` function can be used to check if the current user (the user sending the request to the Supabase API) is suspended.

See [profiles.sql](./supabase/migrations/00000000000002_profiles.sql) migration for more details.

### Admins

The `admins` table is used to track who are the admins.

The `private.is_profile_admin(profile_id uuid)` function can be used to check if the user with the given `profile_id` is an admin.

The `public.is_current_profile_admin()` function can be used to check if the current user (the user sending the request to the Supabase API) is an admin.

For both `profiles` and `admins` tables RLS policies are applied so that admins can do all the SQL operations.

See [admins.sql](./supabase/migrations/00000000000003_admins.sql) migration for more details.

### Log activity

These functions serve the purpose of automatically updating key columns, including `created_by`, `created_at`, `updated_by`, and `updated_at` within a given table:

- `log_activity_on_insert()`: This function automatically populates the `created_by` column with the result of [`auth.uid()`](https://supabase.com/docs/guides/auth/row-level-security#authuid) and the `created_at` column with the current timestamp upon an insertion.
- `log_activity_on_update()`: Similarly, this function serves to populate the `updated_by` column with [`auth.uid()`](https://supabase.com/docs/guides/auth/row-level-security#authuid) and the `updated_at` column with the current timestamp when an update operation occurs.

These functions come pre-enabled for the `public.profiles` table by default, using triggers. Below is the SQL code that shows how to enable these functions for other tables. Note that these functions are enabled by default on `public.profiles` table.

```sql
CREATE TRIGGER log_activity_profiles_insert BEFORE INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION log_activity_on_insert();

CREATE TRIGGER log_activity_profiles_update BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION log_activity_on_update();
```

You have the flexibility to enable these functions on any other table as well. However, it's crucial to ensure that the table in question possesses the following columns: `created_by` (of type `uuid`), `created_at` (of type `timestamptz`), `updated_by` (of type `uuid`) and `updated_at` (of type `timestamptz`) columns. . If needed, you may consider referencing `profiles.user_id` within the `*_by` columns for integrity.

Please note that any operation executed on the db using the service_role will be logged as `null` in the `created_by` and `updated_by` columns, as well as the insert in the profiles table done by the automatic trigger on the `auth.users` table.

See [log_activity_helpers.sql](./supabase/migrations/00000000000004_log_activity_helpers.sql) migration for more details.

### Automatically delete files from storage

At some point in your implementation, you'll need to use [Supabase Storage](https://supabase.com/docs/guides/storage). You usually set `*_url` columns in your tables to keep track of the current location of the file, but deleting the file from storage is a manual operation. Two functions are provided to help you with that:

- `private.delete_storage_object(bucket text, object text)`: This function deletes the given object from the given bucket. For example, if a file is located at `/storage/v1/object/public/avatars/picture.jpg` (Supabase Storage API details [here](https://github.com/supabase/storage-api)), call the function with `private.delete_storage_object('avatars', 'picture.jpg')`.
- `private.delete_storage_object_from_url(object_url text)`: This function deletes the file at the given URL. The object URL can be a full `https://...` URL or a relative path, such as `/storage/v1/object/...` or `/{bucket_name}/{object_full_path}`.

See [delete_storage_object_functions.sql](./supabase/migrations/00000000000005_delete_storage_object_function.sql) migration for more details.

These functions are enabled by default on `public.profiles` table on the `avatar_url` column with a trigger.

See [delete_old_files_trigger.sql](./supabase/migrations/00000000000006_delete_old_files_triggers.sql) migration for more details.

## Formatting

We use [dprint](https://dprint.dev/) to format our code. To format your code, run:

```bash
pnpm format
```
