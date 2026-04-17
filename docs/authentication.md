# Authentication & Session Management

This document explains how the webshop application handles user authentication and session management using Next.js and Supabase.

## Overview

The application uses **Supabase authentication** with server-side session management via HTTP-only cookies. The authentication system is partially implemented: the core Supabase integration (client creation, API routes, middleware) is in place, but the UI does not yet conditionally render based on auth state.

## Authentication Flow

### 1. Login

The client submits credentials to `/api/auth/login`. The server-side Supabase client calls `signInWithPassword`, which returns a session and sets session cookies.

**File:** `src/app/api/auth/login/route.ts`
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

if (error) {
  return NextResponse.json({ error: error.message }, { status: 400 });
}

return NextResponse.json(
  { user: data.user, session: data.session },
  { status: 200 },
);
```

### 2. Session Persistence

On each subsequent request, the **middleware proxy** (`src/proxy.ts`) runs before the page/component. It creates a Supabase server client that reads the session cookies and calls `getClaims()` to validate the session.

**File:** `src/proxy.ts`
```typescript
import { updateSession } from "@supabase-lib/supabase/proxy";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**File:** `lib/supabase/proxy.ts` (excerpt)
```typescript
const { data } = await supabase.auth.getClaims();
const user = data?.claims;

const protectedRoutes = ["/account"];
const isProtectedRoute = protectedRoutes.some((route) =>
  request.nextUrl.pathname.startsWith(route),
);

if (!user && isProtectedRoute) {
  // Redirect to login only if the route is protected
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}
```

### 3. Protected Routes

Currently only `"/account"` is listed as a protected route (that page doesn’t exist yet). Unauthenticated users trying to access a protected route are redirected to `/login`.

### 4. Logout

The logout API route calls `supabase.auth.signOut()`, which clears the session cookies.

**File:** `src/app/api/auth/logout/route.ts`
```typescript
await supabase.auth.signOut();
return NextResponse.json({ message: "Logged out successfully" });
```

## Session Management

### Supabase Client Factories

Three separate Supabase client factories are provided:

#### Server-side (API routes, Server Components)
**File:** `lib/supabase/server.ts`
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Can be ignored if middleware refreshes sessions
          }
        },
      },
    },
  );
}
```

#### Client-side (Browser)
**File:** `lib/supabase/client.ts`
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

#### Middleware (Proxy)
**File:** `lib/supabase/proxy.ts`
```typescript
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // ... rest of the function (getClaims, route protection)
}
```

### Token Refresh

The middleware calls `supabase.auth.getClaims()` on every matched request, which implicitly validates the session and refreshes the access token if needed. This prevents users from being randomly logged out.

## Current State & Limitations

1. **No React Auth Context**  
   There is no auth-specific React context or provider. The only context provider is `CartProvider`. Components cannot easily access the current user object.

2. **Header Always Shows Logout**  
   The header component (`src/components/header.tsx`) always renders a logout button and a static user icon. It does not conditionally render based on authentication state.

3. **Minimal Protected Routes**  
   Only `"/account"` is protected, and that page does not exist yet.

4. **User Information Not Exposed to UI**  
   The user data is available only in API routes and the middleware, not in client components.

## Key Files

- **Middleware proxy:** `src/proxy.ts`
- **Supabase clients:** `lib/supabase/server.ts`, `lib/supabase/client.ts`, `lib/supabase/proxy.ts`
- **API routes:**  
  - `src/app/api/auth/login/route.ts`  
  - `src/app/api/auth/register/route.ts`  
  - `src/app/api/auth/logout/route.ts`
- **Header component:** `src/components/header.tsx` (does not check auth state)

## Future Improvements

To make the application fully aware of the logged-in user, you would need to:

1. **Create an auth context/provider** that fetches the user session on the client side.
2. **Use that context in the header** to conditionally render login/logout and display the user’s name/email.
3. **Expand the `protectedRoutes` array** to include any authenticated pages.
4. **Add a user profile/account page** that displays and edits user information.

The session is already available in server components and API routes via the Supabase server client, but client components currently have no direct access to the user object.