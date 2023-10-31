"use client";

import "./Auth.css";

import { supabaseClient } from "@/lib";
import { tailwindConfig } from "@/lib/utils";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { Theme, ThemeMinimal, ViewType } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const primaryColor = tailwindConfig.theme!.colors!["primary"] as Record<
  string,
  string
>;
const secondaryColor = tailwindConfig.theme!.colors!["secondary"] as Record<
  string,
  string
>;

const customAuthUiTheme: Theme = {
  ...ThemeMinimal,
  default: {
    colors: {
      brand: primaryColor["DEFAULT"],
      brandAccent: "#446153",
      brandButtonText: "white",
      messageText: "gray",
      messageTextDanger: "#bf8a30",
      defaultButtonBackground: "white",
      defaultButtonText: "gray",
      defaultButtonBorder: primaryColor["100"],
      defaultButtonBackgroundHover: "white",
      inputBorder: secondaryColor["100"],
      inputBorderFocus: "#59806d",
      inputBorderHover: primaryColor["200"],
      inputPlaceholder: "gray",
    },
    space: {
      buttonPadding: "1rem 1.5rem",
      inputPadding: "0.5rem 0.5rem",
    },
    radii: {
      borderRadiusButton: "1.25rem",
      buttonBorderRadius: "1.25rem",
      inputBorderRadius: "0.75rem",
    },
  },
};

type AuthProps = {
  view: ViewType;
  title?: string;
};

export const Auth: React.FC<AuthProps> = ({ view, title }) => {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);
  const containerStyle = useMemo(() => {
    if (view === "sign_in") {
      return "supabase-auth-ui-container-no-signup";
    } else if (view === "sign_up") {
      return "supabase-auth-ui-container-no-signin";
    }
  }, [view]);

  useEffect(() => {
    setRedirectTo(`${window.location.origin}/auth/callback`);
  }, []);

  useEffect(() => {
    // we listen to auth changes because we there's no callback in the Auth component
    // for when the user is logged in
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((ev, session) => {
      if (session) {
        console.log("User logged in!");
        router.refresh();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-y-4">
      {title && <h2 className="text-center text-2xl col-span-full">{title}</h2>}
      <div className="col-span-full sm:col-start-2 sm:col-span-4">
        <SupabaseAuth
          supabaseClient={supabaseClient}
          providers={["google", "facebook"]}
          appearance={{
            theme: customAuthUiTheme,
            className: {
              container: containerStyle,
            },
          }}
          theme="light"
          redirectTo={redirectTo}
          view={view}
        />
      </div>
    </div>
  );
};
