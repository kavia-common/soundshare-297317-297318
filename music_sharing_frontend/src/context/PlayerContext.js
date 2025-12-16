import React, { createContext, useContext, useMemo, useState } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { trackById } from "../data/mockTracks";

const PlayerContext = createContext(null);

// PUBLIC_INTERFACE
export function PlayerProvider({ children }) {
  /** Provides global audio player state/actions and UI state (queue drawer, share sheet). */
  const player = useAudioPlayer({ getTrackById: trackById });
  const [queueOpen, setQueueOpen] = useState(false);
  const [share, setShare] = useState({ open: false, trackId: null });

  const value = useMemo(
    () => ({
      ...player,
      ui: {
        queueOpen,
        setQueueOpen,
        share,
        openShare: (trackId) => setShare({ open: true, trackId }),
        closeShare: () => setShare({ open: false, trackId: null }),
      },
    }),
    [player, queueOpen, share]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// PUBLIC_INTERFACE
export function usePlayer() {
  /** Access the global player context. */
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
