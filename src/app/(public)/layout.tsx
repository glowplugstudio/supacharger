import { PublicHeader } from "@/components";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <PublicHeader />
      {children}
    </main>
  );
}
