import crypto from "node:crypto";
import { verifyMessage } from "viem";

export function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

export function isValidChain(chainId: unknown, expected: number) {
  const parsed = typeof chainId === "string" ? Number(chainId) : chainId;
  return Number.isInteger(parsed) && Number(parsed) === expected;
}

export function createNonce(bytes = 18) {
  return crypto.randomBytes(bytes).toString("hex");
}

export function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

export function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function hmac(secret: string, input: string) {
  return crypto.createHmac("sha256", secret).update(input).digest("base64url");
}

export function signToken(payload: Record<string, unknown>, secret: string) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = hmac(secret, `${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyToken<T extends Record<string, unknown>>(token: string, secret: string): T | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = hmac(secret, `${header}.${body}`);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    return JSON.parse(base64UrlDecode(body)) as T;
  } catch {
    return null;
  }
}

export function nowIso() {
  return new Date().toISOString();
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 86_400_000);
}

export function buildWalletLoginMessage(input: {
  address: string;
  nonce: string;
  chainId: number;
  origin: string;
}) {
  return [
    "Memebooq wants you to sign in with your wallet.",
    "",
    `Address: ${input.address}`,
    `Chain ID: ${input.chainId}`,
    `Nonce: ${input.nonce}`,
    `Origin: ${input.origin}`,
    "",
    "This request will not trigger a blockchain transaction.",
  ].join("\n");
}

export async function verifyWalletSignature(params: {
  address: string;
  message: string;
  signature: `0x${string}`;
}) {
  return verifyMessage({
    address: params.address as `0x${string}`,
    message: params.message,
    signature: params.signature,
  });
}

export function createPkcePair() {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function encodeState(payload: Record<string, unknown>, secret: string) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const sig = hmac(secret, body);
  return `${body}.${sig}`;
}

export function decodeState<T extends Record<string, unknown>>(state: string, secret: string): T | null {
  const [body, sig] = state.split(".");
  if (!body || !sig) return null;
  const expected = hmac(secret, body);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  try {
    return JSON.parse(base64UrlDecode(body)) as T;
  } catch {
    return null;
  }
}

export function parseTweetId(url: string) {
  const match = url.match(/(?:x\.com|twitter\.com)\/[^/]+\/status\/(\d+)/i);
  return match?.[1] ?? null;
}

export function parseXHandle(url: string) {
  try {
    const parsed = new URL(url);
    const [segment] = parsed.pathname.split("/").filter(Boolean);
    return segment?.replace(/^@/, "") ?? null;
  } catch {
    return null;
  }
}
