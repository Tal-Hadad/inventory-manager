import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  Settings,
  User,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Layout,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Archive,
  },
  {
    name: "Products",
    href: "/products",
    icon: Clipboard,
  },
  {
    name: "Users",
    href: "/users",
    icon: User,
  },

  {
    name: "Expenses",
    href: "/expenses",
    icon: CircleDollarSign,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
