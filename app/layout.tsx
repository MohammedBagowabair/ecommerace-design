import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { StorefrontChrome } from "@/components/layout/StorefrontChrome";
import { brand } from "@/lib/data";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const display = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} | استكيرات نقشات الحناء`,
    template: `%s | ${brand.name}`,
  },
  description: brand.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col overflow-x-clip bg-cream font-arabic text-ink antialiased">
        <Providers>
          <StorefrontChrome>{children}</StorefrontChrome>
        </Providers>
      </body>
    </html>
  );
}
