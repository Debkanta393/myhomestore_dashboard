// src/cms/styleFields.js
import { desktopVal, buildResponsiveCss } from "../lib/resolveResponsive.js";
import { ResponsiveField } from "../components/ResponsiveField.jsx";

const responsiveTextField = (label, placeholder = "") => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => (
    <ResponsiveField
      value={value}
      onChange={onChange}
      inputType="text"
      placeholder={placeholder}
    />
  ),
});

const responsiveNumberField = (label) => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => (
    <ResponsiveField value={value} onChange={onChange} inputType="number" />
  ),
});

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
  render: ({ value, onChange }) => (
    <ResponsiveField
      value={value}
      onChange={onChange}
      inputType="select"
      options={FONT_FAMILIES.map((f) => ({ label: f, value: f === "Default" ? "" : f }))}
    />
  ),
};

// ─── Select field helper ────────────────────────────────────────────────────
export const selectField = (label, options) => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => (
    <ResponsiveField
      value={value}
      onChange={onChange}
      inputType="select"
      options={options.map((o) => (typeof o === "string" ? { label: o, value: o } : o))}
    />
  ),
});

// ─── Custom Color Picker field ──────────────────────────────────────────────
export const colorPickerField = (label) =>
  responsiveTextField(label, "hex / rgba / transparent");

// ─── Background Image field with preview ───────────────────────────────────
export const backgroundImageField = responsiveTextField(
  "Background Image URL",
  "https://example.com/image.jpg",
);

// ─── Spacing fields ─────────────────────────────────────────────────────────
export const spacingFields = {
  paddingTop: responsiveNumberField("Padding Top (px)"),
  paddingBottom: responsiveNumberField("Padding Bottom (px)"),
  paddingLeft: responsiveNumberField("Padding Left (px)"),
  paddingRight: responsiveNumberField("Padding Right (px)"),
  marginTop: responsiveNumberField("Margin Top (px)"),
  marginBottom: responsiveNumberField("Margin Bottom (px)"),
  marginLeft: responsiveNumberField("Margin Left (px)"),
  marginRight: responsiveNumberField("Margin Right (px)"),
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
  fontSize:      responsiveNumberField("Font Size (px)"),
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
  lineHeight:    responsiveNumberField("Line Height"),
  letterSpacing: responsiveNumberField("Letter Spacing (px)"),
  wordSpacing:   responsiveNumberField("Word Spacing (px)"),
};

// ─── Border fields ───────────────────────────────────────────────────────────
export const borderFields = {
  borderRadius: responsiveNumberField("Border Radius (px)"),
  borderTopLeftRadius: responsiveNumberField("Border Radius TL (px)"),
  borderTopRightRadius: responsiveNumberField("Border Radius TR (px)"),
  borderBottomLeftRadius: responsiveNumberField("Border Radius BL (px)"),
  borderBottomRightRadius: responsiveNumberField("Border Radius BR (px)"),
  borderWidth: responsiveNumberField("Border Width (px)"),
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
  gap: responsiveNumberField("Gap (px)"),
  gridTemplateColumns: responsiveTextField("Grid Template Columns (e.g. 1fr 1fr)"),
  width: responsiveTextField("Width (px, %, auto)"),
  maxWidth: responsiveTextField("Max Width (px, %, auto)"),
  minWidth: responsiveTextField("Min Width (px, %)"),
  height: responsiveTextField("Height (px, %, auto)"),
  maxHeight: responsiveTextField("Max Height (px, %)"),
  minHeight: responsiveTextField("Min Height (px, %)"),
  overflow: selectField("Overflow", ["visible", "hidden", "scroll", "auto"]),
  overflowX: selectField("Overflow X", ["visible", "hidden", "scroll", "auto"]),
  overflowY: selectField("Overflow Y", ["visible", "hidden", "scroll", "auto"]),
};

