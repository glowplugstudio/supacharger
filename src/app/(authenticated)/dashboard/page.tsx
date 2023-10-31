import { fetchIsUserSuspended } from "@/lib/api";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  if (await fetchIsUserSuspended(supabase)) {
    redirect("/account");
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <p>Dashboard</p>
    </div>
  );
}
