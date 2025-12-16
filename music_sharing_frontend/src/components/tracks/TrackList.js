import React from "react";
import { TrackCard } from "./TrackCard";
import { Skeleton } from "../common/Skeleton";

// PUBLIC_INTERFACE
export function TrackList({ tracks, loading = false, variant = "grid" }) {
  /** Renders tracks in grid/list. */
  if (loading) {
    return (
      <div className="grid cols3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card" style={{ padding: 14 }}>
            <Skeleton style={{ height: 120, borderRadius: 14, marginBottom: 12 }} />
            <Skeleton style={{ height: 12, width: "70%", marginBottom: 8 }} />
            <Skeleton style={{ height: 10, width: "45%" }} />
          </div>
        ))}
      </div>
    );
  }

  if (!tracks?.length) {
    return <div className="emptyState">No tracks match your search.</div>;
  }

  if (variant === "list") {
    return (
      <div className="trackList">
        {tracks.map((t) => (
          <TrackCard key={t.id} track={t} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="grid cols3">
      {tracks.map((t) => (
        <TrackCard key={t.id} track={t} />
      ))}
    </div>
  );
}
