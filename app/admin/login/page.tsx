import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gold/40" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
