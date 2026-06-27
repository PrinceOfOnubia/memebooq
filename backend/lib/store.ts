import crypto from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { addDays, addMinutes, nowIso } from "./auth.js";

export type Role = "user" | "admin";

export interface ChallengeRef {
  slug: string;
  title: string;
  category?: string;
  status?: string;
  addedAt: string;
}

export interface SubmissionRecord {
  id: string;
  challengeSlug: string;
  challengeTitle: string;
  link: string;
  type: string;
  status: string;
  submittedAt: string;
  reward?: number;
  authorVerified?: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  xMentions: boolean;
}

export interface UserRecord {
  id: string;
  walletAddress: string;
  displayName: string;
  handle: string;
  avatar: string;
  banner: string;
  bio: string;
  role: Role;
  xHandle: string | null;
  xUserId: string | null;
  xConnected: boolean;
  joinedChallenges: ChallengeRef[];
  createdChallenges: ChallengeRef[];
  submissions: SubmissionRecord[];
  wins: number;
  rewardsEarned: number;
  notificationPreferences: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

interface SessionRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  lastSeenAt: string;
}

interface NonceRecord {
  address: string;
  nonce: string;
  walletId: string;
  chainId: number;
  expiresAt: string;
  createdAt: string;
}

interface StoreFile {
  users: UserRecord[];
  sessions: SessionRecord[];
  nonces: NonceRecord[];
}

export interface LoginUser extends UserRecord {
  sessionToken: string;
  sessionExpiresAt: string;
}

const fallbackAvatar = () => "/avatar-default.svg";
const fallbackBanner = (seed: string) =>
  `https://images.unsplash.com/photo-1614851099511-773084f6911d?auto=format&fit=crop&w=1400&q=80&sig=${seed}`;

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  xMentions: true,
};

function handleFromAddress(address: string) {
  return `user${address.slice(-6).toLowerCase()}`;
}

function displayNameFromAddress(address: string) {
  return `Shillcoins ${address.slice(2, 6).toUpperCase()}`;
}

function normalizeUserAvatar(avatar: string) {
  if (
    avatar === "/logo-mark.png" ||
    avatar === "/logo-full.png" ||
    avatar === "/icon.png" ||
    avatar === "/avatar-default.svg"
  ) {
    return "/avatar-default.svg";
  }
  return avatar;
}

function blankStore(): StoreFile {
  return { users: [], sessions: [], nonces: [] };
}

export class AccountStore {
  private filePath: string;
  private data: StoreFile | null = null;

  constructor(rootDir: string) {
    this.filePath = path.join(rootDir, "data", "accounts.json");
  }

