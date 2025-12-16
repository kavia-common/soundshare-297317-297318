import React from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { formatTime } from "../../utils/format";
import { usePlayer } from "../../context/PlayerContext";

// PUBLIC_INTERFACE
export function TrackCard({ track, compact = false }) {
  /** Displays track info + actions. */
  const player = usePlayer();
  const isCurrent = player.state.currentId === track.id;
  const isLiked = !!player.state.liked?.[track.id];

  const onPlayNow = () => {
    // If queue empty, create a single-track queue; else play within current queue if present.
    const idx = player.state.queue.indexOf(track.id);
    if (idx >= 0) {
      player.loadTrack(track.id, { autoPlay: true });
      return;
    }
    player.setQueue([track.id], 0, { autoPlay: true });
  };

  const onAdd = () => player.addToQueue(track.id);

  return (
    <Card className={`trackCard ${compact ? "compact" : ""}`}>
      <div className="trackCover" style={{ background: track.coverColor || "var(--pr-primary)" }}>
        <div className="trackCoverOverlay" />
        <div className="trackCoverText">
          <div className="trackTitle">{track.title}</div>
          <div className="trackArtist">{track.artist}</div>
        </div>
      </div>

      <div className="trackMeta">
        <div className="trackMetaRow">
          <div className="trackMetaLeft">
            <div className="trackTitleSmall">
              {track.title} {isCurrent ? <span className="pill">Now</span> : null}
            </div>
            <div className="trackArtistSmall">{track.artist}</div>
          </div>
          <div className="trackDuration">{formatTime(track.durationSec)}</div>
        </div>

        <div className="trackTags">
          {(track.tags || []).slice(0, 3).map((t) => (
            <span key={t} className="tag">#{t}</span>
          ))}
        </div>

        <div className="trackActions">
          <Button variant="primary" size="sm" onClick={onPlayNow} aria-label={`Play ${track.title}`}>
            {player.state.isPlaying && isCurrent ? "Pause/Play" : "Play"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onAdd} aria-label={`Add ${track.title} to queue`}>
            + Queue
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => player.ui.openShare(track.id)}
            aria-label={`Share ${track.title}`}
          >
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => player.toggleLike(track.id)}
            aria-label={isLiked ? "Unlike" : "Like"}
            className={isLiked ? "isLiked" : ""}
          >
            {isLiked ? "♥" : "♡"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
