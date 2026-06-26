import { Suspense } from "react";
import { ExploreClient } from "@/components/explore/ExploreClient";

export const metadata = { title: "Explore — Memebooq" };

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="rounded-3xl border border-border bg-surface/40 p-6 text-muted">Loading explore…</div>}>
      <ExploreClient />
    </Suspense>
  );
}
