"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Logo } from "./Logo";

const cols = [
  { title: "Platform", links: [["Explore", "/explore"], ["Create", "/create"], ["Leaderboard", "/leaderboard"], ["Profile", "/profile"]] },
  { title: "Get started", links: [["Get verified", "/verify"], ["Project verification", "/verify"], ["Admin", "/admin"]] },
  { title: "Resources", links: [["Docs", "/docs"], ["How it works", "/docs#how-it-works"], ["Privacy", "/privacy"], ["BNB Chain", "/project/BNBCHAIN"]] },
];

export function Footer() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <footer className="relative z-10 mt-8 border-t border-border bg-bg-2/60">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo href="/home" />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-faint">
            The community-first crypto arena. Create on X, submit your link, compete for funded rewards.
          </p>
          <p className="mt-4 text-[12px] text-faint">Dark mode · Mobile-first · Powered by BNB Chain</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(search.trim() ? `/explore?q=${encodeURIComponent(search.trim())}` : "/explore");
            }}
            className="mt-5 hidden max-w-sm lg:block"
          >
            <label className="flex h-11 items-center gap-2 rounded-2xl border border-border bg-surface/70 px-4 text-sm text-faint transition-colors focus-within:border-border-strong">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search challenges…"
                className="h-full flex-1 bg-transparent outline-none placeholder:text-faint"
              />
              <button
                type="submit"
                className="rounded-full bg-surface-2 px-2 py-1 font-mono text-[10px] text-muted transition-colors hover:text-text"
              >
                Enter
              </button>
            </label>
          </form>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-muted">{c.title}</p>
            <ul className="space-y-2.5">
              {c.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[14px] text-faint transition-colors hover:text-text">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-2 px-4 py-5 pb-28 text-[12px] text-faint sm:flex-row sm:px-6 md:pb-5">
          <span>© {new Date().getFullYear()} Memebooq. Every card is a challenge to join.</span>
          <span className="flex gap-4">
            <Link href="/docs" className="hover:text-text">Docs</Link>
            <Link href="/token" className="hover:text-text">Token</Link>
            <Link href="/privacy" className="hover:text-text">Privacy</Link>
            <Link href="/terms" className="hover:text-text">Terms</Link>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-text">𝕏</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
