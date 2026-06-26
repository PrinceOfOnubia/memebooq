"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/components/providers/AuthProvider";
import { SOCIALS, DiscordIcon, TelegramIcon, XIcon } from "./social";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Challenges", href: "/explore" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Docs", href: "/docs" },
];

export function LandingHeader() {
  const { openConnect } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="ml-8 hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors " +
                (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                  ? "text-gold-bright"
                  : "text-text/70 hover:text-text")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <SocialButton href={SOCIALS.x} label="X">
            <XIcon size={16} />
          </SocialButton>
          <SocialButton href={SOCIALS.telegram} label="Telegram">
            <TelegramIcon size={18} />
          </SocialButton>
          <button
            onClick={openConnect}
            className="ml-1 h-12 rounded-xl bg-gradient-to-b from-gold-bright to-gold px-6 text-[15px] font-semibold text-black transition-shadow hover:shadow-[0_10px_35px_-8px_rgba(240,185,11,0.65)]"
          >
            Open the Book
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="ml-auto grid h-12 w-12 place-items-center rounded-2xl border border-gold/50 text-text transition-colors hover:border-gold hover:bg-gold/10 md:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col border-l border-white/10 bg-[#080808] text-text"
            >
              <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-text transition-colors hover:border-gold hover:bg-gold/10"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={
                      "rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors " +
                      (pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                        ? "bg-white/5 text-gold-bright"
                        : "text-text/75 hover:bg-white/5 hover:text-text")
                    }
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto space-y-4 border-t border-white/10 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center gap-3">
                  <SocialButton href={SOCIALS.x} label="X">
                    <XIcon size={16} />
                  </SocialButton>
                  <SocialButton href={SOCIALS.telegram} label="Telegram">
                    <TelegramIcon size={18} />
                  </SocialButton>
                  <SocialButton href={SOCIALS.discord} label="Discord">
                    <DiscordIcon size={17} />
                  </SocialButton>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    openConnect();
                  }}
                  className="h-12 w-full rounded-2xl bg-gradient-to-b from-gold-bright to-gold text-[15px] font-semibold text-black"
                >
                  Open the Book
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
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
      className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 text-text/80 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-text"
    >
      {children}
    </a>
  );
}
