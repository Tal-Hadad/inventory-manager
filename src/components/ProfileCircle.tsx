"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
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
        <Button variant="outline">
          {session.user.name}
          {session.user.image ? (
            <Image
              width={32}
              height={32}
              src={session.user.image}
              alt={session.user.name ?? "User"}
              className="rounded-full"
            />
          ) : (
            <UserIcon className="h-8 w-8 rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon />
          <Link href="/settings" className="flex">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
