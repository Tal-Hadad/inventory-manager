"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

type ProvidersProps = React.ComponentProps<typeof NextThemesProvider> & {
  children: React.ReactNode;
};

export default function Providers({ children, ...themeProps }: ProvidersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SessionProvider>
      <NextThemesProvider {...themeProps}>
        <div className="flex min-h-screen w-full py-7">
          <Sidebar isExpanded={isExpanded} />

          <main className="flex h-full w-full flex-col px-9 md:pl-12">
            <Navbar
              isExpanded={isExpanded}
              onToggleSidebar={() => setIsExpanded((prev) => !prev)}
            />

            {children}
          </main>
        </div>
      </NextThemesProvider>
    </SessionProvider>
  );
}
