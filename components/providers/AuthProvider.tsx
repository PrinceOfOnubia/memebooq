"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ConnectModal } from "@/components/wallet/ConnectModal";
import {
  ApiError,
  SESSION_STORAGE_KEY,
  disconnectX,
  fetchMe,
  getApiBaseUrl,
  joinChallenge,
  loginWithWallet,
  logout,
  refreshSession,
  requestNonce,
  startXAuth,
  submitChallenge,
  updateMe,
  verifyXAuthor,
  createChallenge,
  fetchAdminSummary,
} from "@/lib/api-client";
import type { UserProfile } from "@/lib/types";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<unknown>;
    };
  }
}

interface AuthState {
  connected: boolean;
  address: string | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  connectModalOpen: boolean;
  openConnect: () => void;
  closeConnect: () => void;
  connectWallet: (walletId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (patch: Partial<Pick<UserProfile, "name" | "handle" | "avatar" | "bio" | "notificationPreferences">>) => Promise<UserProfile | null>;
  connectX: () => Promise<void>;
  disconnectX: () => Promise<void>;
  joinChallenge: (slug: string) => Promise<UserProfile | null>;
  createChallenge: (payload: Record<string, unknown>) => Promise<UserProfile | null>;
  submitChallenge: (slug: string, payload: Record<string, unknown>) => Promise<UserProfile | null>;
  verifyXAuthor: (payload: Record<string, unknown>) => Promise<{ verified: boolean; reason?: string | undefined }>;
  isAdmin: boolean;
  apiBaseUrl: string;
  sessionToken: string | null;
  adminSummary: () => Promise<Record<string, unknown> | null>;
}

const AuthCtx = createContext<AuthState | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const expectedChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "56");
const expectedChainHex = `0x${expectedChainId.toString(16)}`;
const bnbChainConfig = {
  chainId: expectedChainHex,
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

function isSwitchError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && Number((error as { code?: number }).code) === 4902;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  const apiBaseUrl = getApiBaseUrl();

  const loadSession = useCallback(async () => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(SESSION_STORAGE_KEY) : null;
    if (!stored) {
      setUser(null);
      setAddress(null);
      setSessionToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetchMe(stored);
      setUser(response.me);
      setAddress(response.me.wallet);
      setSessionToken(stored);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        try {
          const refreshed = await refreshSession(stored);
          window.localStorage.setItem(SESSION_STORAGE_KEY, refreshed.token);
          setUser(refreshed.user);
          setAddress(refreshed.user.wallet);
          setSessionToken(refreshed.token);
          setError(null);
        } catch {
          window.localStorage.removeItem(SESSION_STORAGE_KEY);
          setUser(null);
          setAddress(null);
          setSessionToken(null);
        }
      } else {
        setError(err instanceof Error ? err.message : "Unable to load session");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const openConnect = useCallback(() => setConnectModalOpen(true), []);
  const closeConnect = useCallback(() => setConnectModalOpen(false), []);

  const connectWallet = useCallback(async (walletId: string) => {
    setError(null);
    if (!window.ethereum) {
      throw new Error("No wallet provider detected. Please install a supported wallet.");
    }

    const switchToBnb = async () => {
      try {
        await window.ethereum!.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: expectedChainHex }],
        });
      } catch (switchError) {
        if (!isSwitchError(switchError)) throw switchError;
        await window.ethereum!.request({
          method: "wallet_addEthereumChain",
          params: [bnbChainConfig],
        });
        await window.ethereum!.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: expectedChainHex }],
        });
      }
    };

    const chainHex = await window.ethereum.request({ method: "eth_chainId" });
    const activeChainId = typeof chainHex === "string" ? Number.parseInt(chainHex, 16) : Number(chainHex);
    if (activeChainId !== expectedChainId) {
      await switchToBnb();
    }

    const postSwitchHex = await window.ethereum.request({ method: "eth_chainId" });
    const postSwitchChainId = typeof postSwitchHex === "string" ? Number.parseInt(postSwitchHex, 16) : Number(postSwitchHex);
    if (postSwitchChainId !== expectedChainId) {
      throw new Error("Please switch to BNB Smart Chain to sign in.");
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const walletAddress = Array.isArray(accounts) ? String(accounts[0] ?? "") : "";
    if (!walletAddress) {
      throw new Error("Unable to read the connected wallet address.");
    }

    const nonceResponse = await requestNonce(walletAddress, walletId, expectedChainId);
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [nonceResponse.message, walletAddress],
    });

    const auth = await loginWithWallet({
      address: walletAddress,
      walletId,
      chainId: expectedChainId,
      nonce: nonceResponse.nonce,
      signature: String(signature),
    });

    window.localStorage.setItem(SESSION_STORAGE_KEY, auth.token);
    setUser(auth.user);
    setAddress(auth.user.wallet);
    setSessionToken(auth.token);
    setConnectModalOpen(false);
    setError(null);
  }, []);

  const disconnect = useCallback(async () => {
    const token = sessionToken ?? (typeof window !== "undefined" ? window.localStorage.getItem(SESSION_STORAGE_KEY) : null);
    if (token) {
      try {
        await logout(token);
      } catch {
        // Intentionally ignore logout failures so local state still clears.
      }
    }
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setUser(null);
    setAddress(null);
    setSessionToken(null);
  }, [sessionToken]);

  const refreshUser = useCallback(async () => {
    if (!sessionToken) return;
    const response = await fetchMe(sessionToken);
    setUser(response.me);
    setAddress(response.me.wallet);
  }, [sessionToken]);

  const updateProfile = useCallback(async (patch: Partial<Pick<UserProfile, "name" | "handle" | "avatar" | "bio" | "notificationPreferences">>) => {
    if (!sessionToken) return null;
    const response = await updateMe(sessionToken, {
      displayName: patch.name,
      handle: patch.handle,
      avatar: patch.avatar,
      bio: patch.bio,
      notificationPreferences: patch.notificationPreferences,
    });
    setUser(response.me);
    setAddress(response.me.wallet);
    return response.me;
  }, [sessionToken]);

  const connectX = useCallback(async () => {
    if (!sessionToken) throw new Error("Connect your wallet first.");
    const { authorizeUrl } = await startXAuth(sessionToken);
    window.location.href = authorizeUrl;
  }, [sessionToken]);

  const disconnectXAccount = useCallback(async () => {
    if (!sessionToken) return;
    const response = await disconnectX(sessionToken);
    setUser(response.user);
  }, [sessionToken]);

  const joinChallengeAction = useCallback(async (slug: string) => {
    if (!sessionToken) return null;
    const response = await joinChallenge(sessionToken, slug);
    setUser(response.me);
    setAddress(response.me.wallet);
    return response.me;
  }, [sessionToken]);

  const createChallengeAction = useCallback(async (payload: Record<string, unknown>) => {
    if (!sessionToken) return null;
    const response = await createChallenge(sessionToken, payload);
    setUser(response.me);
    setAddress(response.me.wallet);
    return response.me;
  }, [sessionToken]);

  const submitChallengeAction = useCallback(async (slug: string, payload: Record<string, unknown>) => {
    if (!sessionToken) return null;
    const response = await submitChallenge(sessionToken, slug, payload);
    setUser(response.me);
    setAddress(response.me.wallet);
    return response.me;
  }, [sessionToken]);

  const verifyXAuthorAction = useCallback(async (payload: Record<string, unknown>) => {
    if (!sessionToken) {
      return { verified: false, reason: "Connect your wallet first." };
    }
    return verifyXAuthor(sessionToken, payload);
  }, [sessionToken]);

  const adminSummary = useCallback(async () => {
    if (!sessionToken) return null;
    return fetchAdminSummary(sessionToken);
  }, [sessionToken]);

  const value = useMemo<AuthState>(
    () => ({
      connected: !!user,
      address,
      user,
      loading,
      error,
      connectModalOpen,
      openConnect,
      closeConnect,
      connectWallet,
      disconnect,
      refreshUser,
      updateProfile,
      connectX,
      disconnectX: disconnectXAccount,
      joinChallenge: joinChallengeAction,
      createChallenge: createChallengeAction,
      submitChallenge: submitChallengeAction,
      verifyXAuthor: verifyXAuthorAction,
      isAdmin: user?.role === "admin",
      apiBaseUrl,
      sessionToken,
      adminSummary,
    }),
    [
      address,
      apiBaseUrl,
      adminSummary,
      connectModalOpen,
      connectWallet,
      connectX,
      createChallengeAction,
      disconnect,
      disconnectXAccount,
      error,
      joinChallengeAction,
      loading,
      openConnect,
      closeConnect,
      refreshUser,
      sessionToken,
      submitChallengeAction,
      updateProfile,
      user,
      verifyXAuthorAction,
    ],
  );

  return (
    <AuthCtx.Provider value={value}>
      {children}
      <ConnectModal />
    </AuthCtx.Provider>
  );
}
