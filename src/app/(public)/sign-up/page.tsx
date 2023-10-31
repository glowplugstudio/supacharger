import { Auth } from "@/components";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Auth view="sign_up" title="Sign up" />
      <Link href="/sign-in" className="underline">
        Already have an account? Sign in
      </Link>
    </div>
  );
}
