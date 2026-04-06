// src/cms/styleFields.js
import { FieldLabel } from "@measured/puck";

// ─── Custom Color Picker field ──────────────────────────────────────────────
export const colorPickerField = (label) => ({
  type: "custom",
  label,
  render: ({ value, onChange, field }) => (
    <FieldLabel label={field.label}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 40, height: 32, padding: 2, border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
        />
        <input
          type="text"
          value={value || ""}
          placeholder="hex / rgba / transparent"
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: "4px 8px", border: "1px solid #ddd", borderRadius: 4, fontSize: 12 }}
        />
      </div>
    </FieldLabel>
  ),
});

// ─── Background Image field with preview ───────────────────────────────────
export const backgroundImageField = {
  type: "custom",
  label: "Background Image URL",
  render: ({ value, onChange, field }) => (
    <FieldLabel label={field.label}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <input
          type="text"
          value={value || ""}
          placeholder="https://example.com/image.jpg"
          onChange={(e) => onChange(e.target.value)}
          style={{ padding: "4px 8px", border: "1px solid #ddd", borderRadius: 4, fontSize: 12 }}
        />
        {value && (
          <img
            src={value}
            alt="preview"
            style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
          />
        )}
      </div>
    </FieldLabel>
  ),
};

// ─── Font Family field ──────────────────────────────────────────────────────
const FONT_FAMILIES = [
  "Default",
  "Arial",
  "Helvetica Neue",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Inter",
  "Nunito",
  "Raleway",
  "Playfair Display",
  "Merriweather",
  "Ubuntu",
  "Source Code Pro",
];

export const fontFamilyField = {
  type: "custom",
  label: "Font Family",
  render: ({ value, onChange, field }) => (
    <FieldLabel label={field.label}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <select
          value={value || "Default"}
          onChange={(e) => onChange(e.target.value === "Default" ? "" : e.target.value)}
          style={{ padding: "4px 8px", border: "1px solid #ddd", borderRadius: 4, fontSize: 12 }}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f} style={{ fontFamily: f }}>
              {f}
            </option>
          ))}
        </select>
        {value && value !== "Default" && (
          <p style={{ fontFamily: value, fontSize: 14, padding: "4px 0", color: "#555" }}>
            The quick brown fox
          </p>
        )}
      </div>
    </FieldLabel>
  ),
};

// ─── Select field helper ────────────────────────────────────────────────────
export const selectField = (label, options) => ({
  type: "select",
  label,
  options: options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o
  ),
});

// ─── Spacing fields ─────────────────────────────────────────────────────────
export const spacingFields = {
  paddingTop:    { type: "number", label: "Padding Top (px)" },
  paddingBottom: { type: "number", label: "Padding Bottom (px)" },
  paddingLeft:   { type: "number", label: "Padding Left (px)" },
  paddingRight:  { type: "number", label: "Padding Right (px)" },
  marginTop:     { type: "number", label: "Margin Top (px)" },
  marginBottom:  { type: "number", label: "Margin Bottom (px)" },
  marginLeft:    { type: "number", label: "Margin Left (px)" },
  marginRight:   { type: "number", label: "Margin Right (px)" },
};

// ─── Background fields ───────────────────────────────────────────────────────
export const backgroundFields = {
  backgroundColor: colorPickerField("Background Color"),
  backgroundImage: backgroundImageField,
  backgroundSize: selectField("Background Size", ["cover", "contain", "auto", "100% 100%"]),
  backgroundPosition: selectField("Background Position", [
    "center", "top", "bottom", "left", "right",
    "top left", "top right", "bottom left", "bottom right",
  ]),
  backgroundRepeat: selectField("Background Repeat", [
    "no-repeat", "repeat", "repeat-x", "repeat-y",
  ]),
  overlayColor: colorPickerField("Overlay Color"),
};

