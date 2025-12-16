import React, { useMemo } from "react";
import { mockPlaylists, playlistTracks } from "../data/mockPlaylists";
import { mockTracks } from "../data/mockTracks";
import { TrackList } from "../components/tracks/TrackList";
import { Card } from "../components/common/Card";
import { usePlayer } from "../context/PlayerContext";

// PUBLIC_INTERFACE
export function Library({ query }) {
  /** Library: playlists + liked tracks. */
  const player = usePlayer();

  const likedTracks = useMemo(() => {
    const likedMap = player.state.liked || {};
    const list = mockTracks.filter((t) => !!likedMap[t.id]);
    const q = (query || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => `${t.title} ${t.artist} ${(t.tags || []).join(" ")}`.toLowerCase().includes(q));
  }, [player.state.liked, query]);

  return (
    <div className="container">
      <div className="pageTitle">
        <div>
          <h1>Library</h1>
          <p>Your saved vibes</p>
        </div>
      </div>

      <div className="grid cols2">
        <Card className="libraryCard">
          <div className="libraryHead">
            <div className="libraryTitle">Liked</div>
            <div className="muted small">{likedTracks.length} tracks</div>
          </div>
          <div className="libraryBody">
            <TrackList tracks={likedTracks} variant="list" />
          </div>
        </Card>

        <Card className="libraryCard">
          <div className="libraryHead">
            <div className="libraryTitle">Playlists</div>
            <div className="muted small">{mockPlaylists.length} playlists</div>
          </div>
          <div className="libraryBody">
            <div className="playlistList">
              {mockPlaylists.map((p) => {
                const tracks = playlistTracks(p);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className="playlistItem"
                    onClick={() => player.setQueue(tracks.map((t) => t.id), 0, { autoPlay: true })}
                    aria-label={`Play playlist ${p.name}`}
                  >
                    <div className="playlistName">{p.name}</div>
                    <div className="playlistDesc">{p.description}</div>
                    <div className="playlistMeta">{tracks.length} tracks</div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
