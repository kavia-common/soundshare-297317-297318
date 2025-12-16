import React from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { PlayerDock } from "../player/PlayerDock";
import { QueueDrawer } from "../player/QueueDrawer";
import { ShareSheet } from "../share/ShareSheet";
import { usePlayer } from "../../context/PlayerContext";

// PUBLIC_INTERFACE
export function MainLayout({ children, query, setQuery }) {
  /** App chrome: sidebar + topbar + main content + persistent bottom player. */
  const player = usePlayer();

  return (
    <div className="appRoot">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <div className="topbar">
        <TopBar
          query={query}
          setQuery={setQuery}
          onOpenQueue={() => player.ui.setQueueOpen(true)}
        />
      </div>

      <main className="main" role="main">
        {children}
      </main>

      <div className="playerDock">
        <PlayerDock />
      </div>

      <QueueDrawer open={player.ui.queueOpen} onClose={() => player.ui.setQueueOpen(false)} />
      <ShareSheet />
    </div>
  );
}
