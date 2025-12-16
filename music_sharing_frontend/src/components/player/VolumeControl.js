import React from "react";

// PUBLIC_INTERFACE
export function VolumeControl({ volume, isMuted, onVolume, onToggleMute }) {
  /** Volume + mute controls. */
  return (
    <div className="vol">
      <button type="button" className="iconBtn" onClick={onToggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
        {isMuted ? "🔇" : "🔊"}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolume?.(Number(e.target.value))}
        aria-label="Volume"
        className="volRange"
      />
    </div>
  );
}
