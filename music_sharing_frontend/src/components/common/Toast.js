import React, { useEffect } from "react";

// PUBLIC_INTERFACE
export function Toast({ open, message, onClose, durationMs = 2000 }) {
  /** Small ephemeral toast. */
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => onClose?.(), durationMs);
    return () => window.clearTimeout(t);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" className="toastClose" onClick={onClose} aria-label="Close toast">
        ✕
      </button>
    </div>
  );
}
