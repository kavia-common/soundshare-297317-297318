import React, { useMemo, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { trackById } from "../../data/mockTracks";
import { buildEmbedSnippet, buildTrackShareUrl, copyToClipboard, webShare } from "../../utils/share";
import { Button } from "../common/Button";
import { Tabs } from "../common/Tabs";
import { Toast } from "../common/Toast";

// PUBLIC_INTERFACE
export function ShareSheet() {
  /** Bottom-right modal share sheet for tracks. */
  const player = usePlayer();
  const { open, trackId } = player.ui.share;
  const track = trackId ? trackById(trackId) : null;

  const [tab, setTab] = useState("link");
  const [toast, setToast] = useState({ open: false, msg: "" });

  const shareUrl = useMemo(() => buildTrackShareUrl(trackId), [trackId]);
  const embed = useMemo(() => buildEmbedSnippet({ title: track?.title, embedUrl: track?.embedUrl }), [track]);

  if (!open || !track) return null;

  return (
    <>
      <div className="sheetOverlay" role="dialog" aria-modal="true" aria-label="Share">
        <div className="sheet">
          <div className="sheetHead">
            <div>
              <div className="sheetTitle">Share</div>
              <div className="sheetSub">{track.title} • {track.artist}</div>
            </div>
            <Button variant="ghost" onClick={player.ui.closeShare}>Close</Button>
          </div>

          <Tabs
            tabs={[
              { key: "link", label: "Link" },
              { key: "embed", label: "Embed" },
            ]}
            activeKey={tab}
            onChange={setTab}
          />

          {tab === "link" ? (
            <div className="sheetBody">
              <label className="field">
                <div className="fieldLabel">Share link</div>
                <input className="fieldInput" value={shareUrl} readOnly aria-label="Share link" />
              </label>

              <div className="sheetBtns">
                <Button
                  variant="primary"
                  onClick={async () => {
                    const ok = await copyToClipboard(shareUrl);
                    setToast({ open: true, msg: ok ? "Link copied" : "Copy failed" });
                  }}
                >
                  Copy link
                </Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    const ok = await webShare({
                      title: track.title,
                      text: `Listen to ${track.title} by ${track.artist}`,
                      url: shareUrl,
                    });
                    setToast({ open: true, msg: ok ? "Shared" : "Web Share not available" });
                  }}
                >
                  Share…
                </Button>
              </div>

              <div className="muted small">
                If REACT_APP_FRONTEND_URL is not set, the app uses your current origin for links.
              </div>
            </div>
          ) : (
            <div className="sheetBody">
              {embed ? (
                <>
                  <label className="field">
                    <div className="fieldLabel">Embed code</div>
                    <textarea className="fieldArea" value={embed} readOnly aria-label="Embed snippet" />
                  </label>
                  <div className="sheetBtns">
                    <Button
                      variant="primary"
                      onClick={async () => {
                        const ok = await copyToClipboard(embed);
                        setToast({ open: true, msg: ok ? "Embed copied" : "Copy failed" });
                      }}
                    >
                      Copy embed
                    </Button>
                  </div>
                </>
              ) : (
                <div className="emptyState">This track does not provide an embedUrl.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <Toast
        open={toast.open}
        message={toast.msg}
        onClose={() => setToast({ open: false, msg: "" })}
      />
    </>
  );
}
