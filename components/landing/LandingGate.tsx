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

      <div className="relative z-10 w-full max-w-[760px] overflow-hidden rounded-[24px] border border-gold/35 bg-[#050505] text-text shadow-[0_0_0_1px_rgba(252,213,53,0.18),0_28px_72px_-28px_rgba(0,0,0,0.92)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_30%,rgba(252,213,53,0.18),transparent_26%),radial-gradient(circle_at_72%_18%,rgba(252,213,53,0.08),transparent_22%),radial-gradient(circle_at_18%_82%,rgba(252,213,53,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,transparent_70%,rgba(252,213,53,0.04))]" />
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(252,213,53,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(252,213,53,0.04)_1px,transparent_1px)] [background-size:42px_42px]" />

        <a
          href="/landing"
          aria-label="Close popup"
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-gold/70 bg-black/85 text-text transition-colors hover:border-gold hover:text-gold-bright"
        >
          <X size={22} />
        </a>

        <div className="hidden min-h-[460px] lg:grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative flex items-center justify-center overflow-hidden border-b border-gold/15 px-4 py-6 sm:px-6 lg:border-b-0 lg:border-r lg:px-5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(252,213,53,0.24),transparent_28%),radial-gradient(circle_at_50%_50%,rgba(252,213,53,0.14),transparent_42%),radial-gradient(circle_at_50%_64%,rgba(252,213,53,0.08),transparent_58%)]" />
            <div className="pointer-events-none absolute left-1/2 top-7 h-[76%] w-[72%] -translate-x-1/2 rounded-[42%_42%_18%_18%/34%_34%_12%_12%] border border-gold/42" />
            <div className="pointer-events-none absolute left-1/2 top-9 h-[72%] w-[66%] -translate-x-1/2 rounded-[42%_42%_18%_18%/34%_34%_12%_12%] border border-gold/24" />

            <FloatingSparkle className="left-[14%] top-[16%]" />
            <FloatingSparkle className="left-[18%] top-[36%]" delay="0.8s" />
            <FloatingSparkle className="right-[16%] top-[24%]" delay="0.5s" />
            <FloatingSparkle className="right-[14%] top-[66%]" delay="1.1s" />

            <div className="relative z-10 flex w-full max-w-[320px] items-center justify-center">
              <div className="absolute inset-x-12 bottom-7 h-7 rounded-[50%] bg-gold/25 blur-2xl" />
              <img
                src="/hero-book.png"
                alt="Memebooq coming soon artwork"
                draggable={false}
                className="relative z-10 w-full select-none drop-shadow-[0_24px_36px_rgba(0,0,0,0.92)]"
              />
            </div>
          </div>

          <div className="relative flex flex-col px-5 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-7">
            <div className="flex items-center gap-3">
              <img src="/logo-full.png" alt="Memebooq" className="h-8 w-auto max-w-[220px] sm:h-9" />
            </div>

            <div className="mt-5 max-w-[500px] lg:mt-8">
              <h3 className="font-display text-[clamp(2.25rem,4vw,3.35rem)] font-bold leading-[0.96] tracking-[-0.06em] text-balance">
                The Booq
                <span className="block text-gold-grad">Opens Soon</span>
              </h3>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
                <BookOpen size={13} className="text-gold-bright" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/65 to-transparent" />
              </div>

              <p className="mt-4 max-w-[38ch] text-[15px] leading-7 text-text/88 sm:text-[15.5px]">
                We’re writing the first chapter of Memebooq. Challenges, rewards,
                creator campaigns, and community missions are almost ready.
              </p>

              <p className="mt-4 flex items-center gap-2.5 text-[14px] leading-6 text-gold-bright sm:text-[15px]">
                <Sparkles size={16} className="shrink-0" />
                Follow the journey and be first to enter when the book opens.
                <Sparkles size={16} className="shrink-0" />
              </p>
            </div>

            <div className="mt-auto pt-6 sm:pt-7">
              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href={SOCIALS.x}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2.5 rounded-2xl border border-border-strong bg-black/85 px-4 text-[14px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <XIcon />
                  Follow
                </a>
                <a
                  href={SOCIALS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2.5 rounded-2xl border border-border-strong bg-black/85 px-4 text-[14px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <Send size={17} className="rotate-[20deg]" />
                  Join
                </a>
                <a
                  href="/landing"
                  className="inline-flex h-11 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-gold-bright to-gold px-5 text-[14px] font-semibold text-black transition-shadow hover:shadow-[0_14px_44px_-14px_rgba(252,213,53,0.8)]"
                >
                  <BookOpen size={17} />
                  Close Book
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-h-[unset] lg:hidden">
          <div className="relative flex flex-col overflow-hidden px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex items-center justify-between gap-3">
              <img src="/logo-full.png" alt="Memebooq" className="h-8 w-auto max-w-[180px]" />
              <a
                href="/landing"
                aria-label="Close popup"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/70 bg-black/85 text-text transition-colors hover:border-gold hover:text-gold-bright"
              >
                <X size={20} />
              </a>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="relative flex items-center justify-center overflow-hidden rounded-[18px] border border-gold/18 bg-black/50 px-3 py-4">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(252,213,53,0.2),transparent_32%),radial-gradient(circle_at_50%_54%,rgba(252,213,53,0.1),transparent_46%)]" />
                <div className="pointer-events-none absolute inset-x-10 bottom-4 h-6 rounded-[50%] bg-gold/20 blur-2xl" />
                <img
                  src="/hero-book.png"
                  alt="Memebooq coming soon artwork"
                  draggable={false}
                  className="relative z-10 w-[78%] max-w-[250px] select-none drop-shadow-[0_20px_32px_rgba(0,0,0,0.9)]"
                />
              </div>

              <div>
                <h3 className="font-display text-[2.15rem] font-bold leading-[0.98] tracking-[-0.06em] text-balance">
                  The Booq
                  <span className="block text-gold-grad">Opens Soon</span>
                </h3>
                <p className="mt-3 text-[14px] leading-6 text-text/88">
                  We’re writing the first chapter of Memebooq. Challenges, rewards,
                  creator campaigns, and community missions are almost ready. Follow
                  the journey and be first to enter when the book opens.
                </p>
              </div>

              <div className="grid gap-2.5">
                <a
                  href={SOCIALS.x}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2.5 rounded-2xl border border-border-strong bg-black/85 px-4 text-[14px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <XIcon />
                  Follow
                </a>
                <a
                  href={SOCIALS.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2.5 rounded-2xl border border-border-strong bg-black/85 px-4 text-[14px] font-semibold text-text transition-colors hover:border-gold/60 hover:text-gold-bright"
                >
                  <Send size={17} className="rotate-[20deg]" />
                  Join
                </a>
                <a
                  href="/landing"
                  className="inline-flex h-12 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-gold-bright to-gold px-5 text-[14px] font-semibold text-black transition-shadow hover:shadow-[0_14px_44px_-14px_rgba(252,213,53,0.8)]"
                >
                  <BookOpen size={17} />
                  Close Book
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
