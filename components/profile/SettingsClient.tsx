"use client";

import { useEffect, useState } from "react";
import { Check, Link2, LogOut, MessageSquareShare, Wallet } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import { shortAddr } from "@/lib/utils";

export function SettingsClient() {
  const { user, updateProfile, connectX, disconnectX, disconnect } = useAuth();
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(true);
  const [xMentions, setXMentions] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setHandle(user.handle);
    setBio(user.bio);
    setAvatar(user.avatar);
    setEmail(user.notificationPreferences?.email ?? true);
    setPush(user.notificationPreferences?.push ?? true);
    setXMentions(user.notificationPreferences?.xMentions ?? true);
  }, [user]);

  if (!user) return null;

  async function save() {
    setSaving(true);
    try {
      await updateProfile({
        name,
        handle,
        bio,
        avatar,
        notificationPreferences: { email, push, xMentions },
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="rounded-[24px] border border-border bg-surface/50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar src={user.avatar} alt={user.name} size={72} verified={user.xConnected} />
            <div>
              <h1 className="font-display text-3xl font-bold">Settings</h1>
              <p className="text-sm text-muted">{user.name} · {shortAddr(user.wallet)}</p>
            </div>
          </div>
          <Badge tone={user.role === "admin" ? "gold" : "neutral"}>
            {user.role === "admin" ? "Admin" : "Member"}
          </Badge>
        </div>
      </header>

      <section className="grid gap-5 rounded-[24px] border border-border bg-surface/50 p-6">
        <h2 className="font-display text-xl font-semibold">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display name" value={name} onChange={setName} />
          <Field label="Username" value={handle} onChange={setHandle} />
        </div>
        <Field label="Avatar URL" value={avatar} onChange={setAvatar} />
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-muted">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-bg-2 px-3.5 py-3 text-sm outline-none focus:border-gold/50"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </section>

      <section className="grid gap-5 rounded-[24px] border border-border bg-surface/50 p-6">
        <h2 className="font-display text-xl font-semibold">Connections</h2>
        <div className="rounded-2xl border border-border bg-bg-2/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-gold-bright">
                <Wallet size={18} />
              </div>
              <div>
                <p className="font-medium text-text">Wallet</p>
                <p className="text-sm text-muted">{shortAddr(user.wallet)}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => void disconnect()}>
              <LogOut size={15} /> Disconnect
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-bg-2/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue/12 text-blue">
                <MessageSquareShare size={18} />
              </div>
              <div>
                <p className="font-medium text-text">X account</p>
                <p className="text-sm text-muted">
                  {user.xConnected ? `@${user.xHandle ?? user.handle}` : "Not connected"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="glass" onClick={() => void connectX()}>
                {user.xConnected ? "Reconnect" : "Connect"}
              </Button>
              <Button variant="ghost" onClick={() => void disconnectX()} disabled={!user.xConnected}>
                <Link2 size={15} /> Disconnect
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 rounded-[24px] border border-border bg-surface/50 p-6">
        <h2 className="font-display text-xl font-semibold">Notifications</h2>
        <Toggle label="Email" checked={email} onChange={setEmail} />
        <Toggle label="Push" checked={push} onChange={setPush} />
        <Toggle label="X mentions" checked={xMentions} onChange={setXMentions} />
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-muted">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-border bg-bg-2 px-3.5 text-sm outline-none focus:border-gold/50"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-border bg-bg-2/70 px-4 py-3">
      <span className="text-sm font-medium text-text">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-gold" : "bg-surface-2"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </label>
  );
}
