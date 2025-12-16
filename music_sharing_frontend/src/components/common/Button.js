import React from "react";

// PUBLIC_INTERFACE
export function Button({ variant = "primary", size = "md", leftIcon, rightIcon, className = "", ...props }) {
  /** Simple themed button. */
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {leftIcon ? <span className="btnIcon" aria-hidden="true">{leftIcon}</span> : null}
      <span className="btnLabel">{props.children}</span>
      {rightIcon ? <span className="btnIcon" aria-hidden="true">{rightIcon}</span> : null}
    </button>
  );
}
