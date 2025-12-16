import React, { useMemo, useRef, useState } from "react";
import { clamp } from "../../utils/format";
import { formatTime } from "../../utils/format";

// PUBLIC_INTERFACE
export function WaveformSeekbar({ currentTime, duration, onSeek }) {
  /** Faux waveform seekbar with simple bars; click/drag to seek. */
  const wrapRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const bars = useMemo(() => {
    // deterministic pseudo-waveform
    const n = 64;
    const arr = [];
    for (let i = 0; i < n; i++) {
      const v = Math.sin(i * 0.55) * 0.5 + Math.sin(i * 0.12) * 0.35 + 0.5;
      const height = 0.25 + clamp(v, 0, 1) * 0.75;
      arr.push(height);
    }
    return arr;
  }, []);

  const pct = duration > 0 ? clamp(currentTime / duration, 0, 1) : 0;

  const posToTime = (clientX) => {
    const el = wrapRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const p = clamp((clientX - rect.left) / rect.width, 0, 1);
    return p * (duration || 0);
  };

  const onPointerDown = (e) => {
    setDragging(true);
    onSeek?.(posToTime(e.clientX));
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    onSeek?.(posToTime(e.clientX));
  };
  const onPointerUp = () => setDragging(false);

  return (
    <div className="seekWrap">
      <div className="seekTimes">
        <span className="seekTime">{formatTime(currentTime)}</span>
        <span className="seekTime">{formatTime(duration)}</span>
      </div>

      <div
        className="wave"
        ref={wrapRef}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.floor(duration || 0)}
        aria-valuenow={Math.floor(currentTime || 0)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onSeek?.(clamp(currentTime - 5, 0, duration));
          if (e.key === "ArrowRight") onSeek?.(clamp(currentTime + 5, 0, duration));
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div className="waveBars">
          {bars.map((h, i) => {
            const barPct = i / (bars.length - 1);
            const active = barPct <= pct;
            return (
              <div
                key={i}
                className={`waveBar ${active ? "active" : ""}`}
                style={{ height: `${Math.round(h * 100)}%` }}
                aria-hidden="true"
              />
            );
          })}
        </div>
        <div className="waveProgress" style={{ width: `${pct * 100}%` }} aria-hidden="true" />
      </div>
    </div>
  );
}
