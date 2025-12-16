import React, { useState } from "react";
import { clamp } from "../../utils/format";

// PUBLIC_INTERFACE
export function PlaybackRateMenu({ rate, onChange }) {
  /** Playback speed menu. */
  const [open, setOpen] = useState(false);
  const options = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="rate">
      <button
        type="button"
        className="chipBtn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Playback speed"
        aria-expanded={open}
      >
        {clamp(rate || 1, 0.5, 2).toFixed(2).replace(/\.00$/, "")}x
      </button>

      {open ? (
        <div className="menu" role="menu" aria-label="Playback rate options">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="menuitemradio"
              aria-checked={o === rate}
              className={`menuItem ${o === rate ? "active" : ""}`}
              onClick={() => {
                onChange?.(o);
                setOpen(false);
              }}
            >
              {o}x
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
