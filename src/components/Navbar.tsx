"use client";

import Link from "next/link";
import { Bell, Menu, Settings, Search } from "lucide-react";
import ThemeToggle from "./ui/ThemeToggle";

type NavbarProps = {
  isExpanded: boolean;
  onToggleSidebar: () => void;
};

export default function Navbar({ isExpanded, onToggleSidebar }: NavbarProps) {
  return (
    <header className="mb-7 flex w-full items-center justify-between">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className="rounded-full bg-gray-100 px-3 py-3 hover:bg-blue-100 dark:bg-gray-900 dark:hover:bg-gray-700 "
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative">
          <input
            type="search"
            placeholder="Search"
            className="w-50 rounded-lg border-2 border-gray-300 bg-gray-100 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-gray-700 dark:bg-gray-900 md:w-70"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-5 md:flex">
          <ThemeToggle />
          <h1>Profile</h1>
        </div>

        <Link href="/settings" aria-label="Settings">
          <Settings className="text-gray-500 dark:text-white" />
        </Link>
      </div>
    </header>
  );
}
