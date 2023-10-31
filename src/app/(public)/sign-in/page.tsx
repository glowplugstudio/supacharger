import { Auth } from "@/components";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Auth view="sign_in" title="Sign in" />
      <Link href="/sign-up" className="underline">
        Don&apos;t have an account? Sign up
      </Link>
    </div>
  );
}
