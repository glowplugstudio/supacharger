"use client";

import { supabaseClient } from "@/lib";
import { capitalCase } from "change-case";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormFields = {
  newPassword: string;
};

type UpdatePasswordProps = {
  authProvider?: string;
};

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  authProvider,
}) => {
  const { register, handleSubmit, reset } = useForm<FormFields>();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    const { error } = await supabaseClient.auth.updateUser({
      password: formData.newPassword,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    reset();
    setIsSuccess(true);
  });

  if (authProvider && authProvider !== "email") {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-2xl col-span-full">Update password</h2>
        <p>
          You signed in with{" "}
          {capitalCase(authProvider)}, so you can&apos;t update your password.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-2xl col-span-full">Update password</h2>
      {!isSuccess
        ? (
          <>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    type="password"
                    placeholder="New password"
                    {...register("newPassword", { required: true })}
                  />
                </div>
                <Button
                  type="submit"
                >
                  Update password
                </Button>
              </div>
            </form>
          </>
        )
        : (
          <div>
            <p>Password updated successfully!</p>
          </div>
        )}
    </div>
  );
};
