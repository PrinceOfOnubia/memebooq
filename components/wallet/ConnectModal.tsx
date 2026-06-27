"use client";

import { useState } from "react";
import { ShieldCheck, Wallet } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/components/providers/AuthProvider";

const wallets = [
  { id: "metamask", name: "MetaMask", tag: "Popular", emoji: "🦊" },
  { id: "binance", name: "Binance Web3 Wallet", tag: "BNB Chain", emoji: "🟡" },
  { id: "trust", name: "Trust Wallet", tag: "", emoji: "🛡️" },
  { id: "coinbase", name: "Coinbase Wallet", tag: "", emoji: "🔵" },
];

export function ConnectModal() {
  const { connectModalOpen, closeConnect, connectWallet, error, loading } = useAuth();
  const [pending, setPending] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handle(id: string) {
    setPending(id);
    setLocalError(null);
    try {
      await connectWallet(id);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setPending(null);
    }
  }

  return (
    <Modal open={connectModalOpen} onClose={closeConnect} title="Connect your wallet">
      <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
        Connect an injected EVM wallet to enter Shillcoins. New here? An account is created automatically. Your
        login is secured by a wallet signature, not a password.
      </p>

      {(localError || error) && (
        <div className="mb-4 rounded-2xl border border-red/25 bg-red/10 px-4 py-3 text-[13px] text-red">
          {localError ?? error}
        </div>
      )}

      <div className="space-y-2.5">
        {wallets.map((w) => (
          <button
            key={w.id}
            onClick={() => void handle(w.id)}
            disabled={!!pending || loading}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface/60 px-4 py-3.5 text-left transition-colors hover:border-border-strong hover:bg-surface-2 disabled:opacity-60"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-xl">
              {w.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-text">{w.name}</span>
              {w.tag && <span className="block text-[12px] text-faint">{w.tag}</span>}
            </span>
            {pending === w.id ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
            ) : (
              <span className="text-[12px] font-medium text-faint">Connect</span>
            )}
          </button>
        ))}
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] text-faint">
        <ShieldCheck size={14} className="text-green" />
        Non-custodial · we never hold your funds
      </p>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-faint">
        <Wallet size={14} className="text-gold-bright" />
        Supported network: BNB Chain
      </p>
    </Modal>
  );
}
