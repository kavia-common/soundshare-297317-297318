import React from "react";
import { usePlayer } from "../../context/PlayerContext";
import { trackById } from "../../data/mockTracks";
import { Button } from "../common/Button";

// PUBLIC_INTERFACE
export function QueueDrawer({ open, onClose }) {
  /** Right-side queue drawer showing upcoming tracks with simple controls. */
  const player = usePlayer();

  if (!open) return null;

  return (
    <div className="drawerOverlay" role="dialog" aria-modal="true" aria-label="Queue">
      <div className="drawer">
        <div className="drawerHead">
          <div>
            <div className="drawerTitle">Queue</div>
            <div className="drawerSub">{player.state.queue.length} tracks</div>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="drawerBody">
          {player.state.queue.length === 0 ? (
            <div className="emptyState">Your queue is empty. Add tracks from Home/Explore.</div>
          ) : (
            <ol className="queueList">
              {player.state.queue.map((id, i) => {
                const t = trackById(id);
                if (!t) return null;
                const isCurrent = player.state.queueIndex === i;
                return (
                  <li key={`${id}-${i}`} className={`queueItem ${isCurrent ? "current" : ""}`}>
                    <button
                      type="button"
                      className="queueMain"
                      onClick={() => player.loadTrack(id, { autoPlay: true })}
                      aria-label={`Play ${t.title}`}
                    >
                      <span className="queueIdx" aria-hidden="true">{i + 1}</span>
                      <span className="queueText">
                        <span className="queueTitle">{t.title}</span>
                        <span className="queueArtist">{t.artist}</span>
                      </span>
                    </button>

                    <div className="queueBtns">
                      <button
                        type="button"
                        className="miniBtn"
                        onClick={() => player.moveQueueItem(i, Math.max(0, i - 1))}
                        aria-label="Move up"
                        disabled={i === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="miniBtn"
                        onClick={() => player.moveQueueItem(i, Math.min(player.state.queue.length - 1, i + 1))}
                        aria-label="Move down"
                        disabled={i === player.state.queue.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="miniBtn danger"
                        onClick={() => player.removeFromQueue(i)}
                        aria-label="Remove from queue"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="drawerFoot">
          <div className="switches">
            <label className="switch">
              <input
                type="checkbox"
                checked={player.state.shuffle}
                onChange={player.toggleShuffle}
              />
              <span>Shuffle</span>
            </label>
            <label className="switch">
              <select
                className="select"
                value={player.state.loopMode}
                onChange={(e) => player.setLoopMode(e.target.value)}
                aria-label="Loop mode"
              >
                <option value="off">Loop: Off</option>
                <option value="one">Loop: One</option>
                <option value="all">Loop: All</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
