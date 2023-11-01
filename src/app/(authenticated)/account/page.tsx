import { SuspendAccount, UpdateEmail, UpdatePassword } from "@/components";
import { fetchIsUserSuspended } from "@/lib";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const isUserSuspended = await fetchIsUserSuspended(supabase);

  const userEmail = (await supabase.auth.getUser()).data.user!.email;
  const userProvider = (await supabase.auth.getUser()).data.user?.app_metadata
    .provider;

  return (
    <div className="flex flex-col gap-8 items-center">
      {!isUserSuspended
        ? (
          <>
            <UpdateEmail
              userEmail={userEmail || ""}
              authProvider={userProvider}
            />
            <UpdatePassword authProvider={userProvider} />
            <SuspendAccount />
          </>
        )
        : <div>Your account is suspended. Please contact support.</div>}
    </div>
  );
}
