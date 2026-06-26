"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type CurrentUserSettings = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  hasPassword: boolean;
};

export async function getCurrentUserSettings(): Promise<CurrentUserSettings> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      password: true,
    },
  });

  if (!user || !user.email) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    image: user.image ?? null,
    hasPassword: Boolean(user.password),
  };
}
