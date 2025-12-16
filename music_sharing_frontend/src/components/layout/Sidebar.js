import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
export function Sidebar() {
  /** Left navigation sidebar. */
  return (
    <aside className="sidebarInner" aria-label="Primary navigation">
      <div className="brand">
        <div className="brandMark" aria-hidden="true">SS</div>
        <div className="brandText">
          <div className="brandName">SoundShare</div>
          <div className="brandTag">Power Red</div>
        </div>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
          <span aria-hidden="true">🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
          <span aria-hidden="true">🔎</span>
          <span>Explore</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}>
          <span aria-hidden="true">🎚️</span>
          <span>Library</span>
        </NavLink>
      </nav>

      <div className="sidebarFoot">
        <div className="hintTitle">Hotkeys</div>
        <div className="hintLine"><kbd>Space</kbd> Play/Pause</div>
        <div className="hintLine"><kbd>←</kbd>/<kbd>→</kbd> Seek</div>
        <div className="hintLine"><kbd>M</kbd> Mute</div>
        <div className="hintLine"><kbd>L</kbd> Like</div>
      </div>
    </aside>
  );
}
