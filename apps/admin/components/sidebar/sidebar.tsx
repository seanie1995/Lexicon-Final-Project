"use client";

import { PanelTopClose, PanelTopOpen } from "lucide-react";
import UserCard from "../user/user-card";
import SidebarHeader from "./sidebar-header";
import SidebarNav from "./sidebar-nav";
import { useState } from "react";

export default function Sidebar({ className }: { className: string }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`${className} ${collapsed ? "h-fit" : "h-screen"} sticky top-0 z-2 grid grid-flow-row grid-rows-[auto_1fr] bg-white md:h-screen md:border-r md:border-r-neutral-300`}
    >
      <div className="flex items-center justify-between border-b border-neutral-300 p-6 shadow md:shadow-none">
        <SidebarHeader />
        <button
          onClick={() => setCollapsed(!collapsed)}
          type="button"
          className={`${collapsed ? "bg-transparent" : "bg-purple-900/80 text-neutral-100"} rounded p-2 transition duration-200 hover:bg-purple-900/85 hover:text-neutral-100 md:hidden`}
        >
          {collapsed ? <PanelTopOpen /> : <PanelTopClose />}
        </button>
      </div>
      <div
        className={`${collapsed ? "scale-y-0 h-0" : "scale-y-100 h-auto"} grid origin-top grid-rows-[1fr_auto] transition duration-250 motion-reduce:duration-0 md:h-auto md:scale-y-100`}
      >
        <SidebarNav className={`${collapsed ? "hidden" : "block"}  md:block`} />
        <section
          className={`${collapsed ? "hidden" : "block"} border-t border-t-neutral-300 p-6 md:block`}
        >
          <UserCard />
        </section>
      </div>
    </aside>
  );
}
