"use client";

import { Menu, LogOut } from "lucide-react";
import { useAdminAuthStore } from "@/lib/store/admin-auth";
import { useAdminDataStore } from "@/lib/store/admin-data";
import { useRouter } from "next/navigation";
import { NotificationBell } from "./NotificationBell";
import { AdminCommandJump } from "./AdminCommandJump";

export function AdminTopbar({
  title,
  onMenu,
}: {
  title?: string;
  onMenu: () => void;
}) {
  const router = useRouter();
  const session = useAdminAuthStore((s) => s.session);
  const logout = useAdminAuthStore((s) => s.logout);
  const role = useAdminDataStore((s) =>
    s.roles.find((r) => r.id === session?.roleId)
  );

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-cream-300 bg-white/95 px-3 backdrop-blur sm:gap-3 sm:px-5">
      <button
        type="button"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-ink hover:bg-cream-100 lg:hidden"
        onClick={onMenu}
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        {title && (
          <h1 className="truncate text-sm font-bold text-ink sm:text-base">{title}</h1>
        )}
      </div>

      <AdminCommandJump />
      <NotificationBell />

      {session && (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-end sm:block">
            <p className="text-sm font-semibold text-ink">{session.name}</p>
            <p className="text-[11px] text-ink-muted">{role?.name ?? session.roleSlug}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-henna-100 text-sm font-bold text-henna">
            {session.name.slice(0, 1)}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cream-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      )}
    </header>
  );
}
