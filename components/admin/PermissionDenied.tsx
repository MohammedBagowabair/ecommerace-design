export function PermissionDenied({ message }: { message?: string }) {
  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-8 text-center text-sm text-ink-muted shadow-card">
      {message ?? "ليس لديك صلاحية لعرض هذه الصفحة."}
    </div>
  );
}
