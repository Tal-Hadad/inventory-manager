"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ChangePasswordState = {
  error?: string;
  success?: string;
};

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword")?.toString() ?? "";
  const newPassword = formData.get("newPassword")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  if (!newPassword || !confirmPassword) {
    return { error: "New password and confirm password are required" };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      password: true,
    },
  });

  if (!user) {
    return { error: "User not found" };
  }

  if (user.password) {
    if (!currentPassword) {
      return { error: "Current password is required" };
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      return { error: "Current password is incorrect" };
    }
  }

  const password = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      password,
    },
  });

  revalidatePath("/settings");

  return {
    success: user.password
      ? "Password changed successfully"
      : "Password set successfully",
  };
}
