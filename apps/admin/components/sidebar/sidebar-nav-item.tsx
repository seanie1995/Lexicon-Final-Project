"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/types";
import { usePathname } from "next/navigation";

export default function SidebarNavItem({ item }: { item: NavItem }) {
  const pathName = usePathname();
  const isActive =
    pathName === item.link ||
    (pathName.includes("products") &&
      item.label.toLowerCase().includes("products"));

  const Icon = item.icon;

  return (
    <Link
      href={item.link}
      className={`${isActive ? "bg-purple-900/80 text-neutral-100" : "bg-transparent"} 
        flex place-items-center gap-4 rounded-md p-2.5 hover:bg-purple-900/85 hover:text-neutral-100`}
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </Link>
  );
}
