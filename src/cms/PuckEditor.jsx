import { useState, useCallback, useMemo } from "react";
import { Puck, useGetPuck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "./config.jsx";

// ─── EMPTY data for a brand new page ─────────────────────────────────────────
const EMPTY_DATA = { content: [], root: { props: {} } };

// ─── Custom Header (inside Puck tree so useGetPuck works) ─────────────────────
function CustomHeader({
  slug, setSlug, publishState, hasChanges,
  errorMsg, onPublish, onSlugChange, onLoad, loadState,
}) {
  const getPuck = useGetPuck();

  const isDisabled =
    publishState === "saving" ||
    (publishState === "saved" && !hasChanges) ||
    !slug.trim();

  const statusConfig = {
    idle:   { label: "Publish",     color: "#2563eb" },
    saving: { label: "Saving…",     color: "#6b7280" },
    saved:  { label: "Published ✓", color: "#16a34a" },
    error:  { label: "Retry",       color: "#dc2626" },
  };
  const current = statusConfig[publishState] || statusConfig.idle;

  const handlePublishClick = () => {
    if (isDisabled) return;
    const { appState } = getPuck();
    onPublish(appState.data);
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "0 20px", height: 52,
      background: "#ffffff", borderBottom: "1px solid #e5e7eb",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      width: "100%", boxSizing: "border-box",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, color: "#fff", fontWeight: 800,
        }}>P</div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Page Builder</span>
      </div>

      <div style={{ width: 1, height: 24, background: "#e5e7eb", flexShrink: 0 }} />

      {/* Slug Input + Load Button */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 440 }}>
        <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap" }}>
          Page Slug
        </label>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{
            position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af", fontSize: 13, pointerEvents: "none",
          }}>/</span>
          <input
            type="text"
            placeholder="home, about, contact..."
            value={slug}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "");
              setSlug(val);
              onSlugChange();
            }}
            style={{
              width: "200px", paddingLeft: 24, paddingRight: 12,
              paddingTop: 6, paddingBottom: 6,
              border: "1px solid #d1d5db", borderRadius: 8,
              fontSize: 13, color: "#111827", outline: "none",
              background: "#f9fafb", boxSizing: "border-box",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#2563eb";
              e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
              e.target.style.background = "#fff";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#d1d5db";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#f9fafb";
            }}
            // ✅ Press Enter to load the page
            onKeyDown={(e) => {
              if (e.key === "Enter" && slug.trim()) onLoad(slug.trim());
            }}
          />
        </div>

        {/* ✅ Load/Edit button — fetches existing page data */}
        <button
          onClick={() => { if (slug.trim()) onLoad(slug.trim()); }}
          disabled={!slug.trim() || loadState === "loading"}
          style={{
            padding: "6px 14px", borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "#f9fafb", color: "#374151",
            fontSize: 13, fontWeight: 500,
            cursor: !slug.trim() || loadState === "loading" ? "not-allowed" : "pointer",
            whiteSpace: "nowrap", flexShrink: 0,
            transition: "all 0.15s",
            opacity: !slug.trim() ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (slug.trim() && loadState !== "loading") {
              e.currentTarget.style.background = "#f3f4f6";
              e.currentTarget.style.borderColor = "#9ca3af";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
        >
          {loadState === "loading" ? "Loading…" : "Load Page"}
        </button>
      </div>

      {/* Load status messages */}
      {loadState === "found" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          fontSize: 12, color: "#166534",
          background: "#dcfce7", padding: "4px 10px",
          borderRadius: 20, border: "1px solid #bbf7d0", flexShrink: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          Page loaded
        </div>
      )}
      {loadState === "not_found" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          fontSize: 12, color: "#92400e",
          background: "#fef3c7", padding: "4px 10px",
          borderRadius: 20, border: "1px solid #fde68a", flexShrink: 0,
        }}>
          New page
        </div>
      )}
      {loadState === "error" && (
        <span style={{ fontSize: 12, color: "#dc2626", flexShrink: 0 }}>
          Failed to load
        </span>
      )}

      <div style={{ flex: 1 }} />

      {/* Unsaved badge */}
      {hasChanges && publishState !== "saving" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          fontSize: 12, color: "#b45309",
          background: "#fef3c7", padding: "4px 10px",
          borderRadius: 20, border: "1px solid #fde68a", flexShrink: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
          Unsaved changes
        </div>
      )}

      {/* Inline publish error */}
      {publishState === "error" && errorMsg && (
        <span style={{ fontSize: 12, color: "#dc2626", maxWidth: 200, flexShrink: 0 }}>
          {errorMsg}
        </span>
      )}

      {/* Publish Button */}
      <button
        disabled={isDisabled}
        onClick={handlePublishClick}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "8px 20px", borderRadius: 8, border: "none",
          background:
            isDisabled && publishState === "saved" ? "#dcfce7" :
            isDisabled ? "#f3f4f6" : current.color,
          color:
            isDisabled && publishState === "saved" ? "#16a34a" :
            isDisabled ? "#9ca3af" : "#ffffff",
          fontSize: 13, fontWeight: 600,
          cursor: isDisabled ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          boxShadow: isDisabled ? "none" : "0 1px 3px rgba(0,0,0,0.15)",
          minWidth: 120, whiteSpace: "nowrap", flexShrink: 0,
        }}
        onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.filter = "brightness(0.9)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
      >
        {current.label}
      </button>
    </div>
  );
}

