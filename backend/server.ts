import http from "node:http";
import { URL } from "node:url";
import {
  challenges,
  getChallenge,
  getProject,
  leaderboard,
  me,
  notifications,
  platformStats,
  projects,
  submissions,
} from "../lib/mock";

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
const originList = (process.env.CORS_ORIGIN ?? process.env.CLIENT_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const sitePayload = {
  brand: "Memebooq",
  contractAddress: "0x1234...abcd5678",
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
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Vary", "Origin");
}

function json(res: http.ServerResponse, statusCode: number, payload: unknown, origin?: string) {
  setCors(res, origin);
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function notFound(res: http.ServerResponse, origin?: string) {
  json(res, 404, { error: "Not found" }, origin);
}

const server = http.createServer((req, res) => {
  const method = req.method ?? "GET";
  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;

  if (method === "OPTIONS") {
    setCors(res, origin);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (method !== "GET") {
    notFound(res, origin);
    return;
  }

  if (requestUrl.pathname === "/health") {
    json(res, 200, {
      ok: true,
      service: "memebooq-backend",
      time: new Date().toISOString(),
    }, origin);
    return;
  }

  if (requestUrl.pathname === "/api/public/site") {
    json(res, 200, sitePayload, origin);
    return;
  }

  if (requestUrl.pathname === "/api/challenges") {
    json(res, 200, { challenges }, origin);
    return;
  }

  if (requestUrl.pathname.startsWith("/api/challenges/")) {
    const slug = requestUrl.pathname.split("/").pop() ?? "";
    const challenge = getChallenge(slug);
    if (!challenge) {
      notFound(res, origin);
      return;
    }
    json(res, 200, { challenge }, origin);
    return;
  }

  if (requestUrl.pathname === "/api/submissions") {
    json(res, 200, { submissions }, origin);
    return;
  }

  if (requestUrl.pathname === "/api/leaderboard") {
    json(res, 200, leaderboard, origin);
    return;
  }

  if (requestUrl.pathname === "/api/me") {
    json(res, 200, { me }, origin);
    return;
  }

  if (requestUrl.pathname === "/api/notifications") {
    json(res, 200, { notifications }, origin);
    return;
  }

  if (requestUrl.pathname === "/api/projects") {
    json(res, 200, { projects }, origin);
    return;
  }

  if (requestUrl.pathname.startsWith("/api/projects/")) {
    const handle = requestUrl.pathname.split("/").pop() ?? "";
    const project = getProject(handle);
    if (!project) {
      notFound(res, origin);
      return;
    }
    json(res, 200, { project }, origin);
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
        "/api/submissions",
        "/api/leaderboard",
        "/api/me",
        "/api/notifications",
        "/api/projects",
        "/api/projects/:handle",
      ],
    },
    origin,
  );
});

server.listen(port, () => {
  console.log(`Memebooq backend listening on ${port}`);
});
