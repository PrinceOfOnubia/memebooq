"use client";

import { BookOpen, Send, Sparkles, X } from "lucide-react";
import { SOCIALS } from "./social";

export function LandingGateProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ComingSoonPopup />
    </>
  );
}

function ComingSoonPopup() {
  return (
    <div
      id="coming-soon"
      className="coming-soon-modal fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-black/78 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-[820px] overflow-hidden rounded-[26px] border border-gold/35 bg-[#050505] text-text shadow-[0_0_0_1px_rgba(252,213,53,0.18),0_32px_90px_-28px_rgba(0,0,0,0.95)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(252,213,53,0.18),transparent_26%),radial-gradient(circle_at_72%_18%,rgba(252,213,53,0.08),transparent_22%),radial-gradient(circle_at_18%_82%,rgba(252,213,53,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,transparent_70%,rgba(252,213,53,0.04))]" />
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(252,213,53,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(252,213,53,0.04)_1px,transparent_1px)] [background-size:42px_42px]" />

        <a
          href="/landing"
          aria-label="Close popup"
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-gold/70 bg-black/85 text-text transition-colors hover:border-gold hover:text-gold-bright"
        >
          <X size={22} />
        </a>

        <div className="grid min-h-[520px] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative flex items-center justify-center overflow-hidden border-b border-gold/15 px-4 py-7 sm:px-6 lg:border-b-0 lg:border-r lg:px-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(252,213,53,0.24),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(252,213,53,0.14),transparent_42%),radial-gradient(circle_at_50%_64%,rgba(252,213,53,0.08),transparent_58%)]" />
            <div className="pointer-events-none absolute left-1/2 top-7 h-[76%] w-[72%] -translate-x-1/2 rounded-[42%_42%_18%_18%/34%_34%_12%_12%] border border-gold/50" />
            <div className="pointer-events-none absolute left-1/2 top-9 h-[72%] w-[66%] -translate-x-1/2 rounded-[42%_42%_18%_18%/34%_34%_12%_12%] border border-gold/28" />

            <FloatingSparkle className="left-[14%] top-[16%]" />
            <FloatingSparkle className="left-[18%] top-[36%]" delay="0.8s" />
            <FloatingSparkle className="right-[16%] top-[24%]" delay="0.5s" />
            <FloatingSparkle className="right-[14%] top-[66%]" delay="1.1s" />

            <div className="relative z-10 flex w-full max-w-[360px] items-center justify-center">
              <div className="absolute inset-x-10 bottom-8 h-8 rounded-[50%] bg-gold/25 blur-2xl" />
              <img
                src="/hero-book.png"
                alt="Memebooq coming soon artwork"
                draggable={false}
                className="relative z-10 w-full select-none drop-shadow-[0_28px_42px_rgba(0,0,0,0.92)]"
              />
            </div>
          </div>

          <div className="relative flex flex-col px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-8">
            <div className="flex items-center gap-3">
              <img src="/logo-full.png" alt="Memebooq" className="h-8 w-auto max-w-[220px] sm:h-9" />
            </div>

            <div className="mt-6 max-w-[520px] lg:mt-10">
              <h3 className="font-display text-[clamp(2.4rem,4.8vw,3.9rem)] font-bold leading-[0.95] tracking-[-0.06em] text-balance">
                The Booq
                <span className="block text-gold-grad">Opens Soon</span>
              </h3>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
                <BookOpen size={13} className="text-gold-bright" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
              </div>

              <p className="mt-5 max-w-[34ch] text-[15px] leading-7 text-text/90 sm:text-[16px]">
                The first chapter of Memebooq is being written. We’re putting the
                finishing touches on challenges, rewards, and community missions.
              </p>

              <p className="mt-5 flex items-center gap-3 text-[14px] leading-7 text-gold-bright sm:text-[15px]">
                <Sparkles size={16} className="shrink-0" />
                Follow our journey and be ready when the book opens.
                <Sparkles size={16} className="shrink-0" />
              </p>
            </div>

            <div className="mt-auto pt-6 sm:pt-8">
              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href={SOCIALS.x}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-border-strong bg-black/85 px-4 text-[14px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <XIcon />
                  Follow on X
                </a>
                <a
                  href={SOCIALS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-border-strong bg-black/85 px-4 text-[14px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <Send size={17} className="rotate-[20deg]" />
                  Join Telegram
                </a>
                <a
                  href="/landing"
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-gold-bright to-gold px-5 text-[14px] font-semibold text-black transition-shadow hover:shadow-[0_14px_44px_-14px_rgba(252,213,53,0.8)]"
                >
                  <BookOpen size={17} />
                  Close
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingSparkle({ className, delay = "0s" }: { className: string; delay?: string }) {
  return (
    <div
      className={`absolute z-10 animate-float text-gold-bright drop-shadow-[0_0_8px_rgba(252,213,53,0.7)] ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <Sparkles size={16} />
    </div>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
