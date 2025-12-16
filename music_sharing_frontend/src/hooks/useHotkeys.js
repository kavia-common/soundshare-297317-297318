import { useEffect } from "react";

/**
 * Avoid hijacking keys when typing in inputs.
 */
const isTypingTarget = (el) => {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
};

// PUBLIC_INTERFACE
export function useHotkeys(handlers, enabled = true) {
  /** Registers global hotkeys and delegates to provided handlers. */
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e) => {
      if (isTypingTarget(document.activeElement)) return;

      // Space: play/pause (prevent page scroll)
      if (e.code === "Space") {
        e.preventDefault();
        handlers?.onTogglePlay?.();
        return;
      }

      // Seek
      if (e.code === "ArrowLeft") {
        handlers?.onSeekRelative?.(-5);
        return;
      }
      if (e.code === "ArrowRight") {
        handlers?.onSeekRelative?.(5);
        return;
      }

      // Mute
      if (e.key?.toLowerCase() === "m") {
        handlers?.onToggleMute?.();
        return;
      }

      // Like
      if (e.key?.toLowerCase() === "l") {
        handlers?.onToggleLike?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers, enabled]);
}
