import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clamp, moveItem } from "../utils/format";

const STORAGE_KEY = "soundshare.player.v1";

const safeJsonParse = (s, fallback) => {
  try {
    const v = JSON.parse(s);
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const defaultState = {
  currentId: null,
  queue: [],
  queueIndex: -1,

  isPlaying: false,
  currentTime: 0,
  duration: 0,

  volume: 0.9,
  isMuted: false,

  loopMode: "off", // off | one | all
  shuffle: false,
  playbackRate: 1,

  liked: {},
};

const persistable = (s) => ({
  currentId: s.currentId,
  queue: s.queue,
  queueIndex: s.queueIndex,
  volume: s.volume,
  isMuted: s.isMuted,
  loopMode: s.loopMode,
  shuffle: s.shuffle,
  playbackRate: s.playbackRate,
  liked: s.liked,
});

// PUBLIC_INTERFACE
export function useAudioPlayer({ getTrackById }) {
  /**
   * Central audio controller for the SPA.
   * - Keeps a single Audio() instance.
   * - Provides queue controls, seek/volume, loop/shuffle, playback speed.
   * - Persists settings + queue to localStorage.
   */
  const audioRef = useRef(null);
  const suppressAutoPlayRef = useRef(false);

  const [state, setState] = useState(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    const restored = raw ? safeJsonParse(raw, {}) : {};
    return { ...defaultState, ...restored };
  });

  const currentTrack = useMemo(() => {
    if (!state.currentId) return null;
    return getTrackById(state.currentId);
  }, [getTrackById, state.currentId]);

  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
    }
    return audioRef.current;
  }, []);

  // Persist selected state
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable(state)));
    } catch {
      // ignore
    }
  }, [state]);

  // Keep audio element props in sync
  useEffect(() => {
    const audio = ensureAudio();
    audio.volume = clamp(state.volume, 0, 1);
    audio.muted = !!state.isMuted;
    audio.playbackRate = clamp(state.playbackRate, 0.5, 2);
  }, [ensureAudio, state.volume, state.isMuted, state.playbackRate]);

  // Bind audio element events once
  useEffect(() => {
    const audio = ensureAudio();

    const onTime = () => setState((s) => ({ ...s, currentTime: audio.currentTime || 0 }));
    const onLoaded = () => setState((s) => ({ ...s, duration: audio.duration || 0 }));
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));
    const onEnded = () => {
      setState((s) => {
        if (s.loopMode === "one") return s; // audio 'ended' may still fire; we re-trigger play below
        return { ...s, isPlaying: false };
      });
      handleEnded();
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ensureAudio]);

  const loadTrack = useCallback(
    async (trackId, { autoPlay } = { autoPlay: true }) => {
      const t = getTrackById(trackId);
      if (!t) return false;
      const audio = ensureAudio();

      suppressAutoPlayRef.current = !autoPlay;

      // If already loaded, keep state; else swap src
      if (audio.src !== t.audioUrl) {
        audio.src = t.audioUrl;
        try {
          await audio.load();
        } catch {
          // ignore; load() doesn't promise in all browsers
        }
      }

      setState((s) => ({
        ...s,
        currentId: trackId,
        currentTime: 0,
        duration: audio.duration || s.duration || 0,
      }));

      if (autoPlay) {
        try {
          await audio.play();
          return true;
        } catch {
          // autoplay might be blocked; keep loaded
          setState((s) => ({ ...s, isPlaying: false }));
          return false;
        }
      }
      return true;
    },
    [ensureAudio, getTrackById]
  );

  const setQueue = useCallback((queueIds, startIndex = 0, { autoPlay } = { autoPlay: true }) => {
    const normalized = (queueIds || []).filter(Boolean);
    const idx = normalized.length ? clamp(startIndex, 0, normalized.length - 1) : -1;
    setState((s) => ({
      ...s,
      queue: normalized,
      queueIndex: idx,
      currentId: idx >= 0 ? normalized[idx] : null,
    }));

    if (idx >= 0) {
      loadTrack(normalized[idx], { autoPlay });
    }
  }, [loadTrack]);

  const addToQueue = useCallback((trackId, { playNext } = { playNext: false }) => {
    setState((s) => {
      const q = [...s.queue];
      if (playNext && s.queueIndex >= 0) {
        q.splice(s.queueIndex + 1, 0, trackId);
      } else {
        q.push(trackId);
      }
      return { ...s, queue: q };
    });
  }, []);

  const removeFromQueue = useCallback((index) => {
    setState((s) => {
      if (index < 0 || index >= s.queue.length) return s;
      const q = [...s.queue];
      q.splice(index, 1);

      let nextIndex = s.queueIndex;
      if (index < s.queueIndex) nextIndex -= 1;
      if (index === s.queueIndex) {
        // current removed; move to same index if exists else previous
        nextIndex = Math.min(index, q.length - 1);
      }
      const nextId = nextIndex >= 0 ? q[nextIndex] : null;
      return { ...s, queue: q, queueIndex: nextIndex, currentId: nextId };
    });
  }, []);

  const moveQueueItem = useCallback((from, to) => {
    setState((s) => {
      const q = moveItem(s.queue, from, to);
      let idx = s.queueIndex;
      // Keep selection stable by track id
      const currentId = s.currentId;
      if (currentId) idx = q.indexOf(currentId);
      return { ...s, queue: q, queueIndex: idx };
    });
  }, []);

  const play = useCallback(async () => {
    const audio = ensureAudio();
    if (!currentTrack) return false;

    if (!audio.src) {
      await loadTrack(currentTrack.id, { autoPlay: true });
      return true;
    }

    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }, [ensureAudio, currentTrack, loadTrack]);

  const pause = useCallback(() => {
    const audio = ensureAudio();
    // IMPORTANT: Always invoke pause() directly. We rely on the audio element's native
    // "pause" event to sync `state.isPlaying` back to false.
    audio.pause();
  }, [ensureAudio]);

  const togglePlay = useCallback(() => {
    // Root cause fix:
    // We should NOT branch on `audio.paused` here because it can be stale in React event
    // handlers (especially around rapid play->pause clicks or when play() hasn't resolved yet).
    // Instead, we branch on our single source of truth: `state.isPlaying`,
    // which is driven by the audio element "play"/"pause" events.
    if (state.isPlaying) {
      pause();
      return;
    }
    play();
  }, [pause, play, state.isPlaying]);

  const seekTo = useCallback(
    (timeSec) => {
      const audio = ensureAudio();
      const t = clamp(timeSec, 0, audio.duration || state.duration || 0);
      audio.currentTime = t;
      setState((s) => ({ ...s, currentTime: t }));
    },
    [ensureAudio, state.duration]
  );

  const seekRelative = useCallback(
    (deltaSec) => {
      const audio = ensureAudio();
      const t = (audio.currentTime || 0) + deltaSec;
      seekTo(t);
    },
    [ensureAudio, seekTo]
  );

  const setVolume = useCallback((v) => setState((s) => ({ ...s, volume: clamp(v, 0, 1) })), []);
  const toggleMute = useCallback(() => setState((s) => ({ ...s, isMuted: !s.isMuted })), []);

  const setLoopMode = useCallback((mode) => {
    setState((s) => ({ ...s, loopMode: mode }));
  }, []);

  const toggleShuffle = useCallback(() => setState((s) => ({ ...s, shuffle: !s.shuffle })), []);

  const setPlaybackRate = useCallback((r) => {
    setState((s) => ({ ...s, playbackRate: clamp(r, 0.5, 2) }));
  }, []);

  const playIndex = useCallback(
    (idx, { autoPlay } = { autoPlay: true }) => {
      setState((s) => {
        const nextIndex = clamp(idx, 0, s.queue.length - 1);
        const nextId = s.queue[nextIndex];
        return { ...s, queueIndex: nextIndex, currentId: nextId };
      });
      const nextId = state.queue[idx];
      if (nextId) loadTrack(nextId, { autoPlay });
    },
    [loadTrack, state.queue]
  );

  const next = useCallback(() => {
    setState((s) => {
      if (!s.queue.length) return s;

      const lastIndex = s.queue.length - 1;
      const currentIndex = s.queueIndex >= 0 ? s.queueIndex : 0;

      let nextIndex = currentIndex;

      if (s.shuffle) {
        if (s.queue.length === 1) nextIndex = 0;
        else {
          do {
            nextIndex = Math.floor(Math.random() * s.queue.length);
          } while (nextIndex === currentIndex);
        }
      } else {
        nextIndex = currentIndex + 1;
      }

      if (nextIndex > lastIndex) {
        if (s.loopMode === "all") nextIndex = 0;
        else return { ...s, isPlaying: false };
      }

      const nextId = s.queue[nextIndex];
      // loadTrack side-effect outside setState; but we still update state here
      queueMicrotask(() => loadTrack(nextId, { autoPlay: true }));
      return { ...s, queueIndex: nextIndex, currentId: nextId };
    });
  }, [loadTrack]);

  const prev = useCallback(() => {
    const audio = ensureAudio();
    if ((audio.currentTime || 0) > 3) {
      seekTo(0);
      return;
    }

    setState((s) => {
      if (!s.queue.length) return s;
      const currentIndex = s.queueIndex >= 0 ? s.queueIndex : 0;
      let nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        if (s.loopMode === "all") nextIndex = s.queue.length - 1;
        else nextIndex = 0;
      }
      const nextId = s.queue[nextIndex];
      queueMicrotask(() => loadTrack(nextId, { autoPlay: true }));
      return { ...s, queueIndex: nextIndex, currentId: nextId };
    });
  }, [ensureAudio, loadTrack, seekTo]);

  const handleEnded = useCallback(() => {
    const audio = ensureAudio();
    setState((s) => {
      if (s.loopMode === "one") {
        queueMicrotask(async () => {
          audio.currentTime = 0;
          try {
            await audio.play();
          } catch {
            // ignore
          }
        });
        return s;
      }
      return s;
    });
    // Advance if not "one"
    setTimeout(() => {
      setState((s) => {
        if (s.loopMode === "one") return s;
        return s;
      });
      if (state.loopMode !== "one") next();
    }, 0);
  }, [ensureAudio, next, state.loopMode]);

  const toggleLike = useCallback(() => {
    setState((s) => {
      const id = s.currentId;
      if (!id) return s;
      const liked = { ...s.liked, [id]: !s.liked[id] };
      return { ...s, liked };
    });
  }, []);

  // On currentId change: ensure audio source matches and optionally autoplay if state.isPlaying
  useEffect(() => {
    if (!state.currentId) return;
    const audio = ensureAudio();
    const t = getTrackById(state.currentId);
    if (!t) return;

    if (audio.src !== t.audioUrl) {
      // If user explicitly paused, don't force autoplay.
      const autoPlay = state.isPlaying && !suppressAutoPlayRef.current;
      suppressAutoPlayRef.current = false;
      loadTrack(t.id, { autoPlay });
    }
  }, [ensureAudio, getTrackById, loadTrack, state.currentId, state.isPlaying]);

  return {
    state,
    currentTrack,

    loadTrack,
    setQueue,
    addToQueue,
    removeFromQueue,
    moveQueueItem,

    play,
    pause,
    togglePlay,
    next,
    prev,

    seekTo,
    seekRelative,

    setVolume,
    toggleMute,
    setLoopMode,
    toggleShuffle,
    setPlaybackRate,

    toggleLike,
  };
}
