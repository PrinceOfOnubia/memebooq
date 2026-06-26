"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Pencil, Settings2, Trophy, Wallet, Check, Link2, MessageSquareShare, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Modal } from "@/components/ui/Modal";
import { ChallengeCard } from "@/components/challenge/ChallengeCard";
import { SubmissionRow } from "./SubmissionRow";
import { challenges } from "@/lib/mock";
import { cn, shortAddr } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";

const tabs = ["Submissions", "Joined", "Created"] as const;

export function UserProfileClient() {
  const { user, loading, updateProfile, connectX, disconnectX: unlinkX, disconnect } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Submissions");
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editOpen || !user) return;
    setName(user.name);
    setBio(user.bio);
    setAvatar(user.avatar);
    setEditError(null);
    setEditSuccess(null);
  }, [user, editOpen]);

  const joined = useMemo(() => {
    const slugs = user?.joinedChallenges ?? [];
    return slugs.map((entry) => challenges.find((c) => c.slug === entry.slug)).filter(Boolean);
  }, [user?.joinedChallenges]);

  const created = useMemo(() => {
    const slugs = user?.createdChallenges ?? [];
    return slugs.map((entry) => challenges.find((c) => c.slug === entry.slug)).filter(Boolean);
  }, [user?.createdChallenges]);

  const submissionRows = useMemo(() => {
    if (!user) return [];
    const userSubmissions = user?.submissions ?? [];
    return userSubmissions.map((submission) => {
      const challenge = challenges.find((c) => c.slug === submission.challengeSlug);
      return {
        ...submission,
        challengeId: submission.challengeSlug,
        cover: challenge?.cover ?? challenges[0].cover,
        user: {
          id: user.id,
          type: "user" as const,
          name: user.name,
          handle: user.handle,
          avatar: user.avatar,
          verified: user.xConnected,
        },
      };
    });
  }, [user?.submissions]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center rounded-3xl border border-border bg-surface/40 px-6 py-10 text-muted">
        Loading profile…
      </div>
    );
  }

  if (!user) return null;
  const currentUser = user;

  async function copy() {
    await navigator.clipboard?.writeText(currentUser.wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function saveProfile() {
    setSaving(true);
    setEditError(null);
    try {
      const updated = await updateProfile({ name, bio, avatar });
      if (!updated) {
        throw new Error("Unable to update profile right now.");
      }
      setEditSuccess("Profile updated successfully.");
      setEditOpen(false);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Unable to update profile right now.");
    } finally {
      setSaving(false);
    }
  }

  function changeAvatar(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setEditError("Please choose a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setEditError("Avatar must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result ?? ""));
      setEditError(null);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="-mt-6">
      <div className="relative -mx-4 h-44 overflow-hidden sm:-mx-6 sm:h-56">
        <img src={currentUser.banner} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
      </div>

      <div className="relative z-10 -mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4">
          <span className="shrink-0 rounded-full bg-bg p-1.5">
            <Avatar src={currentUser.avatar} alt={currentUser.name} size={100} verified={currentUser.xConnected} />
          </span>
          <div className="min-w-0 pb-1">
            <h1 className="flex items-center gap-1.5 font-display text-2xl font-bold text-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-3xl">
              <span className="truncate">{currentUser.name}</span>
              {currentUser.xConnected && <VerifiedBadge size={20} className="shrink-0" />}
            </h1>
            <p className="text-sm text-faint">@{currentUser.handle}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button onClick={copy} className="flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-mono transition-colors hover:border-border-strong">
            <Wallet size={15} className="text-gold-bright" />
            {shortAddr(currentUser.wallet)}
            {copied ? <Check size={14} className="text-green" /> : <Copy size={14} className="text-faint" />}
          </button>
          <Button variant="outline" type="button" onClick={() => { setName(currentUser.name); setBio(currentUser.bio); setAvatar(currentUser.avatar); setEditOpen(true); }}>
            <Pencil size={15} /> Edit profile
          </Button>
          <Button variant="glass" type="button" onClick={() => void connectX()}>
            <MessageSquareShare size={15} /> {user.xConnected ? "Reconnect X" : "Connect X"}
          </Button>
        </div>
      </div>

      <p className="mt-4 max-w-xl text-[15px] text-muted">{currentUser.bio}</p>
      {currentUser.xConnected && (
        <Badge tone="blue" className="mt-3">
          𝕏 connected · @{currentUser.xHandle ?? currentUser.handle}
        </Badge>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Wins" value={<AnimatedNumber value={currentUser.wins} />} icon={<Trophy size={16} className="text-gold-bright" />} />
        <StatCard label="Rewards earned" value={<AnimatedNumber value={currentUser.earned} prefix="$" useCompact />} accent />
        <StatCard label="Challenges joined" value={<AnimatedNumber value={currentUser.joined} />} />
        <StatCard label="Created" value={<AnimatedNumber value={currentUser.created} />} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={() => void unlinkX()} disabled={!currentUser.xConnected}>
          <Link2 size={14} /> Disconnect X
        </Button>
        <Button variant="ghost" size="sm" type="button" onClick={() => void disconnect()}>
          <LogOut size={14} /> Disconnect wallet
        </Button>
        <a
          href="/settings"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[12px] border border-border-strong px-4 text-[13px] text-muted transition-colors hover:border-gold/60 hover:text-gold-bright"
        >
          <Settings2 size={14} /> Settings
        </a>
      </div>

      <div className="no-scrollbar mt-8 flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative px-4 py-3 text-sm font-medium transition-colors",
              tab === t ? "text-text" : "text-faint hover:text-muted",
            )}
          >
            {t}
            {tab === t && <motion.span layoutId="userprofiletab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gold" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-6">
          {tab === "Submissions" && (
            <div className="grid gap-2.5">
              {submissionRows.length ? (
                submissionRows.map((s) => <SubmissionRow key={s.id} s={s as any} />)
              ) : (
                <EmptyState title="No submissions yet" body="Your verified submissions will appear here." />
              )}
            </div>
          )}
          {tab === "Joined" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {joined.length ? (
                joined.map((c, i) => c ? <ChallengeCard key={c.id} c={c} index={i} /> : null)
              ) : (
                <EmptyState title="No joined challenges yet" body="Join a challenge to start building your activity history." />
              )}
            </div>
          )}
          {tab === "Created" && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {created.length ? (
                created.map((c, i) => c ? <ChallengeCard key={c.id} c={c} index={i} /> : null)
              ) : (
                <EmptyState title="No created challenges yet" body="Launch your first challenge from the Create page." />
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <div className="space-y-5">
          {editError && <div className="rounded-2xl border border-red/20 bg-red/10 px-4 py-3 text-[13px] text-red">{editError}</div>}
          {editSuccess && <div className="rounded-2xl border border-green/20 bg-green/10 px-4 py-3 text-[13px] text-green">{editSuccess}</div>}
          <div className="flex items-center gap-4">
            <Avatar src={avatar || currentUser.avatar} alt={currentUser.name} size={64} verified={currentUser.xConnected} />
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                changeAvatar(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => avatarInputRef.current?.click()}
            >
              Change avatar
            </Button>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-muted">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border border-border bg-surface px-3.5 text-sm outline-none focus:border-gold/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-muted">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-surface p-3.5 text-sm outline-none focus:border-gold/50"
            />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface px-3.5 py-3">
            <span className="flex items-center gap-2 text-[13px] text-muted">
              <Wallet size={15} className="text-gold-bright" /> Wallet
            </span>
            <span className="font-mono text-[13px] text-green">{shortAddr(currentUser.wallet)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-surface px-3.5 py-3">
            <span className="text-[13px] text-muted">𝕏 account</span>
            <span className="font-mono text-[13px] text-blue">
              {currentUser.xConnected ? `@${currentUser.xHandle ?? currentUser.handle}` : "Not connected"}
            </span>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="ghost" className="flex-1" type="button" onClick={() => { setName(currentUser.name); setBio(currentUser.bio); setAvatar(currentUser.avatar); setEditOpen(false); }}>
              Cancel
            </Button>
            <Button className="flex-1" type="button" onClick={() => void saveProfile()} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/30 p-6 text-center">
      <p className="font-semibold text-text">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: React.ReactNode; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/50 p-4">
      <div className="flex items-center gap-1.5 text-[12px] text-faint">{icon}{label}</div>
      <p className={cn("mt-1 font-mono text-2xl font-bold", accent ? "text-green" : "text-text")}>{value}</p>
    </div>
  );
}
