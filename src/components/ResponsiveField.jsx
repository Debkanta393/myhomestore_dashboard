// components/ResponsiveField.jsx
import React from "react";
import { useBreakpoint } from "../cms/breakpointContext.jsx";
import { Tablet, Laptop, Smartphone } from "lucide-react";

const BREAKPOINTS = [
  { key: "desktop", label: <Laptop />, title: "Desktop (≥1025px)" },
  { key: "tablet",  label: <Tablet />, title: "Tablet (≤1024px)" },
  { key: "mobile",  label: <Smartphone />, title: "Mobile (≤768px)" },
];

export function ResponsiveField({
  value = {},
  onChange,
  inputType = "text",
  options,
  placeholder,
}) {
  // Single source of truth — driven by the header toolbar
  const { activeBreakpoint, setActiveBreakpoint } = useBreakpoint();
  const currentBp = activeBreakpoint || "desktop";

  const currentVal =
    typeof value === "object" && value !== null
      ? (value[currentBp] ?? "")
      : value ?? "";

  const handleChange = (newVal) => {
    const prev = typeof value === "object" && value !== null ? value : {};
    onChange({ ...prev, [currentBp]: newVal });
  };

  const inputStyle = {
    width: "100%",
    padding: "6px 8px",
    fontSize: 13,
    border: "1px solid #d1d5db",
    borderRadius: 4,
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {/* Breakpoint switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
        {BREAKPOINTS.map((bp) => {
          const hasVal =
            typeof value === "object" &&
            value !== null &&
            value[bp.key] !== undefined &&
            value[bp.key] !== "";
          const isActive = currentBp === bp.key;
          return (
            <button
              key={bp.key}
              type="button"               // ← fix: prevent accidental form submit
              title={bp.title}
              onClick={() => setActiveBreakpoint(bp.key)}   // ← fix: update global context
              style={{
                padding: "2px 8px",
                fontSize: 13,
                border: "1px solid",
                borderColor: isActive ? "#2563eb" : "#d1d5db",
                borderRadius: 4,
                background: isActive ? "#eff6ff" : "#f9fafb",
                color: isActive ? "#1d4ed8" : "#374151",
                cursor: "pointer",
                fontWeight: isActive ? 700 : 400,
                position: "relative",
              }}
            >
              {bp.label}
              {hasVal && (
                <span style={{
                  position: "absolute",
                  top: 1, right: 2,
                  width: 5, height: 5,
                  borderRadius: "50%",
                  background: "#2563eb",
                  display: "block",
                }} />
              )}
            </button>
          );
        })}
        <span style={{ fontSize: 11, color: "#9ca3af", alignSelf: "center", marginLeft: 2 }}>
          {BREAKPOINTS.find((b) => b.key === currentBp)?.title}
        </span>
      </div>

      {/* Input */}
      {inputType === "select" && (
        <select value={currentVal} onChange={(e) => handleChange(e.target.value)} style={inputStyle}>
          <option value="">— inherit —</option>
          {options?.map((opt) => (
            <option key={opt.value ?? opt.label} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}
      {inputType === "textarea" && (
        <textarea
          value={currentVal}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      )}
      {(inputType === "text" || inputType === "number") && (
        <input
          type={inputType}
          value={currentVal}
          onChange={(e) => {
            if (inputType === "number") {
              handleChange(e.target.value === "" ? "" : Number(e.target.value));
              return;
            }
            handleChange(e.target.value);
          }}
          placeholder={
            placeholder ?? (currentBp !== "desktop" ? "leave blank = inherit desktop" : "")
          }
          style={inputStyle}
        />
      )}
    </div>
  );
}