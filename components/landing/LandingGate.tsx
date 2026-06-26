"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Link } from "next-view-transitions";
import { BookOpen, Send, Sparkles, X } from "lucide-react";
import { SOCIALS } from "./social";

type LandingGateContextValue = {
  openSoon: () => void;
};

const LandingGateContext = createContext<LandingGateContextValue | null>(null);

export function LandingGateProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const openSoon = useCallback(() => router.push("/#coming-soon"), [router]);
  const value = useMemo(
    () => ({
      openSoon,
    }),
    [openSoon],
  );

  return (
    <LandingGateContext.Provider value={value}>
      {children}
      <ComingSoonModal />
    </LandingGateContext.Provider>
  );
}

export function useLandingGate() {
  const ctx = useContext(LandingGateContext);
  if (!ctx) throw new Error("useLandingGate must be used within LandingGateProvider");
  return ctx;
}

function ComingSoonModal() {
  return (
    <div
      id="coming-soon"
      className="coming-soon-modal fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-black/78 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-[980px] overflow-hidden rounded-[30px] border border-gold/35 bg-[#050505] text-text shadow-[0_0_0_1px_rgba(252,213,53,0.18),0_40px_120px_-30px_rgba(0,0,0,0.95)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(252,213,53,0.2),transparent_28%),radial-gradient(circle_at_72%_18%,rgba(252,213,53,0.08),transparent_22%),radial-gradient(circle_at_18%_82%,rgba(252,213,53,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%,transparent_70%,rgba(252,213,53,0.05))]" />
        <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(252,213,53,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(252,213,53,0.045)_1px,transparent_1px)] [background-size:46px_46px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[radial-gradient(ellipse_at_center,rgba(252,213,53,0.12),transparent_70%)]" />

        <Link
          href="/"
          aria-label="Close popup"
          className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full border border-gold/70 bg-black/80 text-text transition-colors hover:border-gold hover:text-gold-bright"
        >
          <X size={24} />
        </Link>

        <div className="grid min-h-[min(80vh,900px)] lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative flex items-center justify-center overflow-hidden border-b border-gold/15 px-4 py-8 sm:px-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(252,213,53,0.28),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(252,213,53,0.16),transparent_42%),radial-gradient(circle_at_50%_64%,rgba(252,213,53,0.08),transparent_58%)]" />

            <div className="pointer-events-none absolute left-1/2 top-7 h-[78%] w-[72%] -translate-x-1/2 rounded-[42%_42%_18%_18%/34%_34%_12%_12%] border border-gold/55 shadow-[0_0_0_1px_rgba(252,213,53,0.12),0_0_65px_rgba(252,213,53,0.22)]" />
            <div className="pointer-events-none absolute left-1/2 top-9 h-[74%] w-[66%] -translate-x-1/2 rounded-[42%_42%_18%_18%/34%_34%_12%_12%] border border-gold/30" />
            <div className="pointer-events-none absolute left-1/2 top-14 h-[66%] w-[58%] -translate-x-1/2 rounded-[42%_42%_18%_18%/34%_34%_12%_12%] border border-gold/18" />

            <div className="pointer-events-none absolute inset-x-10 bottom-6 h-20 rounded-[50%] border border-gold/50 bg-[radial-gradient(ellipse_at_center,rgba(252,213,53,0.12),rgba(252,213,53,0.02)_45%,transparent_72%)] blur-[1px]" />
            <div className="pointer-events-none absolute inset-x-8 bottom-3 h-24 rounded-[50%] border border-gold/18 bg-[radial-gradient(ellipse_at_center,rgba(252,213,53,0.08),transparent_68%)]" />

            <FloatingSparkle className="left-[12%] top-[14%]" />
            <FloatingSparkle className="left-[18%] top-[33%]" delay="0.8s" />
            <FloatingSparkle className="right-[14%] top-[22%]" delay="0.5s" />
            <FloatingSparkle className="right-[12%] top-[68%]" delay="1.1s" />
            <FloatingSparkle className="left-[22%] bottom-[14%]" delay="0.3s" />

            <div className="relative z-10 flex w-full max-w-[460px] items-center justify-center">
              <div className="absolute inset-x-10 bottom-10 h-10 rounded-[50%] bg-gold/25 blur-3xl" />
              <img
                src="/hero-book.png"
                alt="Memebooq coming soon artwork"
                draggable={false}
                className="relative z-10 w-full select-none drop-shadow-[0_38px_55px_rgba(0,0,0,0.92)]"
              />
            </div>
          </div>

          <div className="relative flex flex-col px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="flex items-center gap-3">
              <img src="/logo-full.png" alt="Memebooq" className="h-9 w-auto max-w-[250px] sm:h-10" />
            </div>

            <div className="mt-7 max-w-[560px] lg:mt-14">
              <h3 className="font-display text-[clamp(3.2rem,5.8vw,5.3rem)] font-bold leading-[0.92] tracking-[-0.06em] text-balance">
                The Booq
                <span className="block text-gold-grad">Opens Soon</span>
              </h3>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
                <BookOpen size={14} className="text-gold-bright" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
              </div>

              <p className="mt-7 max-w-[38ch] text-[16px] leading-8 text-text/90 sm:text-[17px]">
                The first chapter of Memebooq is being written. We’re putting the
                finishing touches on challenges, rewards, and community missions.
              </p>

              <p className="mt-6 flex items-center gap-3 text-[15px] leading-7 text-gold-bright sm:text-[16px]">
                <Sparkles size={18} className="shrink-0" />
                Follow our journey and be ready when the book opens.
                <Sparkles size={18} className="shrink-0" />
              </p>
            </div>

            <div className="mt-auto pt-8 sm:pt-10">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <a
                  href={SOCIALS.x}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-border-strong bg-black/85 px-5 text-[15px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <XIcon />
                  Follow on X
                </a>
                <a
                  href={SOCIALS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-border-strong bg-black/85 px-5 text-[15px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <Send size={18} className="rotate-[20deg]" />
                  Join Telegram
                </a>
                <Link
                  href="/"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-gold-bright to-gold px-7 text-[15px] font-semibold text-black transition-shadow hover:shadow-[0_16px_54px_-14px_rgba(252,213,53,0.8)]"
                >
                  <BookOpen size={18} />
                  Close
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(252,213,53,0.06))]" />
      </div>
    </div>
  );
}

function FloatingSparkle({ className, delay = "0s" }: { className: string; delay?: string }) {
  return (
    <div
      className={`absolute z-10 animate-float text-gold-bright drop-shadow-[0_0_10px_rgba(252,213,53,0.7)] ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <Sparkles size={18} />
    </div>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
