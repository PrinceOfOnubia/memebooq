"use client";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { useAuth } from "@/components/providers/AuthProvider";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LandingHero } from "./LandingHero";

export function LandingPage() {
  const { openConnect } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      <LandingHeader />

      <main className="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        <LandingHero />
        <HowItWorks />

        <section className="mt-20">
          <div className="relative overflow-hidden rounded-[28px] border border-gold/20 bg-gradient-to-br from-bg-2 to-surface p-8 text-center sm:p-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-green/10 blur-3xl" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl">
                Ready to <span className="text-gold-grad">compete?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
                The first chapter is still being prepared - discover what Shillcoins will unlock when launch begins.
              </p>
              <button
                type="button"
                onClick={openConnect}
                className="mt-7 inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-b from-gold-bright to-gold px-8 text-[15px] font-semibold text-black transition-shadow hover:shadow-[0_12px_44px_-8px_rgba(240,185,11,0.65)]"
              >
                Start Shilling
              </button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
