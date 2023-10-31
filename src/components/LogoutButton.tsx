"use client";

import { supabaseClient } from "@/lib";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "./ui/button";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    console.log("Logging out...");
    await supabaseClient.auth.signOut();
    router.refresh();
  }, [router]);

  return (
    <Button
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};