// ─── Typography fields ───────────────────────────────────────────────────────
export const typographyFields = {
  color:         colorPickerField("Text Color"),
  fontSize:      { type: "number", label: "Font Size (px)" },
  fontWeight: selectField("Font Weight", [
    { label: "Thin (100)",       value: "100" },
    { label: "Light (300)",      value: "300" },
    { label: "Normal (400)",     value: "400" },
    { label: "Medium (500)",     value: "500" },
    { label: "Semi Bold (600)",  value: "600" },
    { label: "Bold (700)",       value: "700" },
    { label: "Extra Bold (800)", value: "800" },
    { label: "Black (900)",      value: "900" },
  ]),
  fontFamily:   fontFamilyField,
  fontStyle: selectField("Font Style", ["normal", "italic", "oblique"]),
  textAlign: selectField("Text Align", ["left", "center", "right", "justify"]),
  textTransform: selectField("Text Transform", [
    "none", "uppercase", "lowercase", "capitalize",
  ]),
  textDecoration: selectField("Text Decoration", [
    "none", "underline", "line-through", "overline",
  ]),
  lineHeight:    { type: "number", label: "Line Height" },
  letterSpacing: { type: "number", label: "Letter Spacing (px)" },
  wordSpacing:   { type: "number", label: "Word Spacing (px)" },
};

// ─── Border fields ───────────────────────────────────────────────────────────
export const borderFields = {
  borderRadius:        { type: "number", label: "Border Radius (px)" },
  borderTopLeftRadius: { type: "number", label: "Border Radius TL (px)" },
  borderTopRightRadius:{ type: "number", label: "Border Radius TR (px)" },
  borderBottomLeftRadius:  { type: "number", label: "Border Radius BL (px)" },
  borderBottomRightRadius: { type: "number", label: "Border Radius BR (px)" },
  borderWidth:  { type: "number", label: "Border Width (px)" },
  borderColor:  colorPickerField("Border Color"),
  borderStyle:  selectField("Border Style", ["none", "solid", "dashed", "dotted", "double", "groove"]),
};

// ─── Layout fields ───────────────────────────────────────────────────────────
export const layoutFields = {
  display: selectField("Display", [
    "block", "flex", "grid", "inline", "inline-block", "inline-flex", "none",
  ]),
  flexDirection: selectField("Flex Direction", [
    "row", "row-reverse", "column", "column-reverse",
  ]),
  alignItems: selectField("Align Items", [
    "flex-start", "flex-end", "center", "stretch", "baseline",
  ]),
  justifyContent: selectField("Justify Content", [
    "flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly",
  ]),
  flexWrap: selectField("Flex Wrap", ["nowrap", "wrap", "wrap-reverse"]),
  gap:      { type: "number", label: "Gap (px)" },
  gridTemplateColumns: { type: "text", label: "Grid Template Columns (e.g. 1fr 1fr)" },
  width:    { type: "text", label: "Width (px, %, auto)" },
  maxWidth: { type: "text", label: "Max Width (px, %, auto)" },
  minWidth: { type: "text", label: "Min Width (px, %)" },
  height:   { type: "text", label: "Height (px, %, auto)" },
  maxHeight:{ type: "text", label: "Max Height (px, %)" },
  minHeight:{ type: "text", label: "Min Height (px, %)" },
  overflow: selectField("Overflow", ["visible", "hidden", "scroll", "auto"]),
  overflowX: selectField("Overflow X", ["visible", "hidden", "scroll", "auto"]),
  overflowY: selectField("Overflow Y", ["visible", "hidden", "scroll", "auto"]),
};

// ─── Position fields ─────────────────────────────────────────────────────────
export const positionFields = {
  position: selectField("Position", [
    "static", "relative", "absolute", "fixed", "sticky",
  ]),
  top:    { type: "text", label: "Top (px, %)" },
  right:  { type: "text", label: "Right (px, %)" },
  bottom: { type: "text", label: "Bottom (px, %)" },
  left:   { type: "text", label: "Left (px, %)" },
  zIndex: { type: "number", label: "Z-Index" },
};

