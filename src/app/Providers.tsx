"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import Navbar from "@/components/nav/Navbar";
import Sidebar from "@/components/nav/Sidebar";

type ProvidersProps = React.ComponentProps<typeof NextThemesProvider> & {
  children: React.ReactNode;
};

export default function Providers({ children, ...themeProps }: ProvidersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SessionProvider>
      <NextThemesProvider {...themeProps}>
        <div className="flex h-screen w-full overflow-hidden py-7">
          <Sidebar isExpanded={isExpanded} />

          <main className="flex min-h-0 flex-1 flex-col px-9 md:pl-10">
            <Navbar
              isExpanded={isExpanded}
              onToggleSidebar={() => setIsExpanded((prev) => !prev)}
            />

            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </main>
        </div>
      </NextThemesProvider>
    </SessionProvider>
  );
}
