import React, { useMemo } from "react";
import { mockTracks } from "../data/mockTracks";
import { TrackList } from "../components/tracks/TrackList";
import { usePlayer } from "../context/PlayerContext";

// PUBLIC_INTERFACE
export function Home({ query }) {
  /** Home feed: featured tracks. */
  const player = usePlayer();

  const tracks = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const base = mockTracks.filter((t) => (t.tags || []).includes("featured") || (t.tags || []).includes("trending"));
    if (!q) return base;
    return base.filter((t) => {
      const hay = `${t.title} ${t.artist} ${(t.tags || []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <div className="container">
      <div className="pageTitle">
        <div>
          <h1>Home</h1>
          <p>Featured drops & quick plays</p>
        </div>
        <div className="rightHint">
          <button
            type="button"
            className="chipBtn"
            onClick={() => {
              const ids = tracks.map((t) => t.id);
              player.setQueue(ids, 0, { autoPlay: true });
              player.ui.setQueueOpen(true);
            }}
            disabled={!tracks.length}
          >
            Play feed
          </button>
        </div>
      </div>

      <TrackList tracks={tracks} />
    </div>
  );
}
