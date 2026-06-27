"use client";

import { Menu, Search } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import ProfileCircle from "./ProfileButton";
import GlobalSearch from "./GlobalSearch";
type NavbarProps = {
  isExpanded: boolean;
  onToggleSidebar: () => void;
};

export default function Navbar({ isExpanded, onToggleSidebar }: NavbarProps) {
  return (
    <header className="mb-6 flex w-full items-center justify-between">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className="rounded-full bg-gray-100 px-3 py-3 hover:bg-blue-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 "
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative">
          <GlobalSearch />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-5 md:flex">
          <ThemeToggle />
          <ProfileCircle />
        </div>
      </div>
    </header>
  );
}