// ─── Effects fields ──────────────────────────────────────────────────────────
export const effectFields = {
  opacity:    { type: "number", label: "Opacity (0–1)" },
  boxShadow: selectField("Box Shadow", [
    { label: "None",   value: "none" },
    { label: "Small",  value: "0 1px 3px rgba(0,0,0,0.12)" },
    { label: "Medium", value: "0 4px 12px rgba(0,0,0,0.15)" },
    { label: "Large",  value: "0 8px 24px rgba(0,0,0,0.2)" },
    { label: "XL",     value: "0 20px 60px rgba(0,0,0,0.25)" },
    { label: "Inner",  value: "inset 0 2px 6px rgba(0,0,0,0.1)" },
  ]),
  cursor: selectField("Cursor", [
    "default", "pointer", "move", "text", "not-allowed", "grab",
  ]),
  transition: selectField("Transition", [
    { label: "None",   value: "none" },
    { label: "Fast",   value: "all 0.15s ease" },
    { label: "Normal", value: "all 0.3s ease" },
    { label: "Slow",   value: "all 0.6s ease" },
  ]),
};

// ─── Master style builder ────────────────────────────────────────────────────
export const buildStyle = (props) => {
  const px = (v) => (v !== undefined && v !== "" ? `${v}px` : undefined);
  return {
    // Spacing
    paddingTop:    px(props.paddingTop),
    paddingBottom: px(props.paddingBottom),
    paddingLeft:   px(props.paddingLeft),
    paddingRight:  px(props.paddingRight),
    marginTop:     px(props.marginTop),
    marginBottom:  px(props.marginBottom),
    marginLeft:    px(props.marginLeft),
    marginRight:   px(props.marginRight),
    // Background
    backgroundColor:    props.backgroundColor  || undefined,
    backgroundImage:    props.backgroundImage  ? `url(${props.backgroundImage})` : undefined,
    backgroundSize:     props.backgroundSize   || undefined,
    backgroundPosition: props.backgroundPosition || undefined,
    backgroundRepeat:   props.backgroundRepeat || undefined,
    // Typography
    color:          props.color         || undefined,
    fontSize:       px(props.fontSize),
    fontWeight:     props.fontWeight    || undefined,
    fontFamily:     props.fontFamily    || undefined,
    fontStyle:      props.fontStyle     || undefined,
    textAlign:      props.textAlign     || undefined,
    textTransform:  props.textTransform || undefined,
    textDecoration: props.textDecoration || undefined,
    lineHeight:     props.lineHeight    || undefined,
    letterSpacing:  px(props.letterSpacing),
    wordSpacing:    px(props.wordSpacing),
    // Border
    borderRadius:   px(props.borderRadius),
    borderTopLeftRadius:     px(props.borderTopLeftRadius),
    borderTopRightRadius:    px(props.borderTopRightRadius),
    borderBottomLeftRadius:  px(props.borderBottomLeftRadius),
    borderBottomRightRadius: px(props.borderBottomRightRadius),
    borderWidth:    px(props.borderWidth),
    borderColor:    props.borderColor   || undefined,
    borderStyle:    props.borderStyle   || undefined,
    // Layout
    display:              props.display              || undefined,
    flexDirection:        props.flexDirection        || undefined,
    alignItems:           props.alignItems           || undefined,
    justifyContent:       props.justifyContent       || undefined,
    flexWrap:             props.flexWrap             || undefined,
    gap:                  px(props.gap),
    gridTemplateColumns:  props.gridTemplateColumns  || undefined,
    width:                props.width                || undefined,
    maxWidth:             props.maxWidth             || undefined,
    minWidth:             props.minWidth             || undefined,
    height:               props.height               || undefined,
    maxHeight:            props.maxHeight            || undefined,
    minHeight:            props.minHeight            || undefined,
    overflow:             props.overflow             || undefined,
    overflowX:            props.overflowX            || undefined,
    overflowY:            props.overflowY            || undefined,
    // Position
    position: props.position !== "static" ? props.position : undefined,
    top:      props.top    || undefined,
    right:    props.right  || undefined,
    bottom:   props.bottom || undefined,
    left:     props.left   || undefined,
    zIndex:   props.zIndex || undefined,
    // Effects
    opacity:    props.opacity    !== undefined ? props.opacity    : undefined,
    boxShadow:  props.boxShadow  || undefined,
    cursor:     props.cursor     || undefined,
    transition: props.transition || undefined,
  };
};

// ─── Overlay component ───────────────────────────────────────────────────────
export const Overlay = ({ color }) =>
  color ? (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  ) : null;