// ─── Position fields ─────────────────────────────────────────────────────────
export const positionFields = {
  position: selectField("Position", [
    "static", "relative", "absolute", "fixed", "sticky",
  ]),
  top: responsiveTextField("Top (px, %)"),
  right: responsiveTextField("Right (px, %)"),
  bottom: responsiveTextField("Bottom (px, %)"),
  left: responsiveTextField("Left (px, %)"),
  zIndex: responsiveNumberField("Z-Index"),
};

// ─── Effects fields ──────────────────────────────────────────────────────────
export const effectFields = {
  opacity: responsiveNumberField("Opacity (0–1)"),
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
  const scalar = (v) => desktopVal(v);
  const px = (v) => {
    const base = scalar(v);
    return base !== undefined && base !== "" ? `${base}px` : undefined;
  };
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
    backgroundColor:    scalar(props.backgroundColor) || undefined,
    backgroundImage:    scalar(props.backgroundImage) ? `url(${scalar(props.backgroundImage)})` : undefined,
    backgroundSize:     scalar(props.backgroundSize) || undefined,
    backgroundPosition: scalar(props.backgroundPosition) || undefined,
    backgroundRepeat:   scalar(props.backgroundRepeat) || undefined,
    // Typography
    color:          scalar(props.color) || undefined,
    fontSize:       px(props.fontSize),
    fontWeight:     scalar(props.fontWeight) || undefined,
    fontFamily:     scalar(props.fontFamily) || undefined,
    fontStyle:      scalar(props.fontStyle) || undefined,
    textAlign:      scalar(props.textAlign) || undefined,
    textTransform:  scalar(props.textTransform) || undefined,
    textDecoration: scalar(props.textDecoration) || undefined,
    lineHeight:     scalar(props.lineHeight) || undefined,
    letterSpacing:  px(props.letterSpacing),
    wordSpacing:    px(props.wordSpacing),
    // Border
    borderRadius:   px(props.borderRadius),
    borderTopLeftRadius:     px(props.borderTopLeftRadius),
    borderTopRightRadius:    px(props.borderTopRightRadius),
    borderBottomLeftRadius:  px(props.borderBottomLeftRadius),
    borderBottomRightRadius: px(props.borderBottomRightRadius),
    borderWidth:    px(props.borderWidth),
    borderColor:    scalar(props.borderColor) || undefined,
    borderStyle:    scalar(props.borderStyle) || undefined,
    // Layout
    display:              scalar(props.display) || undefined,
    flexDirection:        scalar(props.flexDirection) || undefined,
    alignItems:           scalar(props.alignItems) || undefined,
    justifyContent:       scalar(props.justifyContent) || undefined,
    flexWrap:             scalar(props.flexWrap) || undefined,
    gap:                  px(props.gap),
    gridTemplateColumns:  scalar(props.gridTemplateColumns) || undefined,
    width:                scalar(props.width) || undefined,
    maxWidth:             scalar(props.maxWidth) || undefined,
    minWidth:             scalar(props.minWidth) || undefined,
    height:               scalar(props.height) || undefined,
    maxHeight:            scalar(props.maxHeight) || undefined,
    minHeight:            scalar(props.minHeight) || undefined,
    overflow:             scalar(props.overflow) || undefined,
    overflowX:            scalar(props.overflowX) || undefined,
    overflowY:            scalar(props.overflowY) || undefined,
    // Position
    position: scalar(props.position) !== "static" ? scalar(props.position) : undefined,
    top:      scalar(props.top) || undefined,
    right:    scalar(props.right) || undefined,
    bottom:   scalar(props.bottom) || undefined,
    left:     scalar(props.left) || undefined,
    zIndex:   scalar(props.zIndex) || undefined,
    // Effects
    opacity:    scalar(props.opacity) !== undefined ? scalar(props.opacity) : undefined,
    boxShadow:  scalar(props.boxShadow) || undefined,
    cursor:     scalar(props.cursor) || undefined,
    transition: scalar(props.transition) || undefined,
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


  const PROP_CSS_MAP = {
  // Spacing
  paddingTop:    (v) => `padding-top: ${v}px;`,
  paddingBottom: (v) => `padding-bottom: ${v}px;`,
  paddingLeft:   (v) => `padding-left: ${v}px;`,
  paddingRight:  (v) => `padding-right: ${v}px;`,
  marginTop:     (v) => `margin-top: ${v}px;`,
  marginBottom:  (v) => `margin-bottom: ${v}px;`,
  marginLeft:    (v) => `margin-left: ${v}px;`,
  marginRight:   (v) => `margin-right: ${v}px;`,
  // Typography
  color:          (v) => `color: ${v};`,
  fontSize:       (v) => `font-size: ${v}px;`,
  fontWeight:     (v) => `font-weight: ${v};`,
  fontFamily:     (v) => `font-family: ${v};`,
  fontStyle:      (v) => `font-style: ${v};`,
  textAlign:      (v) => `text-align: ${v};`,
  textTransform:  (v) => `text-transform: ${v};`,
  textDecoration: (v) => `text-decoration: ${v};`,
  lineHeight:     (v) => `line-height: ${v};`,
  letterSpacing:  (v) => `letter-spacing: ${v}px;`,
  wordSpacing:    (v) => `word-spacing: ${v}px;`,
  // Background
  backgroundColor:    (v) => `background-color: ${v};`,
  backgroundImage:    (v) => {
    const val = v.startsWith("url(") || v.includes("gradient") ? v : `url(${v})`;
    return `background-image: ${val};`;
  },
  backgroundSize:     (v) => `background-size: ${v};`,
  backgroundPosition: (v) => `background-position: ${v};`,
  backgroundRepeat:   (v) => `background-repeat: ${v};`,
  // Border
  borderRadius:            (v) => `border-radius: ${v}px;`,
  borderTopLeftRadius:     (v) => `border-top-left-radius: ${v}px;`,
  borderTopRightRadius:    (v) => `border-top-right-radius: ${v}px;`,
  borderBottomLeftRadius:  (v) => `border-bottom-left-radius: ${v}px;`,
  borderBottomRightRadius: (v) => `border-bottom-right-radius: ${v}px;`,
  borderWidth:  (v) => `border-width: ${v}px;`,
  borderColor:  (v) => `border-color: ${v};`,
  borderStyle:  (v) => `border-style: ${v};`,
  // Layout
  display:             (v) => `display: ${v};`,
  flexDirection:       (v) => `flex-direction: ${v};`,
  alignItems:          (v) => `align-items: ${v};`,
  justifyContent:      (v) => `justify-content: ${v};`,
  flexWrap:            (v) => `flex-wrap: ${v};`,
  gap:                 (v) => `gap: ${v}px;`,
  gridTemplateColumns: (v) => `grid-template-columns: ${v};`,
  width:               (v) => `width: ${v};`,
  maxWidth:            (v) => `max-width: ${v};`,
  minWidth:            (v) => `min-width: ${v};`,
  height:              (v) => `height: ${v};`,
  maxHeight:           (v) => `max-height: ${v};`,
  minHeight:           (v) => `min-height: ${v};`,
  overflow:            (v) => `overflow: ${v};`,
  overflowX:           (v) => `overflow-x: ${v};`,
  overflowY:           (v) => `overflow-y: ${v};`,
  // Position
  position: (v) => v !== "static" ? `position: ${v};` : null,
  top:      (v) => `top: ${v};`,
  right:    (v) => `right: ${v};`,
  bottom:   (v) => `bottom: ${v};`,
  left:     (v) => `left: ${v};`,
  zIndex:   (v) => `z-index: ${v};`,
  // Effects
  opacity:    (v) => `opacity: ${v};`,
  boxShadow:  (v) => `box-shadow: ${v};`,
  cursor:     (v) => `cursor: ${v};`,
  transition: (v) => `transition: ${v};`,
};

export function buildFullResponsiveCss(selector, props) {
  return buildResponsiveCss(selector, props, (propName, value) => {
    const fn = PROP_CSS_MAP[propName];
    if (!fn) return null;
    const result = fn(value);
    return result || null;
  });
}