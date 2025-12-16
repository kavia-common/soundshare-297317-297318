import React, { useMemo } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { trackById } from "../../data/mockTracks";
import { WaveformSeekbar } from "./WaveformSeekbar";
import { VolumeControl } from "./VolumeControl";
import { PlaybackRateMenu } from "./PlaybackRateMenu";
import { Button } from "../common/Button";
import { useHotkeys } from "../../hooks/useHotkeys";

// PUBLIC_INTERFACE
export function PlayerDock() {
  /** Persistent bottom audio player dock. */
  const player = usePlayer();

  const track = useMemo(() => {
    if (player.currentTrack) return player.currentTrack;
    if (player.state.currentId) return trackById(player.state.currentId);
    return null;
  }, [player.currentTrack, player.state.currentId]);

  useHotkeys(
    {
      onTogglePlay: player.togglePlay,
      onSeekRelative: player.seekRelative,
      onToggleMute: player.toggleMute,
      onToggleLike: player.toggleLike,
    },
    true
  );

  const loopLabel =
    player.state.loopMode === "off" ? "Loop off" : player.state.loopMode === "one" ? "Loop one" : "Loop all";

  return (
    <div className="dock">
      <div className="dockLeft">
        <div className="nowCover" style={{ background: track?.coverColor || "rgba(255,255,255,0.08)" }}>
          <div className="nowCoverGlow" />
        </div>
        <div className="nowMeta">
          <div className="nowTitle">{track ? track.title : "Pick a track"}</div>
          <div className="nowArtist">{track ? track.artist : "Browse Home / Explore to start listening"}</div>
        </div>
      </div>

      <div className="dockCenter">
        <div className="controls">
          <button type="button" className="iconBtn" onClick={player.prev} aria-label="Previous">
            ⏮
          </button>
          <button
            type="button"
            className="playBtn"
            onClick={player.togglePlay}
            aria-label={player.state.isPlaying ? "Pause" : "Play"}
            disabled={!track}
          >
            {player.state.isPlaying ? "⏸" : "▶"}
          </button>
          <button type="button" className="iconBtn" onClick={player.next} aria-label="Next">
            ⏭
          </button>

          <button
            type="button"
            className={`chipBtn ${player.state.shuffle ? "active" : ""}`}
            onClick={player.toggleShuffle}
            aria-label="Shuffle"
          >
            Shuffle
          </button>

          <button
            type="button"
            className={`chipBtn ${player.state.loopMode !== "off" ? "active" : ""}`}
            onClick={() => {
              const next = player.state.loopMode === "off" ? "all" : player.state.loopMode === "all" ? "one" : "off";
              player.setLoopMode(next);
            }}
            aria-label={loopLabel}
          >
            {loopLabel}
          </button>

          <PlaybackRateMenu rate={player.state.playbackRate} onChange={player.setPlaybackRate} />
        </div>

        <WaveformSeekbar
          currentTime={player.state.currentTime}
          duration={player.state.duration}
          onSeek={player.seekTo}
        />
      </div>

      <div className="dockRight">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => player.ui.setQueueOpen(true)}
          aria-label="Open queue"
        >
          Queue
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => track && player.ui.openShare(track.id)}
          aria-label="Share current track"
          disabled={!track}
        >
          Share
        </Button>
        <button
          type="button"
          className={`iconBtn ${player.state.currentId && player.state.liked?.[player.state.currentId] ? "liked" : ""}`}
          onClick={player.toggleLike}
          aria-label="Like"
          disabled={!track}
        >
          ♥
        </button>

        <VolumeControl
          volume={player.state.volume}
          isMuted={player.state.isMuted}
          onVolume={player.setVolume}
          onToggleMute={player.toggleMute}
        />
      </div>
    </div>
  );
}
