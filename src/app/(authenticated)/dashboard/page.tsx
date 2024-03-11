import { fetchIsUserSuspended } from "@/lib";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();

  if (await fetchIsUserSuspended(supabase)) {
    redirect("/account");
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <p>Dashboard</p>
    </div>
  );
}
