"use client";

import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/auth";

export default function UserCard({ className }: { className?: string }) {
  const [user, setUser] = useState<{
    email: string | null | undefined;
    displayName: string | null | undefined;
  } | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  if (!user) {
    return (
      <div className={`${className} flex gap-2 items-center`}>
        <div className="bg-neutral-400 p-3 rounded-full">
          <UserRound />
        </div>
        <div>
          <p className="font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} flex gap-2 items-center`}>
      <div className="bg-neutral-400 p-3 rounded-full">
        <UserRound />
      </div>
      <div>
        <p className="font-bold">{user.displayName || "Admin User"}</p>
        <p className="text-neutral-500">{user.email}</p>
      </div>
    </div>
  );
}
