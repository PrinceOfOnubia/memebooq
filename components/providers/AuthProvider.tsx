"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ConnectModal } from "@/components/wallet/ConnectModal";
import { me } from "@/lib/mock";

interface AuthState {
  /** Whether a wallet is connected (user is in the authenticated app). */
  connected: boolean;
  /** Connected wallet address (mock). */
  address: string | null;
  connectModalOpen: boolean;
  openConnect: () => void;
  closeConnect: () => void;
  /** Simulate a successful wallet connection. */
  connect: (walletId: string) => void;
  disconnect: () => void;
}

const AuthCtx = createContext<AuthState | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  useEffect(() => {
    // Keep the landing page as the default entry point on every load.
    // Connection state stays in memory only, so refreshes always return to landing.
    setAddress(null);
  }, []);

  const openConnect = useCallback(() => setConnectModalOpen(true), []);
  const closeConnect = useCallback(() => setConnectModalOpen(false), []);

  const connect = useCallback((_walletId: string) => {
    // Mock connection — in a real app this resolves the wallet's address.
    const addr = me.wallet;
    setAddress(addr);
    setConnectModalOpen(false);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        connected: !!address,
        address,
        connectModalOpen,
        openConnect,
        closeConnect,
        connect,
        disconnect,
      }}
    >
      {children}
      <ConnectModal />
    </AuthCtx.Provider>
  );
}
