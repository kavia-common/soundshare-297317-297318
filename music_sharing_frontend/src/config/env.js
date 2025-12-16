/**
 * Centralized environment configuration.
 * All env usage should go through this module to keep the app consistent.
 */

const readString = (key, fallback = "") => {
  const v = process.env[key];
  if (typeof v === "string" && v.trim().length > 0) return v;
  return fallback;
};

const readBool = (key, fallback = false) => {
  const v = process.env[key];
  if (typeof v !== "string") return fallback;
  const normalized = v.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
};

const parseCsvFlags = (csv) => {
  if (!csv || typeof csv !== "string") return new Set();
  return new Set(
    csv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
};

const FEATURE_FLAGS = parseCsvFlags(readString("REACT_APP_FEATURE_FLAGS", ""));

// PUBLIC_INTERFACE
export const env = {
  /** Build-time environment hints */
  nodeEnv: readString("REACT_APP_NODE_ENV", process.env.NODE_ENV || "development"),
  logLevel: readString("REACT_APP_LOG_LEVEL", "info"),

  /** Optional endpoints (not used for network calls in this frontend-only app) */
  apiBase: readString("REACT_APP_API_BASE", ""),
  backendUrl: readString("REACT_APP_BACKEND_URL", ""),
  wsUrl: readString("REACT_APP_WS_URL", ""),

  /** Used for generating share links. Falls back to window.location.origin at runtime. */
  frontendUrl: readString("REACT_APP_FRONTEND_URL", ""),

  /** Misc switches */
  experimentsEnabled: readBool("REACT_APP_EXPERIMENTS_ENABLED", false),
  enableSourceMaps: readBool("REACT_APP_ENABLE_SOURCE_MAPS", true),
  nextTelemetryDisabled: readBool("REACT_APP_NEXT_TELEMETRY_DISABLED", true),

  /** Feature flags (CSV) */
  flags: {
    // Keep names stable; toggle using REACT_APP_FEATURE_FLAGS="queue,share,hotkeys"
    has(name) {
      return FEATURE_FLAGS.has(name);
    },
  },
};

// PUBLIC_INTERFACE
export function getFrontendOrigin() {
  /** Returns configured frontend base URL or safe runtime origin fallback. */
  if (env.frontendUrl && env.frontendUrl.trim()) return env.frontendUrl.trim();
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}
