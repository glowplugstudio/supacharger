"use client";

import { supabaseClient } from "@/lib";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    console.log("Logging out...");
    await supabaseClient.auth.signOut();
    router.refresh();
  }, [router]);

  return (
    <button
      className="bg-secondary border border-secondary-200 rounded-md p-2"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};
