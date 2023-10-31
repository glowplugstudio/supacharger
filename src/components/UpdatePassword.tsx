"use client";

import { supabaseClient } from "@/lib";
import { capitalCase } from "change-case";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
                  <label htmlFor="newPassword">New password</label>
                  <input
                    className="px-4 py-2 border border-secondary-200 rounded-xl bg-transparent"
                    type="password"
                    placeholder="New password"
                    {...register("newPassword", { required: true })}
                  />
                </div>
                <button
                  className="px-4 py-2 bg-primary border border-secondary-200 rounded-2xl"
                  type="submit"
                >
                  Update password
                </button>
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
