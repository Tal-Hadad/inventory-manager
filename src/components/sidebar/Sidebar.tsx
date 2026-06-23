"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./navItems";
import { Package2 } from "lucide-react";

function isNavItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = {
  isExpanded: boolean;
};

export default function Sidebar({ isExpanded }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex min-h-screen flex-col overflow-visible border-r border-gray-300 bg-white transition-[width] duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-950 ${
        isExpanded ? `w-15 md:w-55` : "w-0 md:w-16 z-10"
      }`}
    >
      <div className=" border-b border-gray-200 p-3 dark:border-gray-800">
        <Link
          href="/dashboard"
          className={`flex items-center ${isExpanded ? "gap-3" : "justify-start"}`}
        >
          <Package2 size={20} className="ml-2" />

          <h1
            className={`truncate text-lg font-extrabold ${isExpanded ? "hidden md:block" : "hidden"}`}
          >
            TSTOCK
          </h1>
        </Link>
      </div>

      <nav
        className={`mt-4 flex flex-1 flex-col gap-1 px-2 py-3 ${isExpanded ? "gap-2" : "gap-2 flex items-start"}`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(pathname, item.href);

          return (
            <div key={item.href} className="group relative w-full">
              <Link
                key={item.href}
                href={item.href}
                aria-label={!isExpanded ? item.name : undefined}
                className={`flex w-full rounded-lg px-3 py-2 text-sm transition-colors  ${
                  isExpanded
                    ? "justify-start gap-3"
                    : " hidden md:block justify-start"
                } ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className={`truncate ${isExpanded ? "block" : "hidden"}`}>
                  {item.name}
                </span>
              </Link>
              {!isExpanded && (
                <span
                  className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-gray-700"
                  role="tooltip"
                >
                  {item.name}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
