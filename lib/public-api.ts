export interface PublicSiteStats {
  totalUsers: number;
  challenges: number;
  winners: number;
  rewardsDistributed: number;
}

export interface PublicSiteResponse {
  brand?: string;
  ticker?: string;
  contractAddress?: string;
  stats?: PublicSiteStats;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function fetchPublicSite(): Promise<PublicSiteResponse | null> {
  if (!apiBase) return null;

  try {
    const res = await fetch(`${apiBase}/api/public/site`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as PublicSiteResponse;
  } catch {
    return null;
  }
}
