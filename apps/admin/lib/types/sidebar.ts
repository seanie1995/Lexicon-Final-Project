import type { LucideIcon } from "lucide-react";
import { Url } from "next/dist/shared/lib/router/router";

export interface NavItem {
  link: Url;
  label: string;
  icon: LucideIcon;
}

