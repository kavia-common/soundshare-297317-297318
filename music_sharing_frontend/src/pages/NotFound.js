import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function NotFound() {
  /** 404 route. */
  return (
    <div className="container">
      <div className="pageTitle">
        <div>
          <h1>404</h1>
          <p>That page doesn’t exist.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <p className="muted">Try going back to Home.</p>
        <Link className="link" to="/">
          Go to Home →
        </Link>
      </div>
    </div>
  );
}
