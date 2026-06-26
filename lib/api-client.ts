import type { Challenge, UserProfile } from "./types";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
export const SESSION_STORAGE_KEY = "memebooq.session.token";

type JsonObject = Record<string, unknown>;

async function parseResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok) {
    const message = contentType.includes("application/json")
      ? ((await res.json().catch(() => null)) as { error?: string } | null)?.error ?? res.statusText
      : await res.text();
    throw new ApiError(message || res.statusText, res.status);
  }
  if (res.status === 204) return undefined as T;
  if (contentType.includes("application/json")) return (await res.json()) as T;
  return (await res.text()) as T;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null,
): Promise<T> {
  if (!apiBase) throw new ApiError("API base URL is not configured", 500);
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  return parseResponse<T>(response);
}

export async function requestNonce(address: string, walletId: string, chainId: number) {
  return apiFetch<{ nonce: string; message: string; chainId: number; expiresAt: string }>(
    "/api/auth/nonce",
    {
      method: "POST",
      body: JSON.stringify({ address, walletId, chainId }),
    },
  );
}

export async function loginWithWallet(input: {
  address: string;
  walletId: string;
  chainId: number;
  nonce: string;
  signature: string;
}) {
  return apiFetch<{
    user: UserProfile;
    token: string;
    expiresAt: string;
    walletId: string;
  }>("/api/auth/wallet", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function refreshSession(token: string) {
  return apiFetch<{ user: UserProfile; token: string; expiresAt: string }>("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function fetchMe(token: string) {
  return apiFetch<{ me: UserProfile; session: { expiresAt: string } }>("/api/me", {}, token);
}

export async function updateMe(token: string, patch: JsonObject) {
  return apiFetch<{ me: UserProfile }>("/api/me", {
    method: "PATCH",
    body: JSON.stringify(patch),
  }, token);
}

export async function logout(token: string) {
  return apiFetch<{ ok: true }>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function startXAuth(token: string) {
  return apiFetch<{ authorizeUrl: string; callbackUrl: string }>("/api/auth/x/start", {
    method: "POST",
    body: JSON.stringify({}),
  }, token);
}

export async function disconnectX(token: string) {
  return apiFetch<{ ok: true; user: UserProfile }>("/api/auth/x/disconnect", {
    method: "POST",
    body: JSON.stringify({}),
  }, token);
}

export async function joinChallenge(token: string, slug: string) {
  return apiFetch<{ ok: true; me: UserProfile }>(`/api/challenges/${slug}/join`, {
    method: "POST",
    body: JSON.stringify({}),
  }, token);
}

export async function createChallenge(token: string, payload: JsonObject) {
  return apiFetch<{ ok: true; created: { slug: string; title: string; category: string; createdAt: string }; me: UserProfile }>(
    "/api/challenges",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function submitChallenge(token: string, slug: string, payload: JsonObject) {
  return apiFetch<{ ok: true; submission: JsonObject; me: UserProfile }>(`/api/challenges/${slug}/submissions`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export async function verifyXAuthor(token: string, payload: JsonObject) {
  return apiFetch<{ verified: boolean; reason?: string; authorHandle?: string | null }>(
    "/api/submissions/verify-x-author",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function fetchUserByHandle(handle: string) {
  return apiFetch<{ user: UserProfile }>(`/api/users/${handle}`);
}

export async function fetchAdminSummary(token: string) {
  return apiFetch<JsonObject>("/api/admin/summary", {}, token);
}

export function getApiBaseUrl() {
  return apiBase;
}

export async function fetchJson<T>(path: string, token?: string | null) {
  return apiFetch<T>(path, {}, token);
}

export type { UserProfile, Challenge };
