# Google OAuth Setup Guide

## Overview

Google OAuth was added to the Lexicon webshop using **Supabase Auth's built-in Google provider**. No new packages were needed — `@supabase/ssr` and `@supabase/supabase-js` already support OAuth natively via `signInWithOAuth`.

## What Was Done

### 1. Auth Callback Route

**Created:** `apps/webshop/src/app/auth/callback/route.ts`

This is a server-side API route that handles the OAuth redirect flow. After a user authenticates with Google, Supabase redirects them here with an auth `code`. The route:

- Extracts the `code` from the URL query params
- Calls `supabase.auth.exchangeCodeForSession(code)` to swap it for a session
- Redirects the user to `/` on success, or `/login` on failure

### 2. Google Sign-In Button — Login Form

**Modified:** `apps/webshop/src/components/login-form.tsx`

- Added `handleGoogleSignIn` function that calls `supabase.auth.signInWithOAuth({ provider: "google" })` with a `redirectTo` pointing to the callback route
- Added a divider with "OR" text between the email/password form and the Google button
- Added the Google button with the official Google "G" logo (inline SVG, no extra dependency)
- Button matches existing design language (Tailwind classes, font-label, uppercase tracking)

### 3. Google Sign-In Button — Register Form

**Modified:** `apps/webshop/src/components/register-form.tsx`

- Imported `createClient` from `@supabase-lib/supabase/client`
- Added the same `handleGoogleSignIn` handler
- Added the same divider + Google button after the Create Account submit button

### Files Changed

| File | Action |
|------|--------|
| `apps/webshop/src/app/auth/callback/route.ts` | Created |
| `apps/webshop/src/components/login-form.tsx` | Modified |
| `apps/webshop/src/components/register-form.tsx` | Modified |

---

## What You Need to Do

The code changes are complete, but you need to configure the OAuth credentials manually.

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the **OAuth consent screen** first:
   - App name: `The Digital Archivist` (or whatever you prefer)
   - User support email: your email
   - Authorized domains: add `supabase.co`
   - Developer contact: your email
6. Back in Credentials, create the OAuth client:
   - Application type: **Web application**
   - Name: `Lexicon Webshop`
   - **Authorized redirect URIs** — add:
     ```
     https://ocxcwlnogpzvbyynekle.supabase.co/auth/v1/callback
     ```
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 2: Enable Google Provider in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and toggle it on
5. Paste the **Client ID** and **Client Secret** from Step 1
6. Click **Save**

### Step 3: Test It

1. Run the dev server: `npm run dev` (from `apps/webshop/`)
2. Go to `http://localhost:3000/login`
3. Click **Continue with Google**
4. You should be redirected to Google's sign-in page
5. After authenticating, you should be redirected back to the home page, logged in

---

## How the Flow Works

```
User clicks "Continue with Google"
        │
        ▼
signInWithOAuth({ provider: "google" })
        │
        ▼
Browser redirects to Google sign-in page
        │
        ▼
User authenticates with Google
        │
        ▼
Google redirects to Supabase:
  https://ocxcwlnogpzvbyynekle.supabase.co/auth/v1/callback
        │
        ▼
Supabase processes the OAuth response
        │
        ▼
Supabase redirects to your app:
  http://localhost:3000/auth/callback?code=XXXXX
        │
        ▼
Your callback route exchanges the code for a session:
  supabase.auth.exchangeCodeForSession(code)
        │
        ▼
User is redirected to / (logged in)
```

---

## Troubleshooting

**"Redirect URI mismatch" error from Google:**
- Make sure the authorized redirect URI in Google Cloud Console is exactly:
  `https://ocxcwlnogpzvbyynekle.supabase.co/auth/v1/callback`
- No trailing slash, no extra characters

**User lands on /login after Google auth:**
- Check that the Supabase Google provider is enabled and credentials are correct
- Check the browser console for errors

**Google button doesn't appear styled correctly:**
- Run `npx biome check --fix src/components/login-form.tsx` to ensure formatting is correct
- The button uses the same Tailwind design tokens as the rest of the app
