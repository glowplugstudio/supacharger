import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

// Refresh session if expired - required for Server Components
// See https://supabase.com/docs/guides/auth/server-side/creating-a-client

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
