"use client";

import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "./ui/button";

export const SuspendAccount = () => {
  const router = useRouter();

  const handleOnClick = useCallback(async () => {
    const canSuspend = confirm(
      "Are you sure you want to suspend your account?",
    );
    if (!canSuspend) {
      return;
    }

    const { error } = await supabaseClient
      .from("profiles")
      .update({ profile_is_suspended: true })
      .eq("user_id", (await supabaseClient.auth.getUser()).data.user!.id);

    if (error) {
      console.error("Error suspending account", error);
      alert("This error occurred: " + error.message);
    }

    router.refresh();
  }, [router]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-center text-2xl col-span-full">Suspend account</h2>
      <div className="text-red-500 text-center">
        <h3 className="text-lg">Danger zone!</h3>
        <p>
          <strong>This action is irreversible</strong>. Suspending your account
          will make you unable to use the main functionalities of this website.
        </p>
      </div>
      <Button
        variant={"destructive"}
        onClick={handleOnClick}
      >
        Suspend account
      </Button>
    </div>
  );
};
