"use client";

import { supabaseClient } from "@/lib";
import { capitalCase } from "change-case";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
          <label htmlFor="email">Current email</label>
          <input
            className="px-4 py-2 border border-secondary-200 rounded-xl bg-gray-950"
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
              <label htmlFor="email">Current email</label>
              <input
                className="px-4 py-2 border border-secondary-200 rounded-xl bg-gray-900"
                type="email"
                placeholder="Current email"
                value={userEmail}
                disabled
              />
            </div>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="newEmail">New email</label>
                  <input
                    className="px-4 py-2 border border-secondary-200 rounded-xl bg-transparent"
                    type="email"
                    placeholder="New email"
                    {...register("newEmail", { required: true })}
                  />
                </div>
                <button
                  className="px-4 py-2 bg-primary border border-secondary-200 rounded-2xl"
                  type="submit"
                >
                  Update email
                </button>
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
