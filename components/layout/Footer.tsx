import Link from "next/link";
import { Logo } from "./Logo";
import { DiscordIcon, SOCIALS, TelegramIcon, XIcon } from "@/components/landing/social";

const cols = [
  { title: "Quick Links", links: [["Home", "/"], ["Challenges", "/explore"], ["Leaderboard", "/leaderboard"], ["Docs", "/docs"]] },
  { title: "Socials", links: [["X", SOCIALS.x], ["Telegram", SOCIALS.telegram], ["Discord", SOCIALS.discord]] },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-12 border-t border-white/8 bg-black">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_.9fr_.8fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-text/62">
            The leading platform for crypto communities to compete, earn and grow together.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-bright">{c.title}</p>
            <ul className="space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith("http") ? (
                    <a href={href} target="_blank" rel="noreferrer" className="text-[15px] text-text/68 transition-colors hover:text-text">
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="text-[15px] text-text/68 transition-colors hover:text-text">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-4 py-5 text-[12px] text-text/48 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Memebooq. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <a href={SOCIALS.x} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 text-text/80 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-text">
              <XIcon size={16} />
            </a>
            <a href={SOCIALS.telegram} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 text-text/80 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-text">
              <TelegramIcon size={17} />
            </a>
            <a href={SOCIALS.discord} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 text-text/80 transition-colors hover:border-gold/60 hover:bg-gold/10 hover:text-text">
              <DiscordIcon size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
