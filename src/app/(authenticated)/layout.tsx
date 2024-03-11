import { AuthenticatedHeader } from "@/components";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main>
      <AuthenticatedHeader />
      {children}
    </main>
  );
}
