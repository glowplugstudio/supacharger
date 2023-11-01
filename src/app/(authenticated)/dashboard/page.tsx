import { fetchIsUserSuspended } from "@/lib";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (await fetchIsUserSuspended(supabase)) {
    redirect("/account");
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <p>Dashboard</p>
    </div>
  );
}
