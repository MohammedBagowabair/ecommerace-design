"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserForm } from "@/components/admin/UserForm";
import { useAdminDataStore } from "@/lib/store/admin-data";

export default function EditAdminUserPage() {
  const params = useParams();
  const id = String(params.id || "");
  const ensureSeeded = useAdminDataStore((s) => s.ensureSeeded);
  const user = useAdminDataStore((s) => s.users.find((u) => u.id === id));

  useEffect(() => {
    ensureSeeded();
  }, [ensureSeeded]);

  return (
    <AdminShell title="تعديل مستخدم">
      {!user ? (
        <div className="rounded-2xl border border-cream-300 bg-white p-8 text-center shadow-card">
          <p className="text-sm text-ink-muted">المستخدم غير موجود</p>
          <Link href="/admin/users" className="mt-3 inline-block text-sm font-semibold text-henna hover:underline">
            العودة للقائمة
          </Link>
        </div>
      ) : (
        <UserForm mode="edit" user={user} />
      )}
    </AdminShell>
  );
}
