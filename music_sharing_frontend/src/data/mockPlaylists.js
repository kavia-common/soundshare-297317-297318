import { mockTracks } from "./mockTracks";

export const mockPlaylists = [
  {
    id: "p1",
    name: "Power Red Picks",
    description: "Bold, energetic tracks with a bright edge.",
    trackIds: ["t1", "t2", "t6"],
  },
  {
    id: "p2",
    name: "Late Night Focus",
    description: "Ambient + chill for deep work sessions.",
    trackIds: ["t3", "t1"],
  },
  {
    id: "p3",
    name: "Live & Loud",
    description: "Performance energy—turn it up.",
    trackIds: ["t4", "t2"],
  },
];

export const playlistTracks = (playlist) =>
  playlist.trackIds.map((id) => mockTracks.find((t) => t.id === id)).filter(Boolean);
