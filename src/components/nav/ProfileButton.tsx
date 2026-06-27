"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/authActions";

export default function ProfileCircle() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Button>
        <Link href={"/login"}>Log in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 gap-3 rounded-xl border border-transparent bg-white px-3 text-left shadow-sm transition hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          {session.user.image ? (
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-zinc-700">
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-800 dark:ring-zinc-700">
              <UserIcon className="h-4 w-4 text-slate-600 dark:text-zinc-300" />
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col items-start">
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {session.user.name ?? "User"}
            </span>
            <span className="truncate text-xs text-slate-500 dark:text-zinc-400">
              My account
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          {session.user.image ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200 dark:ring-zinc-700">
              <Image
                src={session.user.image}
                alt={session.user.name ?? "User"}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-800 dark:ring-zinc-700">
              <UserIcon className="h-5 w-5 text-slate-600 dark:text-zinc-300" />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {session.user.name ?? "User"}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
              {session.user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm"
          >
            <SettingsIcon className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          onClick={logout}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm"
        >
          <LogOutIcon className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
