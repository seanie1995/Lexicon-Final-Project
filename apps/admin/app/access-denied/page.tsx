"use client";

import { createClient } from "@supabase-lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-lg max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-neutral-500 mb-6">
          You do not have admin access. If you believe this is an error, please
          contact an administrator.
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-purple-900 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
