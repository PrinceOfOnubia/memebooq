import http from "node:http";
import crypto from "node:crypto";
import { URL } from "node:url";
import {
  challenges,
  getChallenge,
  getProject,
  leaderboard,
  notifications,
  platformStats,
  projects,
  submissions,
} from "./lib/mock.js";
import {
  buildWalletLoginMessage,
  createPkcePair,
  createNonce,
  decodeState,
  encodeState,
  isValidChain,
  normalizeAddress,
  nowIso,
  signToken,
  verifyToken,
  verifyWalletSignature,
  parseTweetId,
  parseXHandle,
} from "./lib/auth.js";
import { createAccountStore, type ChallengeRef, type LoginUser, type SubmissionRecord, type UserRecord } from "./lib/store.js";

type Body = Record<string, unknown>;

const ROOT_DIR = process.cwd();
const store = createAccountStore(ROOT_DIR);

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
const host = process.env.HOST ?? "127.0.0.1";
const clientOrigin = (process.env.CLIENT_ORIGIN ?? process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)[0] ?? "http://localhost:3000";
const originList = (process.env.CORS_ORIGIN ?? process.env.CLIENT_ORIGIN ?? clientOrigin)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const chainId = Number.parseInt(process.env.CHAIN_ID ?? "56", 10);
const jwtSecret = process.env.JWT_SECRET ?? "memebooq-dev-secret";
const sessionSecret = process.env.SESSION_SECRET ?? jwtSecret;
const xClientId = process.env.X_CLIENT_ID?.trim();
const xClientSecret = process.env.X_CLIENT_SECRET?.trim();
const xCallbackUrl = process.env.X_CALLBACK_URL?.trim() ?? `${clientOrigin.replace(/\/$/, "")}/api/auth/x/callback`;
const xBearerToken = process.env.X_BEARER_TOKEN?.trim();

const sitePayload = {
  brand: "Memebooq",
  contractAddress: "Coming Soon",
  stats: {
    totalUsers: 24_560,
    challenges: 1_248,
    winners: 320,
    rewardsDistributed: 1_450_000,
  },
};

function setCors(res: http.ServerResponse, origin?: string) {
  const allowOrigin = origin && (originList.includes(origin) || originList.includes("*")) ? origin : originList[0] ?? "*";
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
}

function json(res: http.ServerResponse, statusCode: number, payload: unknown, origin?: string) {
  setCors(res, origin);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function text(res: http.ServerResponse, statusCode: number, payload: string, origin?: string) {
  setCors(res, origin);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(payload);
}

function notFound(res: http.ServerResponse, origin?: string) {
  json(res, 404, { error: "Not found" }, origin);
}

async function readJson(req: http.IncomingMessage): Promise<Body> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Body) : {};
  } catch {
    return {};
  }
}

function getToken(req: http.IncomingMessage, body?: Body) {
  const header = req.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  const fromBody = body?.token;
  return typeof fromBody === "string" ? fromBody : null;
}

function publicUser(user: UserRecord) {
  return store.toPublic(user);
}

function getChallengeRef(slug: string, title: string, category?: string): ChallengeRef {
  return {
    slug,
    title,
    category,
    addedAt: nowIso(),
    status: "active",
  };
}

function mapToLoginUser(user: UserRecord, sessionToken: string, sessionExpiresAt: string): LoginUser {
  return {
    ...user,
    sessionToken,
    sessionExpiresAt,
  };
}

async function requireAuth(req: http.IncomingMessage, origin?: string) {
  const token = getToken(req);
  if (!token) return null;
  const payload = verifyToken<{ sid: string; sub: string; role?: string; exp?: number }>(token, jwtSecret);
  if (!payload) return null;

  const me = await store.getMe(payload.sid);
  if (!me) return null;
  return { token, user: me.user, session: me.session };
}

function requireAdmin(user: UserRecord | null) {
  return !!user && user.role === "admin";
}

