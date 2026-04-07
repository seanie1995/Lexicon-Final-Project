import { updateSession } from "@supabase-lib/supabase/proxy";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require auth
  const publicRoutes = ["/login", "/auth/callback", "/access-denied"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // Static and asset paths that bypass middleware entirely
  const isStaticAsset =
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  if (isStaticAsset) {
    return;
  }

  // Always run updateSession to keep cookies fresh
  const supabaseResponse = await updateSession(request);

  if (isPublicRoute) {
    return supabaseResponse;
  }

  // Read claims from the refreshed session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return supabaseResponse.cookies.getAll();
        },
        setAll() {
          // Already handled by updateSession
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check admin role claim
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims as Record<string, unknown> | undefined;
  const appMetadata = claims?.app_metadata as Record<string, unknown> | undefined;
  const role = appMetadata?.role as string | undefined;

  if (role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/access-denied";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
