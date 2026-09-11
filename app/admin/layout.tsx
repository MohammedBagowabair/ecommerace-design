import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "لوحة الإدارة",
    template: "%s | إدارة نقشات",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-cream-100">{children}</div>;
}
