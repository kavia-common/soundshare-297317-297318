import React from "react";

// PUBLIC_INTERFACE
export function Skeleton({ style }) {
  /** Simple animated skeleton bar/box. */
  return <div className="skeleton" style={style} aria-hidden="true" />;
}
