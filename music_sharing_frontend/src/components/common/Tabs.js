import React from "react";

// PUBLIC_INTERFACE
export function Tabs({ tabs, activeKey, onChange }) {
  /** Lightweight tabs. */
  return (
    <div className="tabs" role="tablist" aria-label="Tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={activeKey === t.key}
          className={`tab ${activeKey === t.key ? "isActive" : ""}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
