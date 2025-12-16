import { getFrontendOrigin } from "../config/env";

// PUBLIC_INTERFACE
export function buildTrackShareUrl(trackId) {
  /** Builds a shareable URL for a track. */
  const origin = getFrontendOrigin();
  const base = origin || "";
  if (!base) return "";
  return `${base}/?track=${encodeURIComponent(trackId)}`;
}

// PUBLIC_INTERFACE
export async function copyToClipboard(text) {
  /** Copies text to clipboard with best-effort fallbacks. */
  if (!text) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallthrough
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export async function webShare({ title, text, url }) {
  /** Uses Web Share API when available. Returns boolean success. */
  try {
    if (navigator?.share) {
      await navigator.share({ title, text, url });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

// PUBLIC_INTERFACE
export function buildEmbedSnippet({ title, embedUrl }) {
  /** Returns an embeddable iframe snippet if embedUrl exists. */
  if (!embedUrl) return "";
  const safeTitle = (title || "Track").replace(/"/g, "&quot;");
  return `<iframe title="${safeTitle}" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="${embedUrl}"></iframe>`;
}
