"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { RewardTicker } from "./RewardTicker";
import { Footer } from "./Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/" || pathname.startsWith("/landing");

  if (isLanding) {
    return <>{children}</>;
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