// ─── Main Editor ─────────────────────────────────────────────────────────────
export default function PuckEditor() {
  const [slug, setSlug]                 = useState("");
  const [puckData, setPuckData]         = useState(EMPTY_DATA); // ✅ loaded page data
  const [publishState, setPublishState] = useState("idle");
  const [hasChanges, setHasChanges]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");
  const [loadState, setLoadState]       = useState("idle");
  // "idle" | "loading" | "found" | "not_found" | "error"

  const handleSlugChange = useCallback(() => {
    // Slug changed — reset load state, don't mark as unsaved
    setLoadState("idle");
    setPublishState("idle");
  }, []);

  const handleChange = useCallback(() => {
    setHasChanges(true);
    setPublishState((prev) => (prev === "saved" ? "idle" : prev));
  }, []);

  // ✅ Load existing page from backend by slug
  const handleLoad = useCallback(async (pageSlug) => {
    setLoadState("loading");
    try {
      const res = await fetch(`http://localhost:5000/api/page/${pageSlug}`);

      if (res.status === 404) {
        // Page doesn't exist yet — start fresh
        setPuckData(EMPTY_DATA);
        setLoadState("not_found");
        setHasChanges(false);
        setPublishState("idle");
        return;
      }

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const json = await res.json();
      // ✅ Pass the saved Puck data back into the editor
      // Your backend should return { content: data } where data is the Puck Data object
      setPuckData(json.content || EMPTY_DATA);
      setLoadState("found");
      setHasChanges(false);
      setPublishState("idle");
    } catch (err) {
      setLoadState("error");
      console.error("Load error:", err);
    }
  }, []);

  const handlePublish = useCallback(async (data) => {
    if (!slug.trim()) return;
    setPublishState("saving");
    setErrorMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug.trim(), content: data }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setPublishState("saved");
      setHasChanges(false);
    } catch (err) {
      setPublishState("error");
      setErrorMsg(err.message || "Failed to publish. Try again.");
    }
  }, [slug]);

  // ✅ useMemo keeps overrides stable — prevents header remount on state change
  const overrides = useMemo(() => ({
    header: () => (
      <CustomHeader
        slug={slug}
        setSlug={setSlug}
        publishState={publishState}
        hasChanges={hasChanges}
        errorMsg={errorMsg}
        loadState={loadState}
        onPublish={handlePublish}
        onSlugChange={handleSlugChange}
        onLoad={handleLoad}
      />
    ),
  }), [slug, publishState, hasChanges, errorMsg, loadState, handlePublish, handleSlugChange, handleLoad]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Puck
          config={config}
          data={puckData}        // ✅ driven by state — updates when page is loaded
          onChange={handleChange}
          onPublish={handlePublish}
          overrides={overrides}
          key={slug + loadState} // ✅ remount Puck only when a different page is loaded
        />
      </div>

      {/* Success Toast */}
      {publishState === "saved" && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#fff",
          border: "1px solid #bbf7d0", borderLeft: "4px solid #16a34a",
          borderRadius: 10, padding: "14px 20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 12,
          fontSize: 13, color: "#111827", fontWeight: 500,
          zIndex: 9999, animation: "slideIn 0.25s ease",
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Page published!</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>/{slug} saved successfully</div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {publishState === "error" && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#fff",
          border: "1px solid #fecaca", borderLeft: "4px solid #dc2626",
          borderRadius: 10, padding: "14px 20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 12,
          fontSize: 13, zIndex: 9999, animation: "slideIn 0.25s ease",
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 2 }}>Publish failed</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>{errorMsg}</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}