"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
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
  );
}
