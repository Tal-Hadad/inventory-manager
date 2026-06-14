import { signIn, signOut } from "next-auth/react";

export const loginGoogle = async () => {
  await signIn("google", { redirectTo: "/dashboard" });
};

export const loginGithub = async () => {
  await signIn("github", { redirectTo: "/dashboard" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
