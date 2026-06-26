import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Memebooq — Create challenges. Grow your community. Earn rewards.",
  description:
    "Memebooq is the home for crypto communities. Create challenges, grow your community and earn rewards.",
  icons: {
    icon: "/icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="antialiased">
      <body className="min-h-dvh">
        <ViewTransitions>
          <IntroProvider>
            <AuthProvider>
              <AppShell>{children}</AppShell>
            </AuthProvider>
          </IntroProvider>
        </ViewTransitions>
      </body>
    </html>
  );
}
