"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/layout/Logo";
import { SOCIALS, TelegramIcon, XIcon } from "./social";
import { useLaunchModal } from "./LandingGate";

const navItems = [
  { label: "Home", href: "/landing" as const, kind: "link" as const },
  { label: "Challenges", kind: "launch" as const },
  { label: "Leaderboard", kind: "launch" as const },
  { label: "Docs", href: "/docs" as const, kind: "link" as const },
];

const drawerLinks = [
  { label: "Home", href: "/landing" as const, kind: "link" as const },
  { label: "Challenges", kind: "launch" as const },
  { label: "Leaderboard", kind: "launch" as const },
  { label: "Docs", href: "/docs" as const, kind: "link" as const },
  { label: "Token", href: "/token" as const, kind: "link" as const },
  { label: "Privacy Policy", href: "/privacy" as const, kind: "link" as const },
  { label: "Terms", href: "/terms" as const, kind: "link" as const },
];

export function LandingHeader() {
  const { openLaunchModal } = useLaunchModal();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <Logo href="/landing" />

        <nav className="mx-auto hidden items-center gap-8 md:flex">
          {navItems.map((item, i) =>
            item.kind === "launch" ? (
              <button
                key={item.label}
                onClick={openLaunchModal}
                className={
                  "text-sm font-medium transition-colors hover:text-text " +
                  (i === 0 ? "text-gold-bright" : "text-muted")
                }
                type="button"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={
                  "text-sm font-medium transition-colors hover:text-text " +
                  (i === 0 ? "text-gold-bright" : "text-muted")
                }
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <SocialButton href={SOCIALS.x} label="X">
            <XIcon size={16} />
          </SocialButton>
          <SocialButton href={SOCIALS.telegram} label="Telegram">
            <TelegramIcon size={18} />
          </SocialButton>
          <button
            onClick={openLaunchModal}
            className="ml-1 h-10 rounded-full bg-gradient-to-b from-gold-bright to-gold px-5 text-sm font-semibold text-black transition-shadow hover:shadow-[0_8px_30px_-6px_rgba(240,185,11,0.6)]"
            type="button"
          >
            Open the Book
          </button>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text md:hidden"
          type="button"
        >
          <Menu size={20} />
        </button>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <MobileDrawer
              open={open}
              onClose={() => setOpen(false)}
              onLaunch={() => {
                setOpen(false);
                openLaunchModal();
              }}
            />,
            document.body,
          )
        : null}
    </header>
  );
}

function MobileDrawer({
  open,
  onClose,
  onLaunch,
}: {
  open: boolean;
  onClose: () => void;
  onLaunch: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close menu backdrop"
            className="absolute inset-0 bg-black/72 backdrop-blur-sm"
            onClick={onClose}
            type="button"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: "100%", opacity: 0.98 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-0 flex h-full w-[84vw] max-w-[340px] flex-col border-l border-border-strong bg-[#070708] shadow-[0_0_0_1px_rgba(252,213,53,0.12),-24px_0_60px_rgba(0,0,0,0.65)]"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <Logo href="/landing" className="scale-[0.9] origin-left" />
              <button
                aria-label="Close menu"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-faint transition-colors hover:border-gold/40 hover:text-text"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col px-3 py-3">
              {drawerLinks.map((item) =>
                item.kind === "launch" ? (
                  <button
                    key={item.label}
                    onClick={onLaunch}
                    className="rounded-2xl px-4 py-3 text-left text-[15px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
                    type="button"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="rounded-2xl px-4 py-3 text-[15px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="mt-auto border-t border-border px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-center gap-3">
                <SocialButton href={SOCIALS.x} label="X">
                  <XIcon size={16} />
                </SocialButton>
                <SocialButton href={SOCIALS.telegram} label="Telegram">
                  <TelegramIcon size={18} />
                </SocialButton>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors hover:border-border-strong hover:text-text"
    >
      {children}
    </a>
  );
}
