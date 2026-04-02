import { UserRound } from "lucide-react";

export default function UserCard({ className }: { className?: string }) {
  return (
    <div className={`${className} flex gap-2 items-center`}>
      <div className="bg-neutral-400 p-3 rounded-full">
        <UserRound />
      </div>
      <div>
        <p className="font-bold">Admin User</p>
        <p className="text-neutral-500">admin@webbutiken.se</p>
      </div>
    </div>
  );
}
