import React, { useMemo, useState } from "react";
import { mockTracks } from "../data/mockTracks";
import { TrackList } from "../components/tracks/TrackList";

// PUBLIC_INTERFACE
export function Explore({ query }) {
  /** Explore: browse all tracks and filter by tag. */
  const [tag, setTag] = useState("all");

  const allTags = useMemo(() => {
    const set = new Set();
    mockTracks.forEach((t) => (t.tags || []).forEach((x) => set.add(x)));
    return ["all", ...Array.from(set).sort()];
  }, []);

  const tracks = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return mockTracks.filter((t) => {
      if (tag !== "all" && !(t.tags || []).includes(tag)) return false;
      if (!q) return true;
      const hay = `${t.title} ${t.artist} ${(t.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, tag]);

  return (
    <div className="container">
      <div className="pageTitle">
        <div>
          <h1>Explore</h1>
          <p>Search, filter, and build your queue</p>
        </div>
        <div className="filterRow">
          <label className="filterLabel">
            Tag
            <select className="select" value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Filter by tag">
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All" : `#${t}`}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <TrackList tracks={tracks} />
    </div>
  );
}
