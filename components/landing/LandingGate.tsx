"use client";

import { createContext, useContext, useState } from "react";
import { BookOpen, Send, Sparkles, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SOCIALS } from "./social";

type LaunchModalContextValue = {
  openLaunchModal: () => void;
  closeLaunchModal: () => void;
};

const LaunchModalContext = createContext<LaunchModalContextValue | null>(null);

export function LandingGateProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <LaunchModalContext.Provider
      value={{
        openLaunchModal: () => setOpen(true),
        closeLaunchModal: () => setOpen(false),
      }}
    >
      {children}
      <LaunchModal open={open} onClose={() => setOpen(false)} />
    </LaunchModalContext.Provider>
  );
}

export function useLaunchModal() {
  const ctx = useContext(LaunchModalContext);
  if (!ctx) {
    throw new Error("useLaunchModal must be used within LandingGateProvider");
  }
  return ctx;
}

function LaunchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      showHeader={false}
      mobilePlacement="center"
      bodyScrollable={false}
      shellClassName="w-[min(760px,calc(100vw-1rem))] max-h-[85dvh] overflow-hidden rounded-[24px] border border-gold/35 bg-[#050505] text-text shadow-[0_0_0_1px_rgba(252,213,53,0.18),0_28px_72px_-28px_rgba(0,0,0,0.92)] sm:w-[min(780px,calc(100vw-2rem))] sm:max-h-[90dvh]"
      bodyClassName="p-0 overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_26%,rgba(252,213,53,0.16),transparent_24%),radial-gradient(circle_at_72%_20%,rgba(252,213,53,0.09),transparent_20%),radial-gradient(circle_at_18%_82%,rgba(252,213,53,0.06),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%,transparent_78%,rgba(252,213,53,0.04))]" />
        <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(252,213,53,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(252,213,53,0.04)_1px,transparent_1px)] [background-size:42px_42px]" />

        <button
          onClick={onClose}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-gold/55 bg-black/88 text-text transition-colors hover:border-gold hover:text-gold-bright sm:right-4 sm:top-4"
        >
          <X size={20} />
        </button>

        <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative flex items-center justify-center px-4 pt-14 sm:px-5 sm:pt-16 lg:border-r lg:border-gold/14 lg:px-5 lg:py-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(252,213,53,0.2),transparent_28%),radial-gradient(circle_at_50%_54%,rgba(252,213,53,0.1),transparent_44%)]" />
            <div className="pointer-events-none absolute inset-x-10 bottom-5 h-8 rounded-[50%] bg-gold/20 blur-2xl lg:bottom-6" />

            <FloatingSparkle className="left-[8%] top-[18%] hidden lg:block" />
            <FloatingSparkle className="left-[16%] top-[42%]" delay="0.7s" />
            <FloatingSparkle className="right-[10%] top-[28%]" delay="0.4s" />
            <FloatingSparkle className="right-[8%] bottom-[18%] hidden lg:block" delay="1s" />

            <div className="relative z-10 flex w-full max-w-[250px] items-center justify-center sm:max-w-[280px] lg:max-w-[320px]">
              <img
                src="/hero-book.png"
                alt="Memebooq coming soon artwork"
                draggable={false}
                className="relative z-10 w-full select-none drop-shadow-[0_22px_34px_rgba(0,0,0,0.92)]"
              />
            </div>
          </div>

          <div className="relative flex flex-col px-4 pb-4 pt-0 sm:px-5 sm:pb-5 lg:px-6 lg:py-6">
            <div className="flex items-center gap-3">
              <img src="/logo-full.png" alt="Memebooq" className="h-7 w-auto max-w-[170px] sm:h-8 sm:max-w-[210px]" />
            </div>

            <div className="mt-4 max-w-[500px] lg:mt-6">
              <h3 className="font-display text-[clamp(1.9rem,6.8vw,3.15rem)] font-bold leading-[0.95] tracking-[-0.06em] text-balance">
                The Booq
                <span className="block text-gold-grad">Opens Soon</span>
              </h3>

              <div className="mt-3 flex items-center gap-3 lg:mt-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
                <BookOpen size={13} className="text-gold-bright" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
              </div>

              <p className="mt-3 max-w-[40ch] text-[13px] leading-6 text-text/88 sm:text-[14px]">
                We’re writing the first chapter of Memebooq. Challenges, rewards, creator campaigns, and
                community missions are almost ready. Follow the journey and be first to enter when the book
                opens.
              </p>

              <p className="mt-3 flex items-center gap-2 text-[13px] leading-6 text-gold-bright sm:text-[14px]">
                <Sparkles size={15} className="shrink-0" />
                Launching soon. Follow the journey.
                <Sparkles size={15} className="shrink-0" />
              </p>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3 sm:gap-3 lg:mt-auto lg:pt-5">
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
              <button
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-gold-bright to-gold px-5 text-[14px] font-semibold text-black transition-shadow hover:shadow-[0_14px_44px_-14px_rgba(252,213,53,0.8)]"
                type="button"
              >
                <BookOpen size={17} />
                Close Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
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
