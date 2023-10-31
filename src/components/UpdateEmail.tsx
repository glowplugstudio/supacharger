"use client";

import { supabaseClient } from "@/lib";
import { capitalCase } from "change-case";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormFields = {
  newEmail: string;
};

type UpdateEmailProps = {
  userEmail: string;
  authProvider?: string;
};

export const UpdateEmail: React.FC<UpdateEmailProps> = ({
  userEmail,
  authProvider,
}) => {
  const { register, handleSubmit, reset } = useForm<FormFields>();
  const [newEmailSuccess, setNewEmailSuccess] = useState<string>();

  const onSubmit = handleSubmit(async (formData) => {
    const newEmail = formData.newEmail;

    if (!newEmail) {
      return;
    }

    if (newEmail === userEmail) {
      alert("The new email is the same as your current email.");
      return;
    }

    const { error } = await supabaseClient.auth.updateUser(
      {
        email: newEmail,
      },
      {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    );

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    reset();
    setNewEmailSuccess(newEmail);
  });

  if (!userEmail) {
    return null;
  }

  if (authProvider && authProvider !== "email") {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-2xl col-span-full">Update email</h2>
        <div className="flex flex-col">
          <Label htmlFor="email">Current email</Label>
          <Input
            type="email"
            placeholder="Current email"
            value={userEmail}
            disabled
          />
        </div>
        <p>
          You signed in with{" "}
          {capitalCase(authProvider)}, so you can&apos;t update your email.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-2xl col-span-full">Update email</h2>
      {!Boolean(newEmailSuccess)
        ? (
          <>
            <div className="flex flex-col">
              <Label htmlFor="email">Current email</Label>
              <Input
                type="email"
                placeholder="Current email"
                value={userEmail}
                disabled
              />
            </div>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="newEmail">New email</Label>
                  <Input
                    type="email"
                    placeholder="New email"
                    {...register("newEmail", { required: true })}
                  />
                </div>
                <Button type="submit">
                  Update email
                </Button>
              </div>
            </form>
          </>
        )
        : (
          <div>
            <p className="text-center">
              We&apos;ve sent you an email to <strong>{newEmailSuccess}</strong>
              {" "}
              to confirm the email update.
              <br />
              Please follow the instructions in the email.
            </p>
          </div>
        )}
    </div>
  );
};
