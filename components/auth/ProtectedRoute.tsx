"use client";

import { Lock, ShieldAlert, Wallet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";

export function ProtectedRoute({
  children,
  mode = "wallet",
}: {
  children: React.ReactNode;
  mode?: "wallet" | "admin";
}) {
  const { connected, isAdmin, openConnect, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
        <div className="rounded-2xl border border-border bg-surface/50 px-6 py-5 text-sm text-muted">
          Loading your account…
        </div>
      </div>
    );
  }

  if (!connected && mode === "wallet") {
    return (
      <Gate
        icon={<Wallet size={22} className="text-gold-bright" />}
        title="Connect your wallet"
        body="This page requires a connected wallet. Sign in to continue."
        action={<Button onClick={openConnect}>Connect wallet</Button>}
      />
    );
  }

  if (mode === "admin" && (!connected || !isAdmin)) {
    return (
      <Gate
        icon={<ShieldAlert size={22} className="text-red" />}
        title="Admin access required"
        body={
          connected
            ? `The connected wallet${user?.wallet ? ` (${user.wallet})` : ""} does not have admin access.`
            : "Connect an admin wallet to continue."
        }
        action={<Button onClick={openConnect}>{connected ? "Switch wallet" : "Connect wallet"}</Button>}
      />
    );
  }

  return <>{children}</>;
}

function Gate({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center px-4">
      <div className="w-full rounded-[24px] border border-border bg-surface/50 p-6 text-center shadow-[0_18px_48px_-28px_rgba(0,0,0,0.7)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-bg-2">
          {icon}
        </div>
        <h1 className="mt-4 font-display text-2xl font-bold">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
        <div className="mt-5 flex justify-center">{action}</div>
        <p className="mt-4 text-[12px] text-faint">
          <Lock size={12} className="mr-1 inline-block" />
          Protected route
        </p>
      </div>
    </div>
  );
}