function buildAuthToken(user: UserRecord, sessionToken: string, sessionExpiresAt: string) {
  const now = Math.floor(Date.now() / 1000);
  const exp = Math.floor(new Date(sessionExpiresAt).getTime() / 1000);
  return signToken(
    {
      sub: user.id,
      sid: sessionToken,
      addr: user.walletAddress,
      role: user.role,
      iat: now,
      exp,
    },
    jwtSecret,
  );
}

function addToken(responseUser: UserRecord, sessionToken: string, sessionExpiresAt: string) {
  const token = buildAuthToken(responseUser, sessionToken, sessionExpiresAt);
  return { user: publicUser(responseUser), token, expiresAt: sessionExpiresAt };
}

function getSlugFromPath(pathname: string) {
  return pathname.split("/").filter(Boolean).at(-1) ?? "";
}

function challengeSummary(slug: string) {
  const challenge = getChallenge(slug);
  if (!challenge) return null;
  return getChallengeRef(challenge.slug, challenge.title, challenge.category);
}

async function verifyXSubmissionLink(params: {
  user: UserRecord;
  link: string;
  challengeType: string;
}) {
  const normalizedType = params.challengeType.toLowerCase();
  if (!normalizedType.includes("x")) {
    return { verified: true, authorHandle: null as string | null };
  }

  const connectedHandle = params.user.xHandle?.replace(/^@/, "").toLowerCase();
  if (!connectedHandle) {
    return { verified: false, reason: "Connect your X account first.", authorHandle: null as string | null };
  }

  const linkHandle = parseXHandle(params.link)?.toLowerCase();
  const tweetId = parseTweetId(params.link);

  if (tweetId && xBearerToken) {
    try {
      const res = await fetch(`https://api.x.com/2/tweets/${tweetId}?expansions=author_id&user.fields=username`, {
        headers: { Authorization: `Bearer ${xBearerToken}` },
      });
      if (res.ok) {
        const data = await res.json() as {
          data?: { author_id?: string };
          includes?: { users?: Array<{ id: string; username: string }> };
        };
        const authorId = data.data?.author_id;
        const authorHandle = data.includes?.users?.find((user) => user.id === authorId)?.username?.toLowerCase() ?? null;
        if (authorHandle) {
          return {
            verified: authorHandle === connectedHandle,
            authorHandle,
            reason: authorHandle === connectedHandle ? undefined : "The X post author does not match the connected account.",
          };
        }
      }
    } catch {
      // fall through to URL-based comparison
    }
  }

  if (linkHandle) {
    return {
      verified: linkHandle === connectedHandle,
      authorHandle: linkHandle,
      reason: linkHandle === connectedHandle ? undefined : "The submitted link must come from your connected X account.",
    };
  }

  return {
    verified: false,
    authorHandle: null as string | null,
    reason: "Unable to verify the X author from the submitted link.",
  };
}