  async init() {
    if (this.data) return;
    await mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      const raw = await readFile(this.filePath, "utf8");
      this.data = JSON.parse(raw) as StoreFile;
      this.data.users = this.data.users.map((user) => ({
        ...user,
        avatar: normalizeUserAvatar(user.avatar),
      }));
      await this.save();
    } catch {
      this.data = blankStore();
      await this.save();
    }
  }

  private async ensure() {
    if (!this.data) await this.init();
    return this.data!;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  }

  private async save() {
    const data = await this.ensure();
    const tempPath = `${this.filePath}.${crypto.randomBytes(4).toString("hex")}.tmp`;
    await writeFile(tempPath, JSON.stringify(data, null, 2), "utf8");
    await rename(tempPath, this.filePath);
  }

  private seedUser(address: string): UserRecord {
    const now = nowIso();
    const adminWallet = normalizeEnv(process.env.ADMIN_WALLET ?? process.env.ADMIN_WALLET_ADDRESS);
    const normalized = address.toLowerCase();
    const role: Role = adminWallet && adminWallet === normalized ? "admin" : "user";
    return {
      id: crypto.randomUUID(),
      walletAddress: address,
      displayName: displayNameFromAddress(address),
      handle: handleFromAddress(address),
      avatar: fallbackAvatar(),
      banner: fallbackBanner(address),
      bio: "Meme alchemist • DeFi degen • turning timelines into treasure.",
      role,
      xHandle: null,
      xUserId: null,
      xConnected: false,
      joinedChallenges: [],
      createdChallenges: [],
      submissions: [],
      wins: 0,
      rewardsEarned: 0,
      notificationPreferences: { ...defaultPreferences },
      createdAt: now,
      updatedAt: now,
    };
  }

  private touchUser(user: UserRecord) {
    user.updatedAt = nowIso();
    return user;
  }

  private publicUser(user: UserRecord) {
    return this.clone({
      id: user.id,
      name: user.displayName,
      handle: user.handle,
      avatar: normalizeUserAvatar(user.avatar),
      banner: user.banner,
      wallet: user.walletAddress,
      bio: user.bio,
      xConnected: user.xConnected,
      xHandle: user.xHandle,
      xUserId: user.xUserId,
      joined: user.joinedChallenges.length,
      created: user.createdChallenges.length,
      wins: user.wins,
      earned: user.rewardsEarned,
      role: user.role,
      joinedChallenges: user.joinedChallenges,
      createdChallenges: user.createdChallenges,
      submissions: user.submissions,
      notificationPreferences: user.notificationPreferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async getUsers() {
    const data = await this.ensure();
    return data.users;
  }

  async findUserByWallet(address: string) {
    const data = await this.ensure();
    const normalized = address.toLowerCase();
    return data.users.find((user) => user.walletAddress.toLowerCase() === normalized) ?? null;
  }

  async findUserById(id: string) {
    const data = await this.ensure();
    return data.users.find((user) => user.id === id) ?? null;
  }

  async findUserByHandle(handle: string) {
    const data = await this.ensure();
    const normalized = handle.toLowerCase();
    return data.users.find((user) => user.handle.toLowerCase() === normalized) ?? null;
  }

  async upsertUserFromWallet(address: string) {
    const data = await this.ensure();
    let user = data.users.find((entry) => entry.walletAddress.toLowerCase() === address.toLowerCase());
    if (!user) {
      user = this.seedUser(address);
      data.users.push(user);
      await this.save();
    }
    return user;
  }

  async createSession(userId: string, ttlDays = 30) {
    const data = await this.ensure();
    const token = crypto.randomBytes(32).toString("hex");
    const now = new Date();
    const record: SessionRecord = {
      id: crypto.randomUUID(),
      userId,
      token,
      createdAt: nowIso(),
      lastSeenAt: nowIso(),
      expiresAt: addDays(now, ttlDays).toISOString(),
    };
    data.sessions.push(record);
    await this.save();
    return record;
  }

  async getSession(token: string) {
    const data = await this.ensure();
    return data.sessions.find((session) => session.token === token) ?? null;
  }

  async refreshSession(token: string) {
    const data = await this.ensure();
    const session = data.sessions.find((entry) => entry.token === token);
    if (!session) return null;
    session.expiresAt = addDays(new Date(), 30).toISOString();
    session.lastSeenAt = nowIso();
    await this.save();
    return session;
  }

  async revokeSession(token: string) {
    const data = await this.ensure();
    const next = data.sessions.filter((session) => session.token !== token);
    const removed = next.length !== data.sessions.length;
    data.sessions = next;
    if (removed) await this.save();
    return removed;
  }

  async createNonce(address: string, walletId: string, chainId: number) {
    const data = await this.ensure();
    const nonce = crypto.randomBytes(16).toString("hex");
    const record: NonceRecord = {
      address: address.toLowerCase(),
      nonce,
      walletId,
      chainId,
      createdAt: nowIso(),
      expiresAt: addMinutes(new Date(), 10).toISOString(),
    };
    data.nonces = data.nonces.filter((entry) => entry.address !== record.address);
    data.nonces.push(record);
    await this.save();
    return record;
  }

  async consumeNonce(address: string, nonce: string) {
    const data = await this.ensure();
    const normalized = address.toLowerCase();
    const idx = data.nonces.findIndex((entry) => entry.address === normalized && entry.nonce === nonce);
    if (idx === -1) return null;
    const record = data.nonces[idx];
    data.nonces.splice(idx, 1);
    await this.save();
    return record;
  }

  async patchMe(userId: string, patch: Partial<Pick<UserRecord, "displayName" | "handle" | "avatar" | "bio" | "notificationPreferences">>) {
    const data = await this.ensure();
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return null;
    if (typeof patch.displayName === "string" && patch.displayName.trim()) user.displayName = patch.displayName.trim();
    if (typeof patch.handle === "string" && patch.handle.trim()) user.handle = patch.handle.trim().replace(/^@/, "");
    if (typeof patch.avatar === "string" && patch.avatar.trim()) user.avatar = normalizeUserAvatar(patch.avatar.trim());
    if (typeof patch.bio === "string") user.bio = patch.bio.trim();
    if (patch.notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...patch.notificationPreferences,
      };
    }
    this.touchUser(user);
    await this.save();
    return user;
  }

  async linkXAccount(userId: string, input: { handle: string; userId: string; accessToken?: string; refreshToken?: string }) {
    const data = await this.ensure();
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return null;
    user.xHandle = input.handle.replace(/^@/, "");
    user.xUserId = input.userId;
    user.xConnected = true;
    this.touchUser(user);
    await this.save();
    return user;
  }

  async disconnectX(userId: string) {
    const data = await this.ensure();
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return null;
    user.xHandle = null;
    user.xUserId = null;
    user.xConnected = false;
    this.touchUser(user);
    await this.save();
    return user;
  }

  async appendJoinedChallenge(userId: string, challenge: ChallengeRef) {
    const data = await this.ensure();
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return null;
    if (!user.joinedChallenges.some((entry) => entry.slug === challenge.slug)) {
      user.joinedChallenges.push(challenge);
      this.touchUser(user);
      await this.save();
    }
    return user;
  }

  async appendCreatedChallenge(userId: string, challenge: ChallengeRef) {
    const data = await this.ensure();
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return null;
    if (!user.createdChallenges.some((entry) => entry.slug === challenge.slug)) {
      user.createdChallenges.push(challenge);
      this.touchUser(user);
      await this.save();
    }
    return user;
  }

  async appendSubmission(userId: string, submission: SubmissionRecord) {
    const data = await this.ensure();
    const user = data.users.find((entry) => entry.id === userId);
    if (!user) return null;
    user.submissions.unshift(submission);
    this.touchUser(user);
    await this.save();
    return user;
  }

  async getMe(token: string) {
    const session = await this.getSession(token);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      await this.revokeSession(token);
      return null;
    }
    const user = await this.findUserById(session.userId);
    if (!user) return null;
    session.lastSeenAt = nowIso();
    await this.save();
    return { user, session };
  }

  toPublic(user: UserRecord) {
    return this.publicUser(user);
  }
}

function normalizeEnv(value: string | undefined) {
  return value?.trim().toLowerCase() || "";
}

export function createAccountStore(rootDir: string) {
  return new AccountStore(rootDir);
}
