"use client";

import { useState } from "react";
import { AdminGuard } from "./AdminGuard";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-cream">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar title={title} onMenu={() => setSidebarOpen(true)} />
          <div className="flex-1 p-4 sm:p-5 lg:p-7">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
