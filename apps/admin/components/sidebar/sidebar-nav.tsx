import { Package2, ShoppingCart } from "lucide-react";
import type { NavItem } from "@/lib/types";
import SidebarNavItem from "./sidebar-nav-item";

export default function SidebarNav({ className }: { className?: string }) {
  const navItems: NavItem[] = [
    { label: "Products", link: "/", icon: Package2 },
    { label: "Orders", link: "/orders", icon: ShoppingCart },
  ];

  return (
    <nav aria-label="Main navigation" className={`${className}`}>
      <ul className="px-6 py-3 space-y-1.5">
        {navItems.map((item: NavItem) => (
          <li key={item.link.toString()}>
            <SidebarNavItem item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
