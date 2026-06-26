"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { RewardTicker } from "./RewardTicker";
import { Footer } from "./Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { LandingGateProvider } from "@/components/landing/LandingGate";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingPage } from "@/components/landing/LandingPage";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/landing") || pathname === "/") {
    return (
      <LandingGateProvider>
        <>
          <SmoothScroll />
          <LandingHeader />
          <main className="relative z-10 mx-auto min-h-[60vh] w-full max-w-[1240px] px-4 pb-12 pt-2 sm:px-6">
            {pathname.startsWith("/landing") ? <LandingPage /> : <div className="pt-4">{children}</div>}
          </main>
          <LandingFooter />
        </>
      </LandingGateProvider>
    );
  }

  return (
    <>
      <SmoothScroll />
      <RewardTicker />
      <TopBar />
      <main className="relative z-10 mx-auto min-h-[60vh] w-full max-w-[1240px] px-4 pb-32 pt-6 sm:px-6 md:pb-20">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
