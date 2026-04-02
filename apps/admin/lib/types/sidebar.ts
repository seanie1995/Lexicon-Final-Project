import type { IconName } from "lucide-react/dynamic";
import { Url } from "next/dist/shared/lib/router/router";

export interface NavItem {
  link: Url;
  label: string;
  icon: IconName;
}

