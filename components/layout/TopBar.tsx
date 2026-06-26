"use client";

import { Link } from "next-view-transitions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Plus, Search, User, Wallet } from "lucide-react";
import { Logo } from "./Logo";
import { NotificationsMenu } from "./NotificationsMenu";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn, shortAddr } from "@/lib/utils";

const nav = [
  { href: "/home", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { address, disconnect, user, openConnect, connected } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        <Logo href="/home" />

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const active = n.href === "/home" ? pathname === "/home" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {active && <span className="absolute inset-0 rounded-full bg-surface-2" />}
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(search.trim() ? `/explore?q=${encodeURIComponent(search.trim())}` : "/explore");
          }}
          className="ml-auto hidden lg:block"
        >
          <label className="flex h-10 w-72 items-center gap-2.5 rounded-full border border-border bg-surface/70 px-4 text-sm text-faint transition-colors focus-within:border-border-strong">
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

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <button
            aria-label="Search"
            onClick={() => router.push("/explore")}
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted transition-colors hover:text-text lg:hidden"
          >
            <Search size={18} />
          </button>
          <NotificationsMenu />
          <Link
            href="/create"
            className="hidden h-10 items-center gap-1.5 rounded-full bg-gradient-to-b from-gold-bright to-gold px-4 text-sm font-semibold text-black transition-shadow hover:shadow-[0_8px_30px_-6px_rgba(240,185,11,0.6)] md:flex"
          >
            <Plus size={16} strokeWidth={2.6} />
            Create
          </Link>
          <button
            className="hidden h-10 items-center gap-2 rounded-full border border-border-strong bg-surface px-3 text-sm font-medium transition-colors hover:border-gold/50 sm:flex"
            onClick={() => (connected ? router.push("/profile") : openConnect())}
            type="button"
          >
            <Wallet size={16} className="text-gold-bright" />
            <span className="font-mono">{connected ? shortAddr(address ?? user?.wallet ?? "") : "Connect wallet"}</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              aria-label="Account"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="block rounded-full transition-opacity hover:opacity-90"
            >
              <Avatar src={user?.avatar ?? "/logo-mark.png"} alt={user?.name ?? "Memebooq user"} size={38} verified={user?.xConnected} ring />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 z-[95] w-60 overflow-hidden rounded-2xl border border-border-strong glass-strong">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-text">{user?.name ?? "Connect your wallet"}</p>
                  <p className="mt-0.5 font-mono text-[12px] text-faint">
                    {shortAddr(address ?? user?.wallet ?? "0x0000000000000000000000000000000000000000")}
                  </p>
                </div>
                <div className="p-1.5">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] text-muted transition-colors hover:bg-surface-2 hover:text-text"
                  >
                    <User size={16} /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      disconnect();
                      router.push("/home");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] text-rose-400 transition-colors hover:bg-rose-500/10"
                  >
                    <LogOut size={16} /> Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
