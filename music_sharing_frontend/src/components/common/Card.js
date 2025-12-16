import React from "react";

// PUBLIC_INTERFACE
export function Card({ className = "", ...props }) {
  /** Surface container. */
  return <div className={`card ${className}`} {...props} />;
}