async function main() {
  await store.init();

  const server = http.createServer(async (req, res) => {
    const method = req.method ?? "GET";
    const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;

    if (method === "OPTIONS") {
      setCors(res, origin);
      res.statusCode = 204;
      res.end();
      return;
    }

    if (requestUrl.pathname === "/health") {
      json(
        res,
        200,
        {
          ok: true,
          service: "memebooq-backend",
          time: new Date().toISOString(),
          auth: {
            wallet: true,
            xAuth: !!(xClientId && xClientSecret),
            chainId,
          },
        },
        origin,
      );
      return;
    }

    if (requestUrl.pathname === "/api/public/site") {
      json(res, 200, sitePayload, origin);
      return;
    }

    if (requestUrl.pathname === "/api/challenges" && method === "GET") {
      json(res, 200, { challenges }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/challenges" && method === "POST") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      const body = await readJson(req);
      const title = typeof body.title === "string" ? body.title.trim() : "";
      const slug = typeof body.slug === "string" && body.slug.trim().length ? body.slug.trim() : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (!title || !slug) {
        json(res, 400, { error: "Challenge title is required" }, origin);
        return;
      }
      const created = await store.appendCreatedChallenge(auth.user.id, getChallengeRef(slug, title, typeof body.category === "string" ? body.category : undefined));
      if (!created) {
        json(res, 404, { error: "User not found" }, origin);
        return;
      }
      json(
        res,
        201,
        {
          ok: true,
          created: {
            slug,
            title,
            category: typeof body.category === "string" ? body.category : "Memes",
            createdAt: nowIso(),
          },
          me: publicUser(created),
        },
        origin,
      );
      return;
    }

    if (requestUrl.pathname.startsWith("/api/challenges/") && requestUrl.pathname.endsWith("/join") && method === "POST") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      const slug = requestUrl.pathname.split("/")[3] ?? "";
      const challenge = getChallenge(slug);
      if (!challenge) {
        notFound(res, origin);
        return;
      }
      const updated = await store.appendJoinedChallenge(auth.user.id, getChallengeRef(challenge.slug, challenge.title, challenge.category));
      if (!updated) {
        json(res, 404, { error: "User not found" }, origin);
        return;
      }
      json(res, 200, { ok: true, me: publicUser(updated) }, origin);
      return;
    }

    if (requestUrl.pathname.startsWith("/api/challenges/") && requestUrl.pathname.endsWith("/submissions") && method === "POST") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      const slug = requestUrl.pathname.split("/")[3] ?? "";
      const challenge = getChallenge(slug);
      if (!challenge) {
        notFound(res, origin);
        return;
      }
      const body = await readJson(req);
      const type = typeof body.type === "string" ? body.type.trim() : ((challenge as { submissionType?: string }).submissionType ?? "X Post");
      const link = typeof body.link === "string" ? body.link.trim() : "";
      const uploadLink = `upload://${challenge.slug}/${crypto.randomUUID()}`;
      const submissionLink = type.toLowerCase().includes("image upload") ? uploadLink : link;
      if (!submissionLink) {
        json(res, 400, { error: "Submission link is required" }, origin);
        return;
      }
      const verification = await verifyXSubmissionLink({
        user: auth.user,
        link: submissionLink,
        challengeType: type,
      });
      if (!verification.verified) {
        json(res, 400, { error: verification.reason ?? "Submission could not be verified" }, origin);
        return;
      }

      const submission: SubmissionRecord = {
        id: crypto.randomUUID(),
        challengeSlug: challenge.slug,
        challengeTitle: challenge.title,
        link: submissionLink,
        type,
        status: "Pending Review",
        submittedAt: nowIso(),
        authorVerified: true,
      };
      const updated = await store.appendSubmission(auth.user.id, submission);
      if (!updated) {
        json(res, 404, { error: "User not found" }, origin);
        return;
      }
      json(res, 201, { ok: true, submission, me: publicUser(updated) }, origin);
      return;
    }

    if (requestUrl.pathname.startsWith("/api/challenges/") && method === "GET") {
      const slug = getSlugFromPath(requestUrl.pathname);
      const challenge = getChallenge(slug);
      if (!challenge) {
        notFound(res, origin);
        return;
      }
      json(res, 200, { challenge }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/submissions" && method === "GET") {
      json(res, 200, { submissions }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/submissions/verify-x-author" && method === "POST") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      const body = await readJson(req);
      const link = typeof body.link === "string" ? body.link.trim() : "";
      const type = typeof body.type === "string" ? body.type.trim() : "X Post";
      if (!link) {
        json(res, 400, { error: "Submission link is required" }, origin);
        return;
      }
      const verification = await verifyXSubmissionLink({
        user: auth.user,
        link,
        challengeType: type,
      });
      json(res, verification.verified ? 200 : 400, verification, origin);
      return;
    }

    if (requestUrl.pathname === "/api/leaderboard" && method === "GET") {
      json(res, 200, leaderboard, origin);
      return;
    }

    if (requestUrl.pathname === "/api/notifications" && method === "GET") {
      json(res, 200, { notifications }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/projects" && method === "GET") {
      json(res, 200, { projects }, origin);
      return;
    }

    if (requestUrl.pathname.startsWith("/api/projects/") && method === "GET") {
      const handle = getSlugFromPath(requestUrl.pathname);
      const project = getProject(handle);
      if (!project) {
        notFound(res, origin);
        return;
      }
      json(res, 200, { project }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/auth/nonce" && method === "POST") {
      const body = await readJson(req);
      const address = typeof body.address === "string" ? body.address.trim() : "";
      const walletId = typeof body.walletId === "string" ? body.walletId : "wallet";
      const requestedChain = typeof body.chainId === "number" ? body.chainId : Number(body.chainId ?? chainId);
      if (!address) {
        json(res, 400, { error: "Wallet address is required" }, origin);
        return;
      }
      if (!isValidChain(requestedChain, chainId)) {
        json(res, 400, { error: `Please switch to chain ${chainId}` }, origin);
        return;
      }
      const nonce = await store.createNonce(normalizeAddress(address), walletId, chainId);
      const message = buildWalletLoginMessage({
        address,
        nonce: nonce.nonce,
        chainId,
        origin: origin ?? clientOrigin,
      });
      json(res, 200, { nonce: nonce.nonce, message, chainId, expiresAt: nonce.expiresAt }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/auth/wallet" && method === "POST") {
      const body = await readJson(req);
      const address = typeof body.address === "string" ? body.address.trim() : "";
      const signature = typeof body.signature === "string" ? body.signature.trim() : "";
      const nonce = typeof body.nonce === "string" ? body.nonce.trim() : "";
      const requestedChain = typeof body.chainId === "number" ? body.chainId : Number(body.chainId ?? chainId);
      const walletId = typeof body.walletId === "string" ? body.walletId : "wallet";

      if (!address || !signature || !nonce) {
        json(res, 400, { error: "Address, signature, and nonce are required" }, origin);
        return;
      }
      if (!isValidChain(requestedChain, chainId)) {
        json(res, 400, { error: `Please switch to chain ${chainId}` }, origin);
        return;
      }

      const nonceRecord = await store.consumeNonce(normalizeAddress(address), nonce);
      if (!nonceRecord) {
        json(res, 400, { error: "Login nonce has expired. Please try again." }, origin);
        return;
      }

      const message = buildWalletLoginMessage({
        address,
        nonce,
        chainId,
        origin: origin ?? clientOrigin,
      });
      const ok = await verifyWalletSignature({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });
      if (!ok) {
        json(res, 400, { error: "Signature verification failed" }, origin);
        return;
      }

      const user = await store.upsertUserFromWallet(address);
      const session = await store.createSession(user.id);
      const token = buildAuthToken(user, session.token, session.expiresAt);
      const payload = addToken(user, session.token, session.expiresAt);
      json(
        res,
        200,
        {
          ...payload,
          token,
          walletId,
        },
        origin,
      );
      return;
    }

    if (requestUrl.pathname === "/api/auth/refresh" && method === "POST") {
      const token = getToken(req, await readJson(req));
      if (!token) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      const payload = verifyToken<{ sid: string }>(token, jwtSecret);
      if (!payload) {
        json(res, 401, { error: "Session expired" }, origin);
        return;
      }
      const auth = await store.getMe(payload.sid);
      if (!auth) {
        json(res, 401, { error: "Session expired" }, origin);
        return;
      }
      const refreshed = await store.refreshSession(payload.sid);
      if (!refreshed) {
        json(res, 401, { error: "Session expired" }, origin);
        return;
      }
      const refreshedToken = buildAuthToken(auth.user, refreshed.token, refreshed.expiresAt);
      json(res, 200, { user: publicUser(auth.user), token: refreshedToken, expiresAt: refreshed.expiresAt }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/auth/logout" && method === "POST") {
      const body = await readJson(req);
      const token = getToken(req, body);
      if (token) {
        const payload = verifyToken<{ sid: string }>(token, jwtSecret);
        await store.revokeSession(payload?.sid ?? token);
      }
      json(res, 200, { ok: true }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/auth/x/start" && method === "POST") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      if (!xClientId || !xClientSecret) {
        json(res, 400, { error: "X OAuth env vars are not configured" }, origin);
        return;
      }

      const { verifier, challenge } = createPkcePair();
      const state = encodeState(
        {
          userId: auth.user.id,
          verifier,
          returnTo: `${clientOrigin.replace(/\/$/, "")}/settings?x=connecting`,
        },
        sessionSecret,
      );

      const authorizeUrl = new URL("https://x.com/i/oauth2/authorize");
      authorizeUrl.searchParams.set("response_type", "code");
      authorizeUrl.searchParams.set("client_id", xClientId);
      authorizeUrl.searchParams.set("redirect_uri", xCallbackUrl);
      authorizeUrl.searchParams.set("scope", "users.read tweet.read offline.access");
      authorizeUrl.searchParams.set("state", state);
      authorizeUrl.searchParams.set("code_challenge", challenge);
      authorizeUrl.searchParams.set("code_challenge_method", "S256");

      json(res, 200, { authorizeUrl: authorizeUrl.toString(), callbackUrl: xCallbackUrl }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/auth/x/callback" && method === "GET") {
      const code = requestUrl.searchParams.get("code");
      const state = requestUrl.searchParams.get("state");
      if (!code || !state) {
        text(res, 400, "Missing X OAuth callback parameters", origin);
        return;
      }
      if (!xClientId || !xClientSecret) {
        text(res, 400, "X OAuth env vars are not configured", origin);
        return;
      }

      const statePayload = decodeState<{ userId: string; verifier: string; returnTo?: string }>(state, sessionSecret);
      if (!statePayload) {
        text(res, 400, "Invalid X OAuth state", origin);
        return;
      }

      try {
        const tokenRes = await fetch("https://api.x.com/2/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${xClientId}:${xClientSecret}`).toString("base64")}`,
          },
          body: new URLSearchParams({
            code,
            grant_type: "authorization_code",
            client_id: xClientId,
            redirect_uri: xCallbackUrl,
            code_verifier: statePayload.verifier,
          }),
        });

        if (!tokenRes.ok) {
          const body = await tokenRes.text();
          text(res, 400, `X token exchange failed: ${body}`, origin);
          return;
        }

        const tokenData = await tokenRes.json() as {
          access_token?: string;
          refresh_token?: string;
        };

        if (!tokenData.access_token) {
          text(res, 400, "X OAuth did not return an access token", origin);
          return;
        }

        const profileRes = await fetch("https://api.x.com/2/users/me?user.fields=username", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        if (!profileRes.ok) {
          const body = await profileRes.text();
          text(res, 400, `X profile lookup failed: ${body}`, origin);
          return;
        }

        const profileData = await profileRes.json() as {
          data?: { id: string; username: string };
        };
        const profile = profileData.data;
        if (!profile) {
          text(res, 400, "X profile payload missing", origin);
          return;
        }

        const user = await store.findUserById(statePayload.userId);
        if (!user) {
          text(res, 404, "User not found", origin);
          return;
        }
        await store.linkXAccount(user.id, {
          handle: profile.username,
          userId: profile.id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        });

        const destination = statePayload.returnTo ?? `${clientOrigin.replace(/\/$/, "")}/settings?x=connected`;
        res.statusCode = 302;
        res.setHeader("Location", destination);
        res.end();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        text(res, 400, `X OAuth failed: ${message}`, origin);
      }
      return;
    }

    if (requestUrl.pathname === "/api/auth/x/disconnect" && method === "POST") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      const user = await store.disconnectX(auth.user.id);
      if (!user) {
        json(res, 404, { error: "User not found" }, origin);
        return;
      }
      json(res, 200, { ok: true, user: publicUser(user) }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/me" && method === "GET") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      json(res, 200, { me: publicUser(auth.user), session: { expiresAt: auth.session.expiresAt } }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/me" && method === "PATCH") {
      const auth = await requireAuth(req, origin);
      if (!auth) {
        json(res, 401, { error: "Authentication required" }, origin);
        return;
      }
      const body = await readJson(req);
      const updated = await store.patchMe(auth.user.id, {
        displayName: typeof body.displayName === "string" ? body.displayName : undefined,
        handle: typeof body.handle === "string" ? body.handle : undefined,
        avatar: typeof body.avatar === "string" ? body.avatar : undefined,
        bio: typeof body.bio === "string" ? body.bio : undefined,
        notificationPreferences:
          body.notificationPreferences && typeof body.notificationPreferences === "object"
            ? {
                email: typeof (body.notificationPreferences as Body).email === "boolean" ? (body.notificationPreferences as Body).email as boolean : auth.user.notificationPreferences.email,
                push: typeof (body.notificationPreferences as Body).push === "boolean" ? (body.notificationPreferences as Body).push as boolean : auth.user.notificationPreferences.push,
                xMentions: typeof (body.notificationPreferences as Body).xMentions === "boolean" ? (body.notificationPreferences as Body).xMentions as boolean : auth.user.notificationPreferences.xMentions,
              }
            : undefined,
      });
      if (!updated) {
        json(res, 404, { error: "User not found" }, origin);
        return;
      }
      json(res, 200, { me: publicUser(updated) }, origin);
      return;
    }

    if (requestUrl.pathname.startsWith("/api/users/") && method === "GET") {
      const handle = getSlugFromPath(requestUrl.pathname);
      const user = (await store.findUserByHandle(handle)) ?? (await store.findUserByWallet(handle));
      if (!user) {
        notFound(res, origin);
        return;
      }
      json(res, 200, { user: publicUser(user) }, origin);
      return;
    }

    if (requestUrl.pathname === "/api/admin/summary" && method === "GET") {
      const auth = await requireAuth(req, origin);
      if (!auth || !requireAdmin(auth.user)) {
        json(res, 403, { error: "Admin access required" }, origin);
        return;
      }
      json(
        res,
        200,
        {
          totalUsers: (await store.getUsers()).length,
          pendingProjects: 2,
          pendingSubmissions: submissions.filter((submission: { status: string }) => submission.status === "Pending Review").length,
          liveChallenges: challenges.length,
          flagged: 1,
        },
        origin,
      );
      return;
    }

    if (requestUrl.pathname === "/api/debug/me" && method === "GET") {
      json(res, 200, { users: await store.getUsers() }, origin);
      return;
    }

    json(
      res,
      200,
      {
        service: "memebooq-backend",
        endpoints: [
          "/health",
          "/api/public/site",
          "/api/challenges",
          "/api/challenges/:slug",
          "/api/challenges/:slug/join",
          "/api/challenges/:slug/submissions",
          "/api/submissions",
          "/api/submissions/verify-x-author",
          "/api/leaderboard",
          "/api/notifications",
          "/api/projects",
          "/api/projects/:handle",
          "/api/auth/nonce",
          "/api/auth/wallet",
          "/api/auth/refresh",
          "/api/auth/logout",
          "/api/auth/x/start",
          "/api/auth/x/callback",
          "/api/auth/x/disconnect",
          "/api/me",
          "/api/users/:handle",
          "/api/admin/summary",
        ],
      },
      origin,
    );
  });

  server.listen(port, host, () => {
    console.log(`Memebooq backend listening on ${host}:${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
