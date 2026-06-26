"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  changePassword,
  type ChangePasswordState,
} from "@/lib/settings/changePassword";
import {
  updateUserProfile,
  type UpdateUserProfileState,
} from "@/lib/settings/updateUserProfile";
import type { CurrentUserSettings } from "@/lib/settings/getCurrentUserSettings";
import { useSession } from "next-auth/react";

type SettingsFormProps = {
  user: CurrentUserSettings;
};

const initialProfileState: UpdateUserProfileState = {};
const initialPasswordState: ChangePasswordState = {};

export default function SettingsForm({ user }: SettingsFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateUserProfile,
    initialProfileState,
  );

  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePassword,
    initialPasswordState,
  );
  const { data: session, update } = useSession();
  const handledUpdateRef = useRef<number | null>(null);

  useEffect(() => {
    if (
      profileState.updatedAt &&
      profileState.data &&
      handledUpdateRef.current !== profileState.updatedAt
    ) {
      handledUpdateRef.current = profileState.updatedAt;

      void update({
        ...session,
        user: {
          ...session?.user,
          name: profileState.data.name,
          image: profileState.data.image,
        },
      });
    }
  }, [profileState.updatedAt, profileState.data, session, update]);
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-2xl bg-white dark:bg-zinc-900 border p-6 shadow-sm ">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold ">Profile</h2>
          <p className="mt-1 text-sm tex">
            Update your name and profile picture.
          </p>
        </div>

        <form action={profileAction} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium  ">
              Email
            </label>
            <input
              id="email"
              value={user.email}
              disabled
              className="dark:bg-zinc-900 w-full rounded-xl border border-zinc-500 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium tex">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              placeholder="Your name"
              className="w-full rounded-xl border border-zinc-500 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium tex">
              Profile image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              defaultValue={user.image ?? ""}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-xl border border-zinc-500 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500"
            />
          </div>

          {profileState.error ? (
            <p className="text-sm text-red-600">{profileState.error}</p>
          ) : null}

          {profileState.success ? (
            <p className="text-sm text-emerald-600">{profileState.success}</p>
          ) : null}

          <button
            type="submit"
            disabled={profilePending}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {profilePending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <div className="border-b pb-4">
          <h2 className="text-xl font-semibold ">Password</h2>
          <p className="mt-1 text-sm tex">
            {user.hasPassword
              ? "Change your existing password."
              : "Set a password so you can also sign in with credentials."}
          </p>
        </div>

        <form action={passwordAction} className="mt-6 space-y-5">
          {user.hasPassword ? (
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="text-sm font-medium tex"
              >
                Current password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Current password"
                className="w-full rounded-xl border border-zinc-500 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium tex">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="New password"
              className="w-full rounded-xl border border-zinc-500 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium tex"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-zinc-500 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm  outline-none transition focus:border-slate-500"
            />
          </div>

          {passwordState.error ? (
            <p className="text-sm text-red-600">{passwordState.error}</p>
          ) : null}

          {passwordState.success ? (
            <p className="text-sm text-emerald-600">{passwordState.success}</p>
          ) : null}

          <button
            type="submit"
            disabled={passwordPending}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordPending
              ? "Saving..."
              : user.hasPassword
                ? "Change password"
                : "Set password"}
          </button>
        </form>
      </section>
    </div>
  );
}
