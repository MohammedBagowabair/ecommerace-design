"use client";

import { ToastViewport } from "@/components/ui/Toast";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/search/SearchOverlay";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
      <SearchOverlay />
      <ToastViewport />
    </>
  );
}
