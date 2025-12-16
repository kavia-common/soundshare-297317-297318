/**
 * Mock tracks for local-only demo (no backend calls).
 * Audio sources are public sample MP3s.
 */

export const mockTracks = [
  {
    id: "t1",
    title: "Neon Pulse",
    artist: "Kavia Nights",
    durationSec: 146,
    coverColor: "#ef4444",
    tags: ["electronic", "featured"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/293",
  },
  {
    id: "t2",
    title: "Crimson Drift",
    artist: "Power Red",
    durationSec: 221,
    coverColor: "#f59e0b",
    tags: ["house"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    embedUrl: "",
  },
  {
    id: "t3",
    title: "Emerald Echo",
    artist: "Greenline",
    durationSec: 189,
    coverColor: "#10b981",
    tags: ["ambient", "chill"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    embedUrl: "",
  },
  {
    id: "t4",
    title: "Overdrive (Live)",
    artist: "Kavia Nights",
    durationSec: 260,
    coverColor: "#ef4444",
    tags: ["live", "rock"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    embedUrl: "",
  },
  {
    id: "t5",
    title: "Signals & Sirens",
    artist: "City Static",
    durationSec: 203,
    coverColor: "#f59e0b",
    tags: ["pop", "vocals"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    embedUrl: "",
  },
  {
    id: "t6",
    title: "Night Runner",
    artist: "City Static",
    durationSec: 178,
    coverColor: "#10b981",
    tags: ["synthwave", "trending"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    embedUrl: "",
  },
];

export const trackById = (id) => mockTracks.find((t) => t.id === id) || null;
