"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Sparkles, Star } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/components/providers/AuthProvider";
import { ContractAddress } from "./ContractAddress";
import { Link } from "next-view-transitions";
import { fetchPublicSite } from "@/lib/public-api";

const fallbackStats = {
  totalUsers: 24_560,
  challenges: 1_248,
  winners: 320,
  rewardsDistributed: 1_450_000,
};

export function LandingHero() {
  const { openConnect } = useAuth();
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    let alive = true;
    fetchPublicSite()
      .then((data) => {
        if (alive && data?.stats) setStats({ ...fallbackStats, ...data.stats });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_50%_8%,rgba(240,185,11,0.12),transparent_34%),radial-gradient(circle_at_82%_36%,rgba(240,185,11,0.16),transparent_20%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_45%)]" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gold/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[1240px] px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <Badge
              tone="gold"
              className="rounded-full border border-gold/20 bg-[#111] px-4 py-2 text-[12px] tracking-[0.22em] text-gold-bright"
            >
              <Sparkles size={12} /> CREATE. COMPETE. EARN.
            </Badge>

            <h1 className="mt-6 max-w-xl font-display text-[46px] font-bold leading-[0.95] tracking-[-0.06em] text-balance sm:text-[68px]">
              Create challenges.
              <br />
              Grow your community.
              <br />
              <span className="text-gold-grad">Earn rewards.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] leading-7 text-text/68 sm:text-[18px]">
              Memebooq is the home for crypto communities. Complete challenges, earn rewards and climb the leaderboard.
            </p>

            <ContractAddress className="mt-7 w-full max-w-md" />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={openConnect}
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-gold-bright to-gold px-8 text-[15px] font-semibold text-black transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-10px_rgba(240,185,11,0.7)]"
              >
                <BookOpen size={18} />
                Open the Book
              </button>
              <Link
                href="/explore"
                className="group inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/18 bg-white/3 px-8 text-[15px] font-semibold text-text transition-colors hover:border-gold/60 hover:bg-gold/8"
              >
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                Explore Challenges
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[580px] items-center justify-center">
            <div className="absolute left-6 top-10 text-gold-bright/95">
              <Sparkles size={30} className="drop-shadow-[0_0_14px_rgba(252,213,53,0.6)]" />
            </div>
            <div className="absolute right-10 top-20 text-gold-bright/95">
              <Star size={28} className="drop-shadow-[0_0_14px_rgba(252,213,53,0.6)]" />
            </div>
            <div className="absolute bottom-16 left-10 text-gold-bright/95">
              <Star size={26} className="drop-shadow-[0_0_14px_rgba(252,213,53,0.6)]" />
            </div>

            <div className="relative h-[420px] w-full max-w-[520px] sm:h-[560px]">
              <div className="absolute right-4 top-2 h-[88%] w-[62%] rounded-[36px] bg-[#1c1c1f] shadow-[0_24px_90px_rgba(0,0,0,0.8)] rotate-[10deg]">
                <div className="absolute inset-0 rounded-[36px] border border-white/8" />
                <div className="absolute inset-0 rounded-[36px] bg-[linear-gradient(145deg,rgba(255,255,255,0.04),transparent_28%,rgba(0,0,0,0.18)_68%)]" />
                <div className="absolute left-1/2 top-10 flex -translate-x-1/2 items-center justify-center">
                  <img src="/logo-mark.png" alt="Memebooq" className="h-44 w-44 drop-shadow-[0_12px_22px_rgba(0,0,0,0.5)]" />
                </div>
                <div className="absolute bottom-0 right-8 h-20 w-10 rounded-b-[18px] bg-gold" />
                <div className="absolute right-[-18px] top-10 h-[82%] w-8 rounded-r-[32px] bg-[#d9b86d]" />
              </div>

              <div className="absolute left-0 top-[12%] h-36 w-36 rounded-full bg-gradient-to-br from-gold-bright to-gold shadow-[0_18px_40px_rgba(240,185,11,0.35)]">
                <div className="absolute inset-[16%] rounded-full border-[10px] border-white/10" />
                <div className="absolute inset-0 grid place-items-center">
                  <img src="/logo-mark.png" alt="" aria-hidden className="h-20 w-20 brightness-0 invert" />
                </div>
              </div>

              <div className="absolute bottom-14 right-2 h-28 w-28 rounded-full bg-gradient-to-br from-gold-bright to-gold shadow-[0_18px_40px_rgba(240,185,11,0.35)]">
                <div className="absolute inset-[14%] rounded-full border-[10px] border-white/10" />
                <div className="absolute inset-0 grid place-items-center">
                  <img src="/logo-mark.png" alt="" aria-hidden className="h-16 w-16 brightness-0 invert" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-white/8 bg-white/8 sm:grid-cols-4">
          <Stat label="Total Users" value={<AnimatedNumber value={stats.totalUsers} />} />
          <Stat label="Challenges" value={<AnimatedNumber value={stats.challenges} />} />
          <Stat label="Winners" value={<AnimatedNumber value={stats.winners} />} />
          <Stat label="Rewards Distributed" value={<AnimatedNumber value={stats.rewardsDistributed} prefix="$" useCompact />} />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-[#101011] px-5 py-6 text-center sm:px-4">
      <div className="font-mono text-2xl font-semibold text-text sm:text-[2rem]">{value}</div>
      <div className="mt-1 text-[13px] text-text/55">{label}</div>
    </div>
  );
}
