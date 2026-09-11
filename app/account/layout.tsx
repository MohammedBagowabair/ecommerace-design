import { CustomerAuthGuard } from "@/components/auth/CustomerAuthGuard";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CustomerAuthGuard>{children}</CustomerAuthGuard>;
}
