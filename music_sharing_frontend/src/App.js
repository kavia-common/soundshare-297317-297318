import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { Library } from "./pages/Library";
import { NotFound } from "./pages/NotFound";
import { trackById } from "./data/mockTracks";

function useQueryParam(name) {
  const loc = useLocation();
  return useMemo(() => new URLSearchParams(loc.search).get(name), [loc.search, name]);
}

function AppShell() {
  const [query, setQuery] = useState("");
  const player = usePlayer();
  const navigate = useNavigate();
  const trackParam = useQueryParam("track");

  // Deep-link: /?track=t1
  useEffect(() => {
    if (!trackParam) return;
    const t = trackById(trackParam);
    if (!t) return;

    // Ensure track is in queue; if not, create queue with track.
    const idx = player.state.queue.indexOf(t.id);
    if (idx >= 0) {
      player.loadTrack(t.id, { autoPlay: true });
    } else {
      player.setQueue([t.id], 0, { autoPlay: true });
    }
    player.ui.openShare(t.id);

    // Keep URL clean after handling share param
    navigate("/", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackParam]);

  return (
    <MainLayout query={query} setQuery={setQuery}>
      <Routes>
        <Route path="/" element={<Home query={query} />} />
        <Route path="/explore" element={<Explore query={query} />} />
        <Route path="/library" element={<Library query={query} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** SPA entrypoint: router + global player provider. */
  return (
    <BrowserRouter>
      <PlayerProvider>
        <AppShell />
      </PlayerProvider>
    </BrowserRouter>
  );
}

export default App;
