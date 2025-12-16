import React from "react";
import { Button } from "../common/Button";

// PUBLIC_INTERFACE
export function TopBar({ query, setQuery, onOpenQueue }) {
  /** Top search/navigation bar. */
  return (
    <header className="topbarInner">
      <div className="searchWrap">
        <span className="searchIcon" aria-hidden="true">⌕</span>
        <input
          className="searchInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks, artists, tags…"
          aria-label="Search"
        />
      </div>
      <div className="topbarActions">
        <Button variant="ghost" onClick={onOpenQueue} aria-label="Open queue">
          Queue
        </Button>
      </div>
    </header>
  );
}
