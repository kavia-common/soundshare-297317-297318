import React, { useEffect, useRef } from "react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { formatTime } from "../../utils/format";

// PUBLIC_INTERFACE
export function TrackDetailModal({ open, track, onClose }) {
  /** Modal showing track details and share entrypoints. */
  const closeRef = useRef(null);

  useEffect(() => {
    if (open) closeRef.current?.focus?.();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !track) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Track details">
      <Card className="modal">
        <div className="modalHead">
          <div>
            <div className="modalTitle">{track.title}</div>
            <div className="modalSub">{track.artist} • {formatTime(track.durationSec)}</div>
          </div>
          <Button variant="ghost" onClick={onClose} ref={closeRef}>
            Close
          </Button>
        </div>
        <div className="modalBody">
          <p className="muted">
            Tags: {(track.tags || []).map((t) => `#${t}`).join(" ")}
          </p>
          {track.embedUrl ? (
            <div className="embedHint">
              This track supports an embed snippet in the Share sheet.
            </div>
          ) : (
            <div className="embedHint">No embed URL available for this track.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
