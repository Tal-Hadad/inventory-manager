"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type UpdateUserProfileState = {
  error?: string;
  success?: string;
  data?: {
    name: string;
    image: string | null;
  };
  updatedAt?: number;
};
export async function updateUserProfile(
  _prevState: UpdateUserProfileState,
  formData: FormData,
): Promise<UpdateUserProfileState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const image = formData.get("image")?.toString().trim() ?? "";

  if (!name) {
    return { error: "Name is required" };
  }

  if (name.length < 2) {
    return { error: "Name must be at least 2 characters" };
  }

  if (name.length > 50) {
    return { error: "Name must be 50 characters or less" };
  }

  if (image) {
    try {
      new URL(image);
    } catch {
      return { error: "Image must be a valid URL" };
    }
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
      image: image || null,
    },
  });

  revalidatePath("/settings");

  return {
    success: "Profile updated successfully",
    data: {
      name,
      image: image || null,
    },
    updatedAt: Date.now(),
  };
}
