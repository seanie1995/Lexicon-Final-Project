import { updateSession } from "@supabase-lib/supabase/proxy";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/login", "/auth/callback", "/access-denied", "/api/auth"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const staticAssets = [
    "/_next/static",
    "/_next/image",
    "/favicon.ico",
  ];
  const isStaticAsset = staticAssets.some((path) => pathname.startsWith(path)) ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname);

  if (isStaticAsset) {
    return NextResponse.next({ request });
  }

  if (isPublicRoute) {
    return NextResponse.next({ request });
  }

  const supabaseResponse = await updateSession(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return supabaseResponse.cookies.getAll();
        },
        setAll() {},
      },
    },
  );

  const { data: userResponse } = await supabase.auth.getUser();
  const user = userResponse?.user;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check admin status directly from database using service role
  const { data: adminUser } = await supabase
    .from("AdminUser")
    .select("isAdmin")
    .eq("userId", user.id)
    .single();

  if (!adminUser?.isAdmin) {
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