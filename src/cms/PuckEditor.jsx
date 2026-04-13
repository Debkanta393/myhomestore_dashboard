import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Puck, useGetPuck } from "@measured/puck";
import "@measured/puck/puck.css";
import { config } from "./config.jsx";
import api from "../api/axios.js";
import { useParams } from "react-router-dom";
import {
  BREAKPOINT_OPTIONS,
  BreakpointProvider,
} from "./breakpointContext.jsx";

// ─── EMPTY data for a new page ───
const EMPTY_DATA = { content: [], root: { props: {} } };

function DrawerCapture({ children, drawerRef, onReady }) {
  useEffect(() => {
    drawerRef.current = children;
    onReady();
  }, [children]);
  return null;
}

function Tabs({ active, setActive }) {
  const tabs = ["Blocks", "Style", "Theme"];
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: 10,
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: `1px solid ${active === t ? "#c7d2fe" : "#e5e7eb"}`,
            background: active === t ? "#eef2ff" : "#fff",
            color: active === t ? "#3730a3" : "#374151",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            flex: 1,
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function ThemePanel({ theme, setTheme, customCss, setCustomCss, onMetaChange }) {
  const [draftCss, setDraftCss] = useState(customCss || "");

  useEffect(() => {
    setDraftCss(customCss || "");
  }, [customCss]);

  const set = (k, v) => {
    setTheme((prev) => ({ ...(prev || {}), [k]: v }));
    onMetaChange();
  };

  return (
    <div style={{ padding: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", marginBottom: 10 }}>
        Theme
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Primary color</span>
          <input
            type="color"
            value={theme?.primaryColor || "#4f46e5"}
            onChange={(e) => set("primaryColor", e.target.value)}
            style={{ width: 52, height: 34, padding: 2, border: "1px solid #e5e7eb", borderRadius: 10 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Font family</span>
          <input
            value={theme?.fontFamily || ""}
            onChange={(e) => set("fontFamily", e.target.value)}
            placeholder="Inter, system-ui, sans-serif"
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12, outline: "none" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Base background</span>
          <input
            type="color"
            value={theme?.baseBg || "#ffffff"}
            onChange={(e) => set("baseBg", e.target.value)}
            style={{ width: 52, height: 34, padding: 2, border: "1px solid #e5e7eb", borderRadius: 10 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Base text color</span>
          <input
            type="color"
            value={theme?.baseText || "#111827"}
            onChange={(e) => set("baseText", e.target.value)}
            style={{ width: 52, height: 34, padding: 2, border: "1px solid #e5e7eb", borderRadius: 10 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 14, fontSize: 12, fontWeight: 800, color: "#111827" }}>Custom CSS</div>
      <textarea
        value={draftCss}
        onChange={(e) => setDraftCss(e.target.value)}
        onBlur={() => {
          if (draftCss !== customCss) {
            setCustomCss(draftCss);
            onMetaChange();
          }
        }}
        placeholder={`/* Example */\n.hero-title { font-size: 48px; }`}
        style={{
          marginTop: 8,
          width: "100%",
          minHeight: 180,
          resize: "vertical",
          padding: 10,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          fontSize: 12,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          outline: "none",
          background: "#0b1220",
          color: "#e5e7eb",
        }}
      />
    </div>
  );
}

// ─── Custom Header ───
function CustomHeader({
  slug, setSlug, publishState, hasChanges,
  errorMsg, onPublish, onSlugChange, onLoad, loadState,
  title, setTitle, status, setStatus, onMetaChange,
  activeBreakpoint, setActiveBreakpoint,
}) {
  const getPuck = useGetPuck();
  const [titleDraft, setTitleDraft] = useState(title || "");
  const [slugDraft, setSlugDraft] = useState(slug || "");

  useEffect(() => {
    setTitleDraft(title || "");
  }, [title]);

  useEffect(() => {
    setSlugDraft(slug || "");
  }, [slug]);

  const commitTitle = useCallback(() => {
    if (titleDraft === title) return;
    setTitle(titleDraft);
    onMetaChange();
  }, [onMetaChange, setTitle, title, titleDraft]);

  const commitSlug = useCallback(() => {
    const normalized = (slugDraft || "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "");
    if (normalized !== slugDraft) {
      setSlugDraft(normalized);
    }
    if (normalized === slug) return;
    setSlug(normalized);
    onSlugChange();
  }, [onSlugChange, setSlug, slug, slugDraft]);

  const isDisabled =
    publishState === "saving" ||
    (publishState === "saved" && !hasChanges) ||
    !slugDraft.trim();

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

      {/* Title + Slug + Load */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 760 }}>
        <input
          type="text"
          placeholder="Page title"
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={commitTitle}
          style={{
            width: 220, padding: "6px 10px",
            border: "1px solid #d1d5db", borderRadius: 8,
            fontSize: 13, color: "#111827", background: "#f9fafb",
          }}
        />
        <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, whiteSpace: "nowrap" }}>Slug</label>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{
            position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af", fontSize: 13, pointerEvents: "none",
          }}>/</span>
          <input
            type="text"
            placeholder="home, about, contact..."
            value={slugDraft}
            onChange={(e) => setSlugDraft(e.target.value)}
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
              commitSlug();
              e.target.style.borderColor = "#d1d5db";
              e.target.style.boxShadow = "none";
              e.target.style.background = "#f9fafb";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitSlug();
                if (slugDraft.trim()) onLoad(slugDraft.trim());
              }
            }}
          />
        </div>

        <button
          onClick={() => {
            commitSlug();
            if (slugDraft.trim()) onLoad(slugDraft.trim());
          }}
          disabled={!slugDraft.trim() || loadState === "loading"}
          style={{
            padding: "6px 14px", borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "#f9fafb", color: "#374151",
            fontSize: 13, fontWeight: 500,
            cursor: !slug.trim() || loadState === "loading" ? "not-allowed" : "pointer",
            whiteSpace: "nowrap", flexShrink: 0,
            transition: "all 0.15s",
            opacity: !slugDraft.trim() ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (slugDraft.trim() && loadState !== "loading") {
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

        {/* status select drives the parent state directly */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            onMetaChange();
          }}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            fontSize: 13,
            color: "#374151",
          }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
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
        <span style={{ fontSize: 12, color: "#dc2626", flexShrink: 0 }}>Failed to load</span>
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

      <div
        style={{
          display: "inline-flex",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          overflow: "hidden",
          marginRight: 8,
          flexShrink: 0,
        }}
      >
        {BREAKPOINT_OPTIONS.map((bp) => (
          <button
            key={bp.key}
            onClick={() => setActiveBreakpoint(bp.key)}
            style={{
              border: "none",
              borderRight: bp.key !== "mobile" ? "1px solid #d1d5db" : "none",
              background: activeBreakpoint === bp.key ? "#eef2ff" : "#ffffff",
              color: activeBreakpoint === bp.key ? "#3730a3" : "#374151",
              fontSize: 12,
              fontWeight: 700,
              padding: "7px 10px",
              cursor: "pointer",
            }}
          >
            {bp.label}
          </button>
        ))}
      </div>

      {/* Inline publish error */}
      {publishState === "error" && errorMsg && (
        <span style={{ fontSize: 12, color: "#dc2626", maxWidth: 200, flexShrink: 0 }}>{errorMsg}</span>
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

// ─── Main Editor ───
export default function PuckEditor() {
  const params = useParams();
  const [slug, setSlug]                 = useState("");
  const [title, setTitle]               = useState("");
  const [status, setStatus]             = useState("draft");
  const [customCss, setCustomCss]       = useState("");
  const [theme, setTheme]               = useState({
    primaryColor: "#4f46e5",
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    baseBg: "#ffffff",
    baseText: "#111827",
  });

  const [puckData, setPuckData]         = useState(EMPTY_DATA);
  const [editorKey, setEditorKey]       = useState("init");

  const [publishState, setPublishState] = useState("idle");
  const [hasChanges, setHasChanges]     = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");
  const [loadState, setLoadState]       = useState("idle");
  const [sidebarTab, setSidebarTab]     = useState("Blocks");
  const [activeBreakpoint, setActiveBreakpoint] = useState("desktop");
  const drawerRef  = useRef(null);
  const [drawerReady, setDrawerReady]   = useState(false);

  const handleSlugChange = useCallback(() => {
    setLoadState("idle");
    setPublishState("idle");
  }, []);

  const handleChange = useCallback(() => {
    setHasChanges(true);
    setPublishState((prev) => (prev === "saved" ? "idle" : prev));
  }, []);

  const handleMetaChange = useCallback(() => {
    setHasChanges(true);
    setPublishState((prev) => (prev === "saved" ? "idle" : prev));
  }, []);

  const parseMaybeJson = (raw) => {
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch { return null; }
    }
    return raw;
  };

  const normalizeLoadedPayload = (json) => {
    const payload = json?.data || json?.page || json || {};
    const rawContent =
      payload?.content ?? json?.content ?? json?.data?.content ?? json?.page?.content;
    const parsedContent = parseMaybeJson(rawContent) || EMPTY_DATA;
    const embeddedMeta  = parsedContent?.root?.props?.__cmsMeta || {};

    return {
      data: parsedContent,
      meta: {
        title:     payload?.title     || json?.title     || embeddedMeta?.title     || "",
        status:   (payload?.status    || json?.status    || embeddedMeta?.status    || "draft").toLowerCase(),
        customCss: payload?.customCss || json?.customCss || embeddedMeta?.customCss || "",
        theme:     payload?.theme     || json?.theme     || embeddedMeta?.theme     || null,
      },
    };
  };

  const withMetaEmbedded = (data, currentStatus) => {
    const safeData = data || EMPTY_DATA;
    return {
      ...safeData,
      root: {
        ...(safeData.root || {}),
        props: {
          ...((safeData.root && safeData.root.props) || {}),
          __cmsMeta: {
            title:     title     || "",
            // Accept currentStatus parameter so the value is never stale
            status:    currentStatus || status || "draft",
            customCss: customCss || "",
            theme:     theme     || null,
          },
        },
      },
    };
  };

  const handleLoad = useCallback(async (pageSlug) => {
    setLoadState("loading");
    try {
      const res    = await api.get(`/api/page/page/${pageSlug}`);
      const loaded = normalizeLoadedPayload(res.data);

      const freshData = loaded.data || EMPTY_DATA;

      // Set puckData first, THEN change the key so Puck remounts
      setPuckData(freshData);
      setTitle(loaded.meta.title || "");
      setStatus(loaded.meta.status || "draft");
      setCustomCss(loaded.meta.customCss || "");
      if (loaded.meta.theme) {
        setTheme((prev) => ({ ...(prev || {}), ...(loaded.meta.theme || {}) }));
      }
      setLoadState("found");
      setHasChanges(false);
      setPublishState("idle");
      setEditorKey(`${pageSlug}-${Date.now()}`);

    } catch (err) {
      const httpStatus = err?.response?.status;
      if (httpStatus === 404) {
        setPuckData(EMPTY_DATA);
        setTitle("");
        setStatus("draft");
        setCustomCss("");
        setTheme({
          primaryColor: "#4f46e5",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          baseBg: "#ffffff",
          baseText: "#111827",
        });
        setLoadState("not_found");
        setHasChanges(false);
        setPublishState("idle");
        setEditorKey(`${pageSlug}-new-${Date.now()}`);
        return;
      }
      setLoadState("error");
      console.error("Load error:", err);
    }
  }, []);

  useEffect(() => {
    const routeSlug = (params?.slug || "").toString().trim();
    if (!routeSlug) return;
    setSlug(routeSlug);
    handleLoad(routeSlug);
  }, [params?.slug, handleLoad]);

  useEffect(() => {
    if (!title?.trim()) return;
    document.title = `${title} | CMS`;
  }, [title]);

  // handlePublish now receives the live status value directly
  // from the caller (via the ref pattern below) so it is never stale.
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);


  function renderToHTML(data) {
  if (!data?.content) return "";

  return data.content
    .map((block) => {
      switch (block.type) {
        case "Text":
          return `<p>${block.props.text || ""}</p>`;

        case "Heading":
          return `<h1>${block.props.text || ""}</h1>`;

        case "Image":
          return `<img src="${block.props.src}" alt="" />`;

        default:
          return "";
      }
    })
    .join("");
}


  const handlePublish = useCallback(async (data) => {
    if (!slug.trim()) return;
    setPublishState("saving");
    setErrorMsg("");
    console.log(statusRef.current)

    // Read the latest status from the ref — not the closure value.
    const currentStatus = statusRef.current;

    try {


      const payload = {
        slug:      slug.trim(),
        title:     title.trim() || slug.trim(),
        status:    currentStatus,
        customCss,
        theme,
        content:   withMetaEmbedded(data, currentStatus),
      };
      await api.post("/api/page/page", payload);
      setPublishState("saved");
      setHasChanges(false);
    } catch (err) {
      setPublishState("error");
      setErrorMsg(
        err?.response?.data?.message || err?.message || "Failed to publish. Try again.",
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, title, customCss, theme]);

  const overrides = useMemo(
    () => ({
      header: () => (
        <CustomHeader
          slug={slug}
          setSlug={setSlug}
          title={title}
          setTitle={setTitle}
          status={status}
          setStatus={setStatus}
          publishState={publishState}
          hasChanges={hasChanges}
          errorMsg={errorMsg}
          loadState={loadState}
          onPublish={handlePublish}
          onSlugChange={handleSlugChange}
          onLoad={handleLoad}
          onMetaChange={handleMetaChange}
          activeBreakpoint={activeBreakpoint}
          setActiveBreakpoint={setActiveBreakpoint}
        />
      ),
      drawer: ({ children }) => (
        <DrawerCapture
          drawerRef={drawerRef}
          onReady={() => setDrawerReady((prev) => (prev ? prev : true))}
        >
          {children}
        </DrawerCapture>
      ),
      fields: ({ children }) => (
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Tabs active={sidebarTab} setActive={setSidebarTab} />
          <div style={{ flex: 1, overflow: "auto" }}>
            {sidebarTab === "Blocks" ? (
              <div className="cms-blocks-grid" style={{ padding: 10, background: "#f8fafc" }}>
                <style>{`
                  .cms-blocks-grid ul,
                  .cms-blocks-grid [role="list"],
                  .cms-blocks-grid .puck-drawer-items {
                    display: grid !important;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 12px;
                    align-items: stretch;
                  }
                  .cms-blocks-grid li { list-style: none; margin: 0; padding: 0; }
                  .cms-blocks-grid li > button,
                  .cms-blocks-grid .puck-component-list-item,
                  .cms-blocks-grid [role="listitem"] > button {
                    width: 100%;
                    min-height: 96px;
                    padding: 14px 10px;
                    display: flex !important;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    text-align: center;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
                    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
                    transition: all 0.18s ease;
                    cursor: pointer;
                  }
                  .cms-blocks-grid li > button:hover,
                  .cms-blocks-grid .puck-component-list-item:hover,
                  .cms-blocks-grid [role="listitem"] > button:hover {
                    transform: translateY(-2px);
                    border-color: #c7d2fe;
                    box-shadow: 0 8px 20px rgba(79, 70, 229, 0.12);
                    background: #ffffff;
                  }
                  .cms-blocks-grid li > button:focus-visible,
                  .cms-blocks-grid .puck-component-list-item:focus-visible,
                  .cms-blocks-grid [role="listitem"] > button:focus-visible {
                    outline: 2px solid #4f46e5;
                    outline-offset: 2px;
                  }
                  @media (max-width: 1100px) {
                    .cms-blocks-grid ul,
                    .cms-blocks-grid [role="list"],
                    .cms-blocks-grid .puck-drawer-items {
                      grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                  }
                  @media (max-width: 720px) {
                    .cms-blocks-grid ul,
                    .cms-blocks-grid [role="list"],
                    .cms-blocks-grid .puck-drawer-items {
                      grid-template-columns: repeat(1, minmax(0, 1fr));
                    }
                  }
                `}</style>
                {drawerReady ? drawerRef.current : null}
              </div>
            ) : sidebarTab === "Style" ? (
              <div>{children}</div>
            ) : (
              <ThemePanel
                theme={theme}
                setTheme={setTheme}
                customCss={customCss}
                setCustomCss={setCustomCss}
                onMetaChange={handleMetaChange}
              />
            )}
          </div>
        </div>
      ),
      iframe: ({ children, document }) => {
        useEffect(() => {
          if (!document) return;
          const css = `
            :root {
              --cms-primary: ${theme?.primaryColor || "#4f46e5"};
              --cms-bg: ${theme?.baseBg || "#ffffff"};
              --cms-text: ${theme?.baseText || "#111827"};
            }
            body {
              background: var(--cms-bg);
              color: var(--cms-text);
              font-family: ${theme?.fontFamily || "Inter, system-ui, sans-serif"};
            }
            a { color: var(--cms-primary); }
            ${customCss || ""}
          `;
          let styleEl = document.getElementById("__cms_theme_style");
          if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "__cms_theme_style";
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = css;
        }, [document, theme, customCss]);

        const activeViewport = BREAKPOINT_OPTIONS.find(
          (item) => item.key === activeBreakpoint,
        ) || BREAKPOINT_OPTIONS[0];

        return (
          <div
            style={{
              width: activeViewport.width,
              maxWidth: "100%",
              margin: "0 auto",
              minHeight: "100%",
              transition: "width 0.2s ease",
            }}
          >
            {children}
          </div>
        );
      },
    }),
    [
      slug, title, status, publishState, hasChanges, errorMsg, loadState,
      handlePublish, handleSlugChange, handleLoad, handleMetaChange,
      sidebarTab, drawerReady, customCss, theme,
      activeBreakpoint,
    ],
  );

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {customCss?.trim() && <style>{customCss}</style>}
        <BreakpointProvider value={{ activeBreakpoint, setActiveBreakpoint }}>
          <Puck
            config={config}
            data={puckData}
            onChange={handleChange}
            onPublish={handlePublish}
            overrides={overrides}
            key={editorKey}
          />
        </BreakpointProvider>
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
