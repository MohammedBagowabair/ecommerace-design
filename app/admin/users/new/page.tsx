"use client";

import { useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserForm } from "@/components/admin/UserForm";
import { useAdminDataStore } from "@/lib/store/admin-data";

export default function NewAdminUserPage() {
  const ensureSeeded = useAdminDataStore((s) => s.ensureSeeded);
  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  return (
    <AdminShell title="مستخدم جديد">
      <UserForm mode="create" />
    </AdminShell>
  );
}
