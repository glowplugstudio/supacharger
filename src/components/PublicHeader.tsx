import Link from "next/link";

export const PublicHeader = () => {
  return (
    <div className="flex flex-row items-center justify-between w-full p-4">
      <div className="flex flex-row gap-4 items-center justify-left">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
      <div className="flex flex-row gap-4 items-center justify-right">
        <Link href="/sign-in">Sign in</Link>
      </div>
    </div>
  );
};
