// src/cms/config.jsx
import {
  spacingFields,
  backgroundFields,
  typographyFields,
  borderFields,
  layoutFields,
  positionFields,
  effectFields,
  colorPickerField,
  buildStyle,
  Overlay,
  buildFullResponsiveCss
} from "./styleFields.jsx";
import { ResponsiveField } from "../components/ResponsiveField.jsx";
import { buildResponsiveCss, desktopVal } from "../lib/resolveResponsive.js";

import {
  Heading as HeadingIcon,
  AlignLeft,
  LayoutTemplate,
  Columns3,
  MousePointerClick,
  LayoutGrid,
  ImageIcon,
  Maximize2,
  CreditCard,
  Image as ImageBlockIcon,
  Link,
  Sparkles,
  Quote,
  HelpCircle,
  BarChart2,
  Minus,
  Mail,
  PanelBottom,
} from "lucide-react";

// ─── Block Icon Label helper ─────────────────────────────────────────────────
function BlockLabel({ icon: Icon, label, color = "#4f46e5" }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "4px 0",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: `${color}14`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={19} color={color} strokeWidth={1.75} />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#1e293b",
          textAlign: "center",
          lineHeight: 1.25,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

const responsiveNumberField = (label) => ({
  type: "custom",
  label,
  render: ({ value, onChange }) => (
    <ResponsiveField value={value} onChange={onChange} inputType="number" />
  ),
});

const parseResponsiveStyles = (jsonString = "") => {
  if (!jsonString?.trim()) return "";
  try {
    const obj = JSON.parse(jsonString);
    return Object.entries(obj)
      .map(([key, val]) => {
        const cssKey = key.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
        return `${cssKey}: ${val};`;
      })
      .join(" ");
  } catch {
    return "";
  }
};

const cssLengthProps = new Set([
  "paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
  "marginTop", "marginBottom", "marginLeft", "marginRight",
  "fontSize", "letterSpacing", "wordSpacing", "borderRadius",
  "borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius",
  "borderWidth", "gap", "top", "right", "bottom", "left",
  "zIndex", "minHeight", "maxHeight", "minWidth", "maxWidth", "height", "width",
]);

const toCssDeclaration = (propName, value) => {
  if (value === undefined || value === null || value === "") return "";
  const cssName = propName.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
  const cssValue =
    typeof value === "number" && cssLengthProps.has(propName) ? `${value}px` : value;
  return `${cssName}: ${cssValue};`;
};

const buildResponsiveStyleFromProps = (htmlId, styleProps = {}) => {
  if (!htmlId) return "";
  const blocks = { desktop: [], tablet: [], mobile: [] };
  for (const [prop, value] of Object.entries(styleProps)) {
    if (!value || typeof value !== "object") continue;
    if (!("desktop" in value || "tablet" in value || "mobile" in value)) continue;
    for (const bp of ["desktop", "tablet", "mobile"]) {
      const decl = toCssDeclaration(prop, value[bp]);
      if (decl) blocks[bp].push(decl);
    }
  }
  return [
    blocks.desktop.length ? `@media (min-width: 1025px) { #${htmlId} { ${blocks.desktop.join(" ")} } }` : "",
    blocks.tablet.length ? `@media (max-width: 1024px) { #${htmlId} { ${blocks.tablet.join(" ")} } }` : "",
    blocks.mobile.length ? `@media (max-width: 768px) { #${htmlId} { ${blocks.mobile.join(" ")} } }` : "",
  ].filter(Boolean).join("\n");
};

const buildResponsiveStyleTag = ({
  htmlId,
  desktopStyles,
  tabletStyles,
  mobileStyles,
}) => {
  if (!htmlId) return "";
  const desktopBlock = parseResponsiveStyles(desktopStyles);
  const tabletBlock = parseResponsiveStyles(tabletStyles);
  const mobileBlock = parseResponsiveStyles(mobileStyles);
  return [
    desktopBlock ? `@media (min-width: 1025px) { #${htmlId} { ${desktopBlock} } }` : "",
    tabletBlock ? `@media (max-width: 1024px) { #${htmlId} { ${tabletBlock} } }` : "",
    mobileBlock ? `@media (max-width: 768px) { #${htmlId} { ${mobileBlock} } }` : "",
  ]
    .filter(Boolean)
    .join("\n");
};

export const getBlockStyleContext = (htmlId, props) => {
  const selector = htmlId ? `#${htmlId}` : null;
  const responsiveStyleTag = selector
    ? buildFullResponsiveCss(selector, props)
    : "";

  // buildStyle reads desktop values for inline style= fallback
  const { desktopStyles, tabletStyles, mobileStyles, overlayColor, ...styleProps } = props;
  return {
    styleProps,
    responsiveStyleTag,
  };
};


// All style field groups merged for section-level components
const sectionFields = {
  htmlId: { type: "text", label: "HTML id" },
  className: { type: "text", label: "Class name" },
  desktopStyles: {
    type: "textarea",
    label: "Desktop Styles JSON (for this block)",
  },
  tabletStyles: {
    type: "textarea",
    label: "Tablet Styles JSON (for this block)",
  },
  mobileStyles: {
    type: "textarea",
    label: "Mobile Styles JSON (for this block)",
  },
  ...spacingFields,
  ...backgroundFields,
  ...typographyFields,
  ...borderFields,
  ...layoutFields,
  ...positionFields,
  ...effectFields,
};

export const config = {
  components: {
    HeroSection: {
      label: (
        <BlockLabel icon={ImageIcon} label="Hero Section" color="#1d4ed8" />
      ),
      fields: {
        // ── Section Sizing ───────────────────────────────────────
        width: { type: "text", label: "Width (px / % / auto)" },
        maxWidth: { type: "number", label: "Max Width (px)" },
        minHeight: responsiveNumberField("Min Height (px)"),
        marginTop: { type: "number", label: "Margin Top (px)" },
        marginBottom: { type: "number", label: "Margin Bottom (px)" },
        marginLeft: { type: "text", label: "Margin Left (px / auto)" },
        marginRight: { type: "text", label: "Margin Right (px / auto)" },
        paddingTop: { type: "number", label: "Padding Top (px)" },
        paddingBottom: { type: "number", label: "Padding Bottom (px)" },
        paddingLeft: { type: "number", label: "Padding Left (px)" },
        paddingRight: { type: "number", label: "Padding Right (px)" },

        // ── Border Radius (per corner) ───────────────────────────
        borderRadiusTopLeft: {
          type: "number",
          label: "↖ Radius Top-Left (px)",
        },
        borderRadiusTopRight: {
          type: "number",
          label: "↗ Radius Top-Right (px)",
        },
        borderRadiusBottomRight: {
          type: "number",
          label: "↘ Radius Bottom-Right (px)",
        },
        borderRadiusBottomLeft: {
          type: "number",
          label: "↙ Radius Bottom-Left (px)",
        },

        // ── Border Top ───────────────────────────────────────────
        borderTopWidth: { type: "number", label: "Border Top Width (px)" },
        borderTopStyle: {
          type: "select",
          label: "Border Top Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
            { label: "Double", value: "double" },
          ],
        },
        borderTopColor: colorPickerField("Border Top Color"),

        // ── Border Right ─────────────────────────────────────────
        borderRightWidth: { type: "number", label: "Border Right Width (px)" },
        borderRightStyle: {
          type: "select",
          label: "Border Right Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
            { label: "Double", value: "double" },
          ],
        },
        borderRightColor: colorPickerField("Border Right Color"),

        // ── Border Bottom ────────────────────────────────────────
        borderBottomWidth: {
          type: "number",
          label: "Border Bottom Width (px)",
        },
        borderBottomStyle: {
          type: "select",
          label: "Border Bottom Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
            { label: "Double", value: "double" },
          ],
        },
        borderBottomColor: colorPickerField("Border Bottom Color"),

        // ── Border Left ──────────────────────────────────────────
        borderLeftWidth: { type: "number", label: "Border Left Width (px)" },
        borderLeftStyle: {
          type: "select",
          label: "Border Left Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
            { label: "Double", value: "double" },
          ],
        },
        borderLeftColor: colorPickerField("Border Left Color"),

        // ── Box Shadow ───────────────────────────────────────────
        boxShadow: { type: "text", label: "Box Shadow (CSS value)" },

        // ── Background ───────────────────────────────────────────
        backgroundImage: { type: "text", label: "Background Image URL" },
        overlayColor: colorPickerField("Overlay Color"),
        overlayOpacity: { type: "number", label: "Overlay Opacity (0–1)" },

        // ── Content Layout ────────────────────────────────────────
        contentMaxWidth: { type: "number", label: "Content Max Width (px)" },
        contentAlign: {
          type: "select",
          label: "Content Alignment (H)",
          options: [
            { label: "Left", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Right", value: "flex-end" },
          ],
        },
        contentVerticalAlign: {
          type: "select",
          label: "Content Alignment (V)",
          options: [
            { label: "Top", value: "flex-start" },
            { label: "Center", value: "center" },
            { label: "Bottom", value: "flex-end" },
          ],
        },
        textAlign: {
          type: "select",
          label: "Text Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ],
        },

        // ── Show/Hide Sections ────────────────────────────────────
        showHeading: {
          type: "select",
          label: "Show Heading",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        showSubheading: {
          type: "select",
          label: "Show Subheading",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        showDescription: {
          type: "select",
          label: "Show Description",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        showPrimaryButton: {
          type: "select",
          label: "Show Primary Button",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        showSecondaryButton: {
          type: "select",
          label: "Show Secondary Button",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        showScrollIndicator: {
          type: "select",
          label: "Show Scroll Indicator",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },

        // ── Heading ──────────────────────────────────────────────
        heading: { type: "text", label: "Heading Text" },
        headingColor: colorPickerField("Heading Color"),
        headingFontSize: responsiveNumberField("Heading Font Size (px)"),
        headingFontWeight: {
          type: "select",
          label: "Heading Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Medium (500)", value: "500" },
            { label: "Semi Bold (600)", value: "600" },
            { label: "Bold (700)", value: "700" },
            { label: "Extra Bold (800)", value: "800" },
            { label: "Black (900)", value: "900" },
          ],
        },
        headingFontFamily: {
          type: "select",
          label: "Heading Font Family",
          options: [
            {
              label: "Serif (Georgia)",
              value: "Georgia, 'Times New Roman', serif",
            },
            { label: "Sans-serif", value: "system-ui, sans-serif" },
            { label: "Monospace", value: "monospace" },
          ],
        },
        headingLetterSpacing: {
          type: "number",
          label: "Heading Letter Spacing (px)",
        },
        headingLineHeight: { type: "number", label: "Heading Line Height" },
        headingMarginBottom: {
          type: "number",
          label: "Heading Margin Bottom (px)",
        },

        // ── Subheading ───────────────────────────────────────────
        subheading: { type: "text", label: "Subheading Text" },
        subheadingColor: colorPickerField("Subheading Color"),
        subheadingFontSize: responsiveNumberField("Subheading Font Size (px)"),
        subheadingFontWeight: {
          type: "select",
          label: "Subheading Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Medium (500)", value: "500" },
            { label: "Semi Bold (600)", value: "600" },
            { label: "Bold (700)", value: "700" },
          ],
        },
        subheadingOpacity: {
          type: "number",
          label: "Subheading Opacity (0–1)",
        },
        subheadingMarginBottom: {
          type: "number",
          label: "Subheading Margin Bottom (px)",
        },

        // ── Description ──────────────────────────────────────────
        description: { type: "textarea", label: "Description Text" },
        descriptionColor: colorPickerField("Description Color"),
        descriptionFontSize: responsiveNumberField("Description Font Size (px)"),
        descriptionFontWeight: {
          type: "select",
          label: "Description Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Medium (500)", value: "500" },
            { label: "Semi Bold (600)", value: "600" },
          ],
        },
        descriptionOpacity: {
          type: "number",
          label: "Description Opacity (0–1)",
        },
        descriptionLineHeight: {
          type: "number",
          label: "Description Line Height",
        },
        descriptionMaxWidth: {
          type: "number",
          label: "Description Max Width (px)",
        },
        descriptionMarginBottom: {
          type: "number",
          label: "Description Margin Bottom (px)",
        },

        // ── Primary Button ───────────────────────────────────────
        primaryButtonLabel: { type: "text", label: "Primary Button Label" },
        primaryButtonLink: { type: "text", label: "Primary Button URL" },
        primaryButtonBg: colorPickerField("Primary Button Background"),
        primaryButtonColor: colorPickerField("Primary Button Text Color"),
        primaryButtonBorderColor: colorPickerField(
          "Primary Button Border Color",
        ),
        primaryButtonBorderWidth: {
          type: "number",
          label: "Primary Button Border Width (px)",
        },
        primaryButtonBorderStyle: {
          type: "select",
          label: "Primary Button Border Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
          ],
        },
        primaryButtonBorderRadiusTL: {
          type: "number",
          label: "Primary Btn ↖ Radius TL (px)",
        },
        primaryButtonBorderRadiusTR: {
          type: "number",
          label: "Primary Btn ↗ Radius TR (px)",
        },
        primaryButtonBorderRadiusBR: {
          type: "number",
          label: "Primary Btn ↘ Radius BR (px)",
        },
        primaryButtonBorderRadiusBL: {
          type: "number",
          label: "Primary Btn ↙ Radius BL (px)",
        },
        primaryButtonFontSize: responsiveNumberField("Primary Button Font Size (px)"),
        primaryButtonFontWeight: {
          type: "select",
          label: "Primary Button Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Medium (500)", value: "500" },
            { label: "Semi Bold (600)", value: "600" },
            { label: "Bold (700)", value: "700" },
          ],
        },
        primaryButtonPaddingX: {
          type: "number",
          label: "Primary Button Padding X (px)",
        },
        primaryButtonPaddingY: {
          type: "number",
          label: "Primary Button Padding Y (px)",
        },

        // ── Secondary Button ─────────────────────────────────────
        secondaryButtonLabel: { type: "text", label: "Secondary Button Label" },
        secondaryButtonLink: { type: "text", label: "Secondary Button URL" },
        secondaryButtonBg: colorPickerField("Secondary Button Background"),
        secondaryButtonColor: colorPickerField("Secondary Button Text Color"),
        secondaryButtonBorderColor: colorPickerField(
          "Secondary Button Border Color",
        ),
        secondaryButtonBorderWidth: {
          type: "number",
          label: "Secondary Button Border Width (px)",
        },
        secondaryButtonBorderStyle: {
          type: "select",
          label: "Secondary Button Border Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
          ],
        },
        secondaryButtonBorderRadiusTL: {
          type: "number",
          label: "Secondary Btn ↖ Radius TL (px)",
        },
        secondaryButtonBorderRadiusTR: {
          type: "number",
          label: "Secondary Btn ↗ Radius TR (px)",
        },
        secondaryButtonBorderRadiusBR: {
          type: "number",
          label: "Secondary Btn ↘ Radius BR (px)",
        },
        secondaryButtonBorderRadiusBL: {
          type: "number",
          label: "Secondary Btn ↙ Radius BL (px)",
        },
        secondaryButtonFontSize: responsiveNumberField("Secondary Button Font Size (px)"),
        secondaryButtonFontWeight: {
          type: "select",
          label: "Secondary Button Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Medium (500)", value: "500" },
            { label: "Semi Bold (600)", value: "600" },
            { label: "Bold (700)", value: "700" },
          ],
        },
        secondaryButtonPaddingX: {
          type: "number",
          label: "Secondary Button Padding X (px)",
        },
        secondaryButtonPaddingY: {
          type: "number",
          label: "Secondary Button Padding Y (px)",
        },

        // ── Scroll Indicator ─────────────────────────────────────
        scrollIndicatorColor: colorPickerField("Scroll Indicator Color"),

        // ── ID / Class ───────────────────────────────────────────
        htmlId: { type: "text", label: "HTML id" },
        className: { type: "text", label: "Class name" },

        // ── Responsive Styles ─────────────────────────────────────
        desktopStyles: {
          type: "textarea",
          label: "Desktop Styles — JSON (≥1025px)",
        },
        tabletStyles: {
          type: "textarea",
          label: "Tablet Styles — JSON (≤1024px)",
        },
        mobileStyles: {
          type: "textarea",
          label: "Mobile Styles — JSON (≤768px)",
        },

        // ── Custom CSS ────────────────────────────────────────────
        customCss: {
          type: "textarea",
          label: "Custom CSS (raw CSS, use #hero-[id] to scope)",
        },
      },

      defaultProps: {
        width: "100%",
        minHeight: 520,
        marginLeft: "auto",
        marginRight: "auto",
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,

        borderRadiusTopLeft: 0,
        borderRadiusTopRight: 0,
        borderRadiusBottomRight: 0,
        borderRadiusBottomLeft: 0,

        borderTopWidth: 0,
        borderTopStyle: "none",
        borderTopColor: "#e5e7eb",
        borderRightWidth: 0,
        borderRightStyle: "none",
        borderRightColor: "#e5e7eb",
        borderBottomWidth: 0,
        borderBottomStyle: "none",
        borderBottomColor: "#e5e7eb",
        borderLeftWidth: 0,
        borderLeftStyle: "none",
        borderLeftColor: "#e5e7eb",

        boxShadow: "",
        backgroundImage: "",
        overlayColor: "#000000",
        overlayOpacity: 0.5,
        contentMaxWidth: 700,
        contentAlign: "center",
        contentVerticalAlign: "center",
        textAlign: "center",

        showHeading: "true",
        showSubheading: "true",
        showDescription: "true",
        showPrimaryButton: "true",
        showSecondaryButton: "true",
        showScrollIndicator: "true",

        heading: "Bamboo Flooring",
        headingColor: "#ffffff",
        headingFontSize: 56,
        headingFontWeight: "800",
        headingFontFamily: "Georgia, 'Times New Roman', serif",
        headingLetterSpacing: -0.5,
        headingLineHeight: 1.1,
        headingMarginBottom: 20,

        subheading: "Quality Bathroom Solutions for Modern Living",
        subheadingColor: "#ffffff",
        subheadingFontSize: 18,
        subheadingFontWeight: "400",
        subheadingOpacity: 0.9,
        subheadingMarginBottom: 16,

        description:
          "Discover our premium collection of bathroom fixtures, tapware, and accessories designed to elevate your space with Australian quality and style.",
        descriptionColor: "#ffffff",
        descriptionFontSize: 16,
        descriptionFontWeight: "400",
        descriptionOpacity: 0.8,
        descriptionLineHeight: 1.7,
        descriptionMaxWidth: 560,
        descriptionMarginBottom: 36,

        primaryButtonLabel: "Shop Collection",
        primaryButtonLink: "#",
        primaryButtonBg: "#ffffff",
        primaryButtonColor: "#111111",
        primaryButtonBorderColor: "#ffffff",
        primaryButtonBorderWidth: 2,
        primaryButtonBorderStyle: "solid",
        primaryButtonBorderRadiusTL: 4,
        primaryButtonBorderRadiusTR: 4,
        primaryButtonBorderRadiusBR: 4,
        primaryButtonBorderRadiusBL: 4,
        primaryButtonFontSize: 15,
        primaryButtonFontWeight: "600",
        primaryButtonPaddingX: 32,
        primaryButtonPaddingY: 14,

        secondaryButtonLabel: "Learn More",
        secondaryButtonLink: "#",
        secondaryButtonBg: "rgba(255,255,255,0.12)",
        secondaryButtonColor: "#ffffff",
        secondaryButtonBorderColor: "#ffffff",
        secondaryButtonBorderWidth: 2,
        secondaryButtonBorderStyle: "solid",
        secondaryButtonBorderRadiusTL: 4,
        secondaryButtonBorderRadiusTR: 4,
        secondaryButtonBorderRadiusBR: 4,
        secondaryButtonBorderRadiusBL: 4,
        secondaryButtonFontSize: 15,
        secondaryButtonFontWeight: "600",
        secondaryButtonPaddingX: 32,
        secondaryButtonPaddingY: 14,

        scrollIndicatorColor: "#ffffff",

        // ── Responsive + Custom CSS ───────────────────────────────
        desktopStyles: "",
        tabletStyles: "",
        mobileStyles: "",
        customCss: "",
      },

      render: ({
        width,
        maxWidth,
        minHeight,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        borderRadiusTopLeft,
        borderRadiusTopRight,
        borderRadiusBottomRight,
        borderRadiusBottomLeft,
        borderTopWidth,
        borderTopStyle,
        borderTopColor,
        borderRightWidth,
        borderRightStyle,
        borderRightColor,
        borderBottomWidth,
        borderBottomStyle,
        borderBottomColor,
        borderLeftWidth,
        borderLeftStyle,
        borderLeftColor,
        boxShadow,
        backgroundImage,
        overlayColor,
        overlayOpacity,
        contentMaxWidth,
        contentAlign,
        contentVerticalAlign,
        textAlign,
        showHeading,
        showSubheading,
        showDescription,
        showPrimaryButton,
        showSecondaryButton,
        showScrollIndicator,
        heading,
        headingColor,
        headingFontSize,
        headingFontWeight,
        headingFontFamily,
        headingLetterSpacing,
        headingLineHeight,
        headingMarginBottom,
        subheading,
        subheadingColor,
        subheadingFontSize,
        subheadingFontWeight,
        subheadingOpacity,
        subheadingMarginBottom,
        description,
        descriptionColor,
        descriptionFontSize,
        descriptionFontWeight,
        descriptionOpacity,
        descriptionLineHeight,
        descriptionMaxWidth,
        descriptionMarginBottom,
        primaryButtonLabel,
        primaryButtonLink,
        primaryButtonBg,
        primaryButtonColor,
        primaryButtonBorderColor,
        primaryButtonBorderWidth,
        primaryButtonBorderStyle,
        primaryButtonBorderRadiusTL,
        primaryButtonBorderRadiusTR,
        primaryButtonBorderRadiusBR,
        primaryButtonBorderRadiusBL,
        primaryButtonFontSize,
        primaryButtonFontWeight,
        primaryButtonPaddingX,
        primaryButtonPaddingY,
        secondaryButtonLabel,
        secondaryButtonLink,
        secondaryButtonBg,
        secondaryButtonColor,
        secondaryButtonBorderColor,
        secondaryButtonBorderWidth,
        secondaryButtonBorderStyle,
        secondaryButtonBorderRadiusTL,
        secondaryButtonBorderRadiusTR,
        secondaryButtonBorderRadiusBR,
        secondaryButtonBorderRadiusBL,
        secondaryButtonFontSize,
        secondaryButtonFontWeight,
        secondaryButtonPaddingX,
        secondaryButtonPaddingY,
        scrollIndicatorColor,
        htmlId,
        className,
        desktopStyles,
        tabletStyles,
        mobileStyles,
        customCss,
      }) => {
        // ── Helpers ──────────────────────────────────────────────
        const buildRadius = (tl = 0, tr = 0, br = 0, bl = 0) =>
          `${tl}px ${tr}px ${br}px ${bl}px`;

        const buildBorder = (w, s, c) =>
          w && s && s !== "none" ? `${w}px ${s} ${c || "#e5e7eb"}` : undefined;

        const parseResponsiveStyles = (jsonString = "") => {
          if (!jsonString?.trim()) return "";
          try {
            const obj = JSON.parse(jsonString);
            return Object.entries(obj)
              .map(([key, val]) => {
                const cssKey = key.replace(
                  /([A-Z])/g,
                  (m) => `-${m.toLowerCase()}`,
                );
                return `${cssKey}: ${val};`;
              })
              .join(" ");
          } catch {
            return "/* Invalid JSON */";
          }
        };

        const uid = htmlId || `hero-section`;

        const desktopBlock = parseResponsiveStyles(desktopStyles);
        const tabletBlock = parseResponsiveStyles(tabletStyles);
        const mobileBlock = parseResponsiveStyles(mobileStyles);

        const responsiveCssBlocks = [
          buildResponsiveCss(`#${uid}`, { minHeight }, (prop, val) => {
            if (prop === "minHeight") return `min-height: ${val}px;`;
            return "";
          }),
          buildResponsiveCss(
            `#${uid} .cms-hero-heading`,
            { headingFontSize },
            (prop, val) => (prop === "headingFontSize" ? `font-size: ${val}px;` : ""),
          ),
          buildResponsiveCss(
            `#${uid} .cms-hero-subheading`,
            { subheadingFontSize },
            (prop, val) => (prop === "subheadingFontSize" ? `font-size: ${val}px;` : ""),
          ),
          buildResponsiveCss(
            `#${uid} .cms-hero-description`,
            { descriptionFontSize },
            (prop, val) => (prop === "descriptionFontSize" ? `font-size: ${val}px;` : ""),
          ),
          buildResponsiveCss(
            `#${uid} .cms-hero-primary-btn`,
            { primaryButtonFontSize },
            (prop, val) => (prop === "primaryButtonFontSize" ? `font-size: ${val}px;` : ""),
          ),
          buildResponsiveCss(
            `#${uid} .cms-hero-secondary-btn`,
            { secondaryButtonFontSize },
            (prop, val) => (prop === "secondaryButtonFontSize" ? `font-size: ${val}px;` : ""),
          ),
        ]
          .filter(Boolean)
          .join("\n");

        const styleTag = [
          desktopBlock
            ? `@media (min-width: 1025px) { #${uid} { ${desktopBlock} } }`
            : "",
          tabletBlock
            ? `@media (max-width: 1024px) { #${uid} { ${tabletBlock} } }`
            : "",
          mobileBlock
            ? `@media (max-width: 768px)  { #${uid} { ${mobileBlock} } }`
            : "",
          responsiveCssBlocks,
          customCss?.trim() ? customCss : "",
        ]
          .filter(Boolean)
          .join("\n");

        const itemAlign =
          textAlign === "left"
            ? "flex-start"
            : textAlign === "right"
              ? "flex-end"
              : "center";

        return (
          <>
            {styleTag && <style>{styleTag}</style>}

            <section
              id={uid}
              className={className || undefined}
              style={{
                position: "relative",
                width: width || "100%",
                maxWidth: maxWidth ? `${maxWidth}px` : undefined,
                minHeight: desktopVal(minHeight) ? `${desktopVal(minHeight)}px` : "520px",
                marginTop: marginTop ? `${marginTop}px` : undefined,
                marginBottom: marginBottom ? `${marginBottom}px` : undefined,
                marginLeft: marginLeft ?? "auto",
                marginRight: marginRight ?? "auto",
                paddingTop: paddingTop ? `${paddingTop}px` : undefined,
                paddingBottom: paddingBottom ? `${paddingBottom}px` : undefined,
                paddingLeft: paddingLeft ? `${paddingLeft}px` : undefined,
                paddingRight: paddingRight ? `${paddingRight}px` : undefined,
                borderRadius: buildRadius(
                  borderRadiusTopLeft,
                  borderRadiusTopRight,
                  borderRadiusBottomRight,
                  borderRadiusBottomLeft,
                ),
                borderTop: buildBorder(
                  borderTopWidth,
                  borderTopStyle,
                  borderTopColor,
                ),
                borderRight: buildBorder(
                  borderRightWidth,
                  borderRightStyle,
                  borderRightColor,
                ),
                borderBottom: buildBorder(
                  borderBottomWidth,
                  borderBottomStyle,
                  borderBottomColor,
                ),
                borderLeft: buildBorder(
                  borderLeftWidth,
                  borderLeftStyle,
                  borderLeftColor,
                ),
                boxShadow: boxShadow || undefined,
                backgroundImage: backgroundImage
                  ? `url(${backgroundImage})`
                  : "linear-gradient(135deg, #2d2d2d 0%, #4a4a4a 100%)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                alignItems: contentVerticalAlign || "center",
                justifyContent: contentAlign || "center",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              {/* ── Overlay ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: overlayColor || "#000000",
                  opacity: overlayOpacity ?? 0.5,
                  zIndex: 1,
                  pointerEvents: "none",
                  borderRadius: "inherit",
                }}
              />

              {/* ── Content ── */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  textAlign: textAlign || "center",
                  maxWidth: contentMaxWidth ? `${contentMaxWidth}px` : "700px",
                  width: "100%",
                  padding: "48px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: itemAlign,
                }}
              >
                {/* Heading */}
                {showHeading !== "false" && heading && (
                  <h1
                    className="cms-hero-heading"
                    style={{
                      color: headingColor || "#ffffff",
                      fontSize: desktopVal(headingFontSize)
                        ? `${desktopVal(headingFontSize)}px`
                        : "56px",
                      fontWeight: headingFontWeight || "800",
                      fontFamily: headingFontFamily || "Georgia, serif",
                      letterSpacing:
                        headingLetterSpacing != null
                          ? `${headingLetterSpacing}px`
                          : "-0.5px",
                      lineHeight: headingLineHeight || 1.1,
                      margin: 0,
                      marginBottom:
                        headingMarginBottom != null
                          ? `${headingMarginBottom}px`
                          : "20px",
                      textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                    }}
                  >
                    {heading}
                  </h1>
                )}

                {/* Subheading */}
                {showSubheading !== "false" && subheading && (
                  <p
                    className="cms-hero-subheading"
                    style={{
                      color: subheadingColor || "#ffffff",
                      fontSize: desktopVal(subheadingFontSize)
                        ? `${desktopVal(subheadingFontSize)}px`
                        : "18px",
                      fontWeight: subheadingFontWeight || "400",
                      opacity: subheadingOpacity ?? 0.9,
                      margin: 0,
                      marginBottom:
                        subheadingMarginBottom != null
                          ? `${subheadingMarginBottom}px`
                          : "16px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {subheading}
                  </p>
                )}

                {/* Description */}
                {showDescription !== "false" && description && (
                  <p
                    className="cms-hero-description"
                    style={{
                      color: descriptionColor || "#ffffff",
                      fontSize: desktopVal(descriptionFontSize)
                        ? `${desktopVal(descriptionFontSize)}px`
                        : "16px",
                      fontWeight: descriptionFontWeight || "400",
                      opacity: descriptionOpacity ?? 0.8,
                      lineHeight: descriptionLineHeight || 1.7,
                      maxWidth: descriptionMaxWidth
                        ? `${descriptionMaxWidth}px`
                        : "560px",
                      margin: 0,
                      marginBottom:
                        descriptionMarginBottom != null
                          ? `${descriptionMarginBottom}px`
                          : "36px",
                    }}
                  >
                    {description}
                  </p>
                )}

                {/* Buttons */}
                {(showPrimaryButton !== "false" ||
                  showSecondaryButton !== "false") && (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      justifyContent: itemAlign,
                      marginTop: 8,
                    }}
                  >
                    {showPrimaryButton !== "false" && primaryButtonLabel && (
                      <a
                        href={primaryButtonLink || "#"}
                        className="cms-hero-primary-btn"
                        style={{
                          display: "inline-block",
                          padding: `${primaryButtonPaddingY ?? 14}px ${primaryButtonPaddingX ?? 32}px`,
                          background: primaryButtonBg || "#ffffff",
                          color: primaryButtonColor || "#111111",
                          fontWeight: primaryButtonFontWeight || "600",
                          fontSize: desktopVal(primaryButtonFontSize)
                            ? `${desktopVal(primaryButtonFontSize)}px`
                            : "15px",
                          textDecoration: "none",
                          borderRadius: buildRadius(
                            primaryButtonBorderRadiusTL,
                            primaryButtonBorderRadiusTR,
                            primaryButtonBorderRadiusBR,
                            primaryButtonBorderRadiusBL,
                          ),
                          border:
                            buildBorder(
                              primaryButtonBorderWidth,
                              primaryButtonBorderStyle,
                              primaryButtonBorderColor,
                            ) || "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {primaryButtonLabel}
                      </a>
                    )}

                    {showSecondaryButton !== "false" &&
                      secondaryButtonLabel && (
                        <a
                          href={secondaryButtonLink || "#"}
                          className="cms-hero-secondary-btn"
                          style={{
                            display: "inline-block",
                            padding: `${secondaryButtonPaddingY ?? 14}px ${secondaryButtonPaddingX ?? 32}px`,
                            background:
                              secondaryButtonBg || "rgba(255,255,255,0.12)",
                            color: secondaryButtonColor || "#ffffff",
                            fontWeight: secondaryButtonFontWeight || "600",
                            fontSize: desktopVal(secondaryButtonFontSize)
                              ? `${desktopVal(secondaryButtonFontSize)}px`
                              : "15px",
                            textDecoration: "none",
                            borderRadius: buildRadius(
                              secondaryButtonBorderRadiusTL,
                              secondaryButtonBorderRadiusTR,
                              secondaryButtonBorderRadiusBR,
                              secondaryButtonBorderRadiusBL,
                            ),
                            border:
                              buildBorder(
                                secondaryButtonBorderWidth,
                                secondaryButtonBorderStyle,
                                secondaryButtonBorderColor,
                              ) || "none",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {secondaryButtonLabel}
                        </a>
                      )}
                  </div>
                )}
              </div>

              {/* ── Scroll Indicator ── */}
              {showScrollIndicator !== "false" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                  }}
                >
                  <svg
                    width="28"
                    height="44"
                    viewBox="0 0 28 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.75 }}
                  >
                    <rect
                      x="1"
                      y="1"
                      width="26"
                      height="42"
                      rx="13"
                      stroke={scrollIndicatorColor || "#ffffff"}
                      strokeWidth="2"
                    />
                    <circle
                      cx="14"
                      cy="10"
                      r="3"
                      fill={scrollIndicatorColor || "#ffffff"}
                    >
                      <animate
                        attributeName="cy"
                        from="10"
                        to="30"
                        dur="1.4s"
                        repeatCount="indefinite"
                        calcMode="ease-in-out"
                      />
                      <animate
                        attributeName="opacity"
                        from="1"
                        to="0"
                        dur="1.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </div>
              )}
            </section>
          </>
        );
      },
    },
    AboutSection: {
      label: (
        <BlockLabel icon={ImageIcon} label="About Section" color="#b45309" />
      ),
      fields: {
        // ── Content ─────────────────────────────────────────────
        badge: { type: "text", label: "Badge / Tag (optional)" },
        heading: { type: "text", label: "Main Heading" },
        subheading: { type: "text", label: "Sub Heading" },
        description: { type: "textarea", label: "Description" },

        // ── List Items ───────────────────────────────────────────
        listItems: {
          type: "array",
          label: "Check List Items",
          arrayFields: {
            text: { type: "text", label: "Item Text" },
            icon: { type: "text", label: "Icon (emoji or char, default ✓)" },
          },
        },

        // ── CTA Buttons ──────────────────────────────────────────
        primaryButtonLabel: { type: "text", label: "Primary Button Label" },
        primaryButtonLink: { type: "text", label: "Primary Button URL" },
        secondaryButtonLabel: { type: "text", label: "Secondary Button Label" },
        secondaryButtonLink: { type: "text", label: "Secondary Button URL" },

        // ── Images ───────────────────────────────────────────────
        image1: { type: "text", label: "Image 1 URL (large, behind)" },
        image1Alt: { type: "text", label: "Image 1 Alt Text" },
        image2: { type: "text", label: "Image 2 URL (small, front)" },
        image2Alt: { type: "text", label: "Image 2 Alt Text" },
        imageLayout: {
          type: "select",
          label: "Image Side",
          options: [
            { label: "Images Right", value: "right" },
            { label: "Images Left", value: "left" },
          ],
        },
        imageBorderRadius: {
          type: "number",
          label: "Image Border Radius (px)",
        },
        image1Height: { type: "number", label: "Image 1 Height (px)" },
        image2Height: { type: "number", label: "Image 2 Height (px)" },
        image2Width: { type: "number", label: "Image 2 Width (%)" },
        imageGap: { type: "number", label: "Gap between images (px)" },
        imageOverlap: {
          type: "number",
          label: "Image 2 vertical overlap (px, negative = up)",
        },

        // ── Typography ───────────────────────────────────────────
        headingColor: colorPickerField("Heading Color"),
        headingFontSize: { type: "number", label: "Heading Font Size (px)" },
        headingFontWeight: {
          type: "select",
          label: "Heading Font Weight",
          options: [
            { label: "Bold (700)", value: "700" },
            { label: "Extra Bold (800)", value: "800" },
            { label: "Black (900)", value: "900" },
          ],
        },
        headingFontFamily: {
          type: "select",
          label: "Heading Font Family",
          options: [
            {
              label: "Serif (Georgia)",
              value: "Georgia, 'Times New Roman', serif",
            },
            { label: "Sans-serif", value: "system-ui, sans-serif" },
          ],
        },
        subheadingColor: colorPickerField("Sub Heading Color"),
        subheadingFontSize: {
          type: "number",
          label: "Sub Heading Font Size (px)",
        },
        bodyColor: colorPickerField("Body Text Color"),
        bodyFontSize: { type: "number", label: "Body Font Size (px)" },
        listIconColor: colorPickerField("List Icon Color"),
        listTextColor: colorPickerField("List Text Color"),
        listIconSize: { type: "number", label: "List Icon Size (px)" },
        listTextSize: { type: "number", label: "List Text Size (px)" },
        listGap: { type: "number", label: "List Item Gap (px)" },

        // ── Buttons ──────────────────────────────────────────────
        primaryBg: colorPickerField("Primary Button Background"),
        primaryColor: colorPickerField("Primary Button Text Color"),
        primaryBorderColor: colorPickerField("Primary Button Border Color"),
        primaryBorderWidth: {
          type: "number",
          label: "Primary Button Border Width (px)",
        },
        primaryBorderStyle: {
          type: "select",
          label: "Primary Button Border Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
          ],
        },
        primaryBorderRadius: {
          type: "number",
          label: "Primary Button Border Radius (px)",
        },
        primaryPaddingX: {
          type: "number",
          label: "Primary Button Padding X (px)",
        },
        primaryPaddingY: {
          type: "number",
          label: "Primary Button Padding Y (px)",
        },
        primaryFontSize: {
          type: "number",
          label: "Primary Button Font Size (px)",
        },
        primaryFontWeight: {
          type: "select",
          label: "Primary Button Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Semi Bold (600)", value: "600" },
            { label: "Bold (700)", value: "700" },
          ],
        },
        secondaryBg: colorPickerField("Secondary Button Background"),
        secondaryColor: colorPickerField("Secondary Button Text Color"),
        secondaryBorderColor: colorPickerField("Secondary Button Border Color"),
        secondaryBorderWidth: {
          type: "number",
          label: "Secondary Button Border Width (px)",
        },
        secondaryBorderStyle: {
          type: "select",
          label: "Secondary Button Border Style",
          options: [
            { label: "None", value: "none" },
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
          ],
        },
        secondaryBorderRadius: {
          type: "number",
          label: "Secondary Button Border Radius (px)",
        },
        secondaryPaddingX: {
          type: "number",
          label: "Secondary Button Padding X (px)",
        },
        secondaryPaddingY: {
          type: "number",
          label: "Secondary Button Padding Y (px)",
        },
        secondaryFontSize: {
          type: "number",
          label: "Secondary Button Font Size (px)",
        },
        secondaryFontWeight: {
          type: "select",
          label: "Secondary Button Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Semi Bold (600)", value: "600" },
            { label: "Bold (700)", value: "700" },
          ],
        },

        // ── Section Layout ───────────────────────────────────────
        columnGap: { type: "number", label: "Column Gap (px)" },
        contentWidth: { type: "number", label: "Text Column Width (%)" },
        ...sectionFields,
      },

      defaultProps: {
        badge: "",
        heading: "About Bamboo Flooring",
        subheading: "Flooring You Can Trust",
        description:
          "Since 2003, Clever Choice has been delivering premium flooring solutions across Australia. From engineered timber and hybrid flooring to laminate and bamboo, our products are designed to combine beauty, durability, and long-term value.",
        listItems: [
          { icon: "✓", text: "Carefully selected raw materials and finishes" },
          {
            icon: "✓",
            text: "Water-resistant and scratch-resistant technologies",
          },
          { icon: "✓", text: "Designed for Australian climate conditions" },
        ],
        primaryButtonLabel: "",
        primaryButtonLink: "",
        secondaryButtonLabel: "",
        secondaryButtonLink: "",
        image1: "",
        image1Alt: "Flooring image 1",
        image2: "",
        image2Alt: "Flooring image 2",
        imageLayout: "right",
        imageBorderRadius: 8,
        image1Height: 480,
        image2Height: 320,
        image2Width: 55,
        imageGap: 12,
        imageOverlap: -80,
        headingColor: "1a1207",
        headingFontSize: 32,
        headingFontWeight: "800",
        headingFontFamily: "Georgia, 'Times New Roman', serif",
        subheadingColor: "1a1207",
        subheadingFontSize: 18,
        bodyColor: "374151",
        bodyFontSize: 15,
        listIconColor: "92400e",
        listTextColor: "374151",
        listIconSize: 14,
        listTextSize: 15,
        listGap: 16,
        primaryBg: "1a1207",
        primaryColor: "ffffff",
        primaryBorderColor: "1a1207",
        primaryBorderWidth: 2,
        primaryBorderStyle: "solid",
        primaryBorderRadius: 4,
        primaryPaddingX: 28,
        primaryPaddingY: 12,
        primaryFontSize: 14,
        primaryFontWeight: "600",
        secondaryBg: "ffffff",
        secondaryColor: "1a1207",
        secondaryBorderColor: "1a1207",
        secondaryBorderWidth: 2,
        secondaryBorderStyle: "solid",
        secondaryBorderRadius: 4,
        secondaryPaddingX: 28,
        secondaryPaddingY: 12,
        secondaryFontSize: 14,
        secondaryFontWeight: "600",
        columnGap: 64,
        contentWidth: 52,
        backgroundColor: "f5f0ea",
        paddingTop: 80,
        paddingBottom: 80,
        paddingLeft: 48,
        paddingRight: 48,
      },

      render: ({
        badge,
        heading,
        subheading,
        description,
        listItems,
        primaryButtonLabel,
        primaryButtonLink,
        secondaryButtonLabel,
        secondaryButtonLink,
        image1,
        image1Alt,
        image2,
        image2Alt,
        imageLayout,
        imageBorderRadius,
        image1Height,
        image2Height,
        image2Width,
        imageGap,
        imageOverlap,
        headingColor,
        headingFontSize,
        headingFontWeight,
        headingFontFamily,
        subheadingColor,
        subheadingFontSize,
        bodyColor,
        bodyFontSize,
        listIconColor,
        listTextColor,
        listIconSize,
        listTextSize,
        listGap,
        primaryBg,
        primaryColor,
        primaryBorderColor,
        primaryBorderWidth,
        primaryBorderStyle,
        primaryBorderRadius,
        primaryPaddingX,
        primaryPaddingY,
        primaryFontSize,
        primaryFontWeight,
        secondaryBg,
        secondaryColor,
        secondaryBorderColor,
        secondaryBorderWidth,
        secondaryBorderStyle,
        secondaryBorderRadius,
        secondaryPaddingX,
        secondaryPaddingY,
        secondaryFontSize,
        secondaryFontWeight,
        columnGap,
        contentWidth,
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const isRight = imageLayout !== "left";
        const uid = `about-${(heading || "section").replace(/\W+/g, "-").toLowerCase()}`;

        const textCol = (
          <div
            style={{
              flex: `0 0 ${contentWidth ?? 52}%`,
              maxWidth: `${contentWidth ?? 52}%`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {badge && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: `#${listIconColor || "92400e"}`,
                  marginBottom: 14,
                  opacity: 0.85,
                }}
              >
                {badge}
              </span>
            )}
            <h2
              style={{
                fontFamily: headingFontFamily || "Georgia, serif",
                fontSize: headingFontSize ? `${headingFontSize}px` : "32px",
                fontWeight: headingFontWeight || 800,
                color: headingColor ? `#${headingColor}` : "#1a1207",
                lineHeight: 1.15,
                margin: 0,
                marginBottom: 20,
              }}
            >
              {heading || "About Us"}
            </h2>
            {description && (
              <p
                style={{
                  fontSize: bodyFontSize ? `${bodyFontSize}px` : "15px",
                  color: bodyColor ? `#${bodyColor}` : "#374151",
                  lineHeight: 1.75,
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                {description}
              </p>
            )}
            {subheading && (
              <h3
                style={{
                  fontSize: subheadingFontSize
                    ? `${subheadingFontSize}px`
                    : "18px",
                  fontWeight: 700,
                  color: subheadingColor ? `#${subheadingColor}` : "#1a1207",
                  margin: 0,
                  marginBottom: 16,
                }}
              >
                {subheading}
              </h3>
            )}
            {listItems?.length > 0 && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  marginBottom: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: listGap ? `${listGap}px` : "16px",
                }}
              >
                {listItems.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: listIconSize ? `${listIconSize}px` : "14px",
                        color: listIconColor ? `#${listIconColor}` : "#92400e",
                        fontWeight: 700,
                        lineHeight: "1.6",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon || "✓"}
                    </span>
                    <span
                      style={{
                        fontSize: listTextSize ? `${listTextSize}px` : "15px",
                        color: listTextColor ? `#${listTextColor}` : "#374151",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {(primaryButtonLabel || secondaryButtonLabel) && (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {primaryButtonLabel && (
                  <a
                    href={primaryButtonLink || "#"}
                    style={{
                      display: "inline-block",
                      padding: `${primaryPaddingY ?? 12}px ${primaryPaddingX ?? 28}px`,
                      background: primaryBg ? `#${primaryBg}` : "#1a1207",
                      color: primaryColor ? `#${primaryColor}` : "#ffffff",
                      fontSize: primaryFontSize
                        ? `${primaryFontSize}px`
                        : "14px",
                      fontWeight: primaryFontWeight || 600,
                      textDecoration: "none",
                      borderRadius: primaryBorderRadius
                        ? `${primaryBorderRadius}px`
                        : "4px",
                      border:
                        primaryBorderStyle && primaryBorderStyle !== "none"
                          ? `${primaryBorderWidth ?? 2}px ${primaryBorderStyle} #${primaryBorderColor || "1a1207"}`
                          : "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {primaryButtonLabel}
                  </a>
                )}
                {secondaryButtonLabel && (
                  <a
                    href={secondaryButtonLink || "#"}
                    style={{
                      display: "inline-block",
                      padding: `${secondaryPaddingY ?? 12}px ${secondaryPaddingX ?? 28}px`,
                      background: secondaryBg ? `#${secondaryBg}` : "#ffffff",
                      color: secondaryColor ? `#${secondaryColor}` : "#1a1207",
                      fontSize: secondaryFontSize
                        ? `${secondaryFontSize}px`
                        : "14px",
                      fontWeight: secondaryFontWeight || 600,
                      textDecoration: "none",
                      borderRadius: secondaryBorderRadius
                        ? `${secondaryBorderRadius}px`
                        : "4px",
                      border:
                        secondaryBorderStyle && secondaryBorderStyle !== "none"
                          ? `${secondaryBorderWidth ?? 2}px ${secondaryBorderStyle} #${secondaryBorderColor || "1a1207"}`
                          : "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {secondaryButtonLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        );

        const imageCol = (
          <div
            style={{
              flex: `0 0 calc(${100 - (contentWidth ?? 52)}% - ${columnGap ?? 64}px)`,
              position: "relative",
              minHeight: image1Height ? `${image1Height}px` : "480px",
            }}
          >
            {/* Image 1 — large, left-aligned in the image col */}
            {image1 ? (
              <img
                src={image1}
                alt={image1Alt || ""}
                loading="lazy"
                style={{
                  width: `${100 - (image2Width ?? 55) - 4}%`,
                  height: image1Height ? `${image1Height}px` : "480px",
                  objectFit: "cover",
                  borderRadius: imageBorderRadius
                    ? `${imageBorderRadius}px`
                    : "8px",
                  display: "block",
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: `${100 - (image2Width ?? 55) - 4}%`,
                  height: image1Height ? `${image1Height}px` : "480px",
                  borderRadius: imageBorderRadius
                    ? `${imageBorderRadius}px`
                    : "8px",
                  background: "#d1c9bc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontSize: 13,
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              >
                Image 1
              </div>
            )}
            {/* Image 2 — smaller, right + slightly offset upward */}
            {image2 ? (
              <img
                src={image2}
                alt={image2Alt || ""}
                loading="lazy"
                style={{
                  width: `${image2Width ?? 55}%`,
                  height: image2Height ? `${image2Height}px` : "320px",
                  objectFit: "cover",
                  borderRadius: imageBorderRadius
                    ? `${imageBorderRadius}px`
                    : "8px",
                  display: "block",
                  position: "absolute",
                  right: 0,
                  bottom: imageOverlap != null ? `${imageOverlap}px` : "-80px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
                }}
              />
            ) : (
              <div
                style={{
                  width: `${image2Width ?? 55}%`,
                  height: image2Height ? `${image2Height}px` : "320px",
                  borderRadius: imageBorderRadius
                    ? `${imageBorderRadius}px`
                    : "8px",
                  background: "#bfb9af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                  fontSize: 13,
                  position: "absolute",
                  right: 0,
                  bottom: imageOverlap != null ? `${imageOverlap}px` : "-80px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
                }}
              >
                Image 2
              </div>
            )}
          </div>
        );

        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <section
            id={htmlId || undefined}
            className={`${className || ""} ${uid}`}
            style={{
              ...buildStyle(styleProps),
              backgroundColor: styleProps.backgroundColor
                ? styleProps.backgroundColor
                : "#f5f0ea",
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
            <style>{`
            .${uid}-inner {
              display: flex;
              align-items: center;
              gap: ${columnGap ?? 64}px;
              position: relative;
              zIndex: 1;
              paddingBottom: ${(image2Height ?? 320) > (image1Height ?? 480) ? 0 : Math.abs(imageOverlap ?? 80)}px;
            }
            @media (max-width: 768px) {
              .${uid}-inner {
                flex-direction: column !important;
              }
              .${uid}-inner > * {
                max-width: 100% !important;
                flex: 0 0 100% !important;
                width: 100% !important;
              }
            }
          `}</style>
            <div
              className={`${uid}-inner`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: `${columnGap ?? 64}px`,
                position: "relative",
                zIndex: 1,
                paddingBottom: Math.abs(imageOverlap ?? 80),
              }}
            >
              {isRight ? textCol : imageCol}
              {isRight ? imageCol : textCol}
            </div>
          </section>
        );
      },
    },
    Heading: {
      label: <BlockLabel icon={HeadingIcon} label="Heading" color="#7c3aed" />,
      fields: {
        text: { type: "textarea", label: "Text" },
        tag: {
          type: "select",
          label: "Heading Tag",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        htmlId: { type: "text", label: "HTML id" },
        className: { type: "text", label: "Class name" },
        ...typographyFields,
        ...spacingFields,
        ...effectFields,
      },
      defaultProps: { text: "Heading text here", tag: "h2" },
      render: ({ text, tag, htmlId, className, ...props }) => {
        const Tag = tag || "h2";
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <>
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Tag
              id={htmlId || undefined}
              className={className || undefined}
              style={buildStyle(styleProps)}
            >
              {text}
            </Tag>
          </>
        );
      },
    },

    Paragraph: {
      label: <BlockLabel icon={AlignLeft} label="Paragraph" color="#0891b2" />,
      fields: {
        text: { type: "textarea", label: "Content" },
        ...sectionFields,
      },
      defaultProps: {
        text: "Enter your text here...",
        paddingTop: 16,
        paddingBottom: 16,
      },
      render: ({ text, htmlId, className, ...props }) => (
        (() => {
          const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
          return (
            <>
              {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
              <div
                id={htmlId || undefined}
                className={className || undefined}
                style={buildStyle(styleProps)}
              >
                <p>{text}</p>
              </div>
            </>
          );
        })()
      ),
    },

    SectionsGrid: {
      label: (
        <BlockLabel icon={Columns3} label="Sections Grid" color="#2563eb" />
      ),
      fields: {
        title: { type: "text", label: "Section Title" },
        showTitle: {
          type: "select",
          label: "Show Title",
          options: [
            { label: "Yes", value: "true" },
            { label: "No", value: "false" },
          ],
        },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "1 Column", value: 1 },
            { label: "2 Columns", value: 2 },
            { label: "3 Columns", value: 3 },
            { label: "4 Columns", value: 4 },
            { label: "5 Columns", value: 5 },
            { label: "6 Columns", value: 6 },
          ],
        },
        columnsMobile: {
          type: "select",
          label: "Columns (Mobile)",
          options: [
            { label: "1 Column", value: 1 },
            { label: "2 Columns", value: 2 },
          ],
        },
        columnsTablet: {
          type: "select",
          label: "Columns (Tablet)",
          options: [
            { label: "1 Column", value: 1 },
            { label: "2 Columns", value: 2 },
            { label: "3 Columns", value: 3 },
          ],
        },
        gridGap: { type: "number", label: "Column Gap (px)" },
        rowGap: { type: "number", label: "Row Gap (px)" },
        items: { type: "slot" },
        ...sectionFields,
      },
      defaultProps: {
        title: "Section",
        showTitle: "true",
        columns: 3,
        columnsMobile: 1,
        columnsTablet: 2,
        gridGap: 24,
        rowGap: 24,
        paddingTop: 48,
        paddingBottom: 48,
        paddingLeft: 24,
        paddingRight: 24,
      },
      render: (props) => {
        const Items = props.items;
        const {
          title,
          showTitle,
          columns,
          columnsMobile,
          columnsTablet,
          overlayColor,
          gridGap,
          rowGap,
          display,
          flexDirection,
          alignItems,
          justifyContent,
          flexWrap,
          gap,
          gridTemplateColumns,
          items,
          htmlId,
          className,
          ...wrapperProps
        } = props;

        const uid = `pg-${(title || "grid").replace(/\s+/g, "-").toLowerCase()}`;
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(
          htmlId,
          wrapperProps,
        );

        return (
          <div
            id={htmlId || undefined}
            className={className || undefined}
            style={{
              ...buildStyle(styleProps),
              position: "relative",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
            <style>{`
          .${uid}-grid {
            display: grid !important;
            grid-template-columns: repeat(${columns || 3}, 1fr) !important;
            gap: ${rowGap || 24}px ${gridGap || 24}px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          @media (max-width: 1024px) {
            .${uid}-grid {
              grid-template-columns: repeat(${columnsTablet || 2}, 1fr) !important;
            }
          }
          @media (max-width: 640px) {
            .${uid}-grid {
              grid-template-columns: repeat(${columnsMobile || 1}, 1fr) !important;
            }
          }
        `}</style>
            <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
              {showTitle !== "false" && title && (
                <h2
                  style={{
                    marginBottom: 24,
                    fontSize: "1.5rem",
                    fontWeight: 700,
                  }}
                >
                  {title}
                </h2>
              )}
              {Items && typeof Items === "function" ? (
                <Items
                  className={`${uid}-grid`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns || 3}, 1fr)`,
                    gap: `${rowGap || 24}px ${gridGap || 24}px`,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              ) : (
                <div className={`${uid}-grid`}>
                  {Array.from({ length: columns || 3 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        border: "2px dashed #d1d5db",
                        borderRadius: 8,
                        minHeight: 140,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9ca3af",
                        fontSize: 13,
                        background: "#f9fafb",
                      }}
                    >
                      Drop card here
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      },
    },

    CallToAction: {
      label: (
        <BlockLabel
          icon={MousePointerClick}
          label="Call to Action"
          color="#dc2626"
        />
      ),
      fields: {
        title: { type: "text", label: "Heading" },
        description: { type: "textarea", label: "Description" },
        content: {
          type: "slot",
          allow: ["Button", "Heading", "Paragraph", "Image", "SectionsGrid"],
        },
        ...sectionFields,
      },
      defaultProps: {
        title: "Call to Action",
        paddingTop: 64,
        paddingBottom: 64,
        textAlign: "center",
        backgroundColor: "#000000",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      render: ({
        title,
        description,
        content: Content,
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <div
            id={htmlId || undefined}
            className={className || undefined}
            style={{ ...buildStyle(styleProps), position: "relative" }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
            <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
              <h2 style={{ marginBottom: 16 }}>{title}</h2>
              {description && (
                <p style={{ marginBottom: 24, opacity: 0.8 }}>{description}</p>
              )}
              <Content />
            </div>
          </div>
        );
      },
    },

    CardSection: {
      label: (
        <BlockLabel icon={LayoutGrid} label="Card Section" color="#059669" />
      ),
      fields: {
        title: { type: "text", label: "Section Title" },
        layout: {
          type: "select",
          label: "Layout",
          options: [
            { label: "Grid", value: "grid" },
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
        },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2", value: "repeat(2,1fr)" },
            { label: "3", value: "repeat(3,1fr)" },
            { label: "4", value: "repeat(4,1fr)" },
          ],
        },
        items: {
          type: "slot",
          allow: [
            "Card",
            "Heading",
            "Paragraph",
            "Image",
            "SectionsGrid",
            "Button",
            "ImageSection",
          ],
        },
        ...sectionFields,
      },
      defaultProps: {
        layout: "grid",
        columns: "repeat(3,1fr)",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 24,
        paddingRight: 24,
        gap: 24,
      },
      render: ({
        title,
        layout,
        columns,
        items: Items,
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <div
            id={htmlId || undefined}
            className={className || undefined}
            style={{ ...buildStyle(styleProps), position: "relative" }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
            <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            {title && <h2 style={{ marginBottom: 24 }}>{title}</h2>}
            {Items && typeof Items === "function" ? (
              <Items
                style={
                  layout === "horizontal"
                    ? {
                        display: "flex",
                        gap: props.gap ? `${props.gap}px` : "24px",
                        overflowX: "auto",
                        paddingBottom: 6,
                        scrollSnapType: "x mandatory",
                      }
                    : layout === "vertical"
                      ? {
                          display: "flex",
                          flexDirection: "column",
                          gap: props.gap ? `${props.gap}px` : "24px",
                        }
                      : {
                          display: "grid",
                          gridTemplateColumns: columns,
                          gap: props.gap ? `${props.gap}px` : "24px",
                        }
                }
                className={
                  layout === "horizontal"
                    ? "cms-cardsection-horizontal"
                    : undefined
                }
              />
            ) : (
              <div
                style={
                  layout === "horizontal"
                    ? {
                        display: "flex",
                        gap: props.gap ? `${props.gap}px` : "24px",
                        overflowX: "auto",
                        paddingBottom: 6,
                      }
                    : layout === "vertical"
                      ? {
                          display: "flex",
                          flexDirection: "column",
                          gap: props.gap ? `${props.gap}px` : "24px",
                        }
                      : {
                          display: "grid",
                          gridTemplateColumns: columns,
                          gap: props.gap ? `${props.gap}px` : "24px",
                        }
                }
              >
                <div style={{ opacity: 0.6, fontSize: 13 }}>
                  Drop cards here
                </div>
              </div>
            )}
            </div>
          </div>
        );
      },
    },

    ImageSection: {
      label: (
        <BlockLabel icon={ImageIcon} label="Image + Text" color="#0284c7" />
      ),
      fields: {
        image: { type: "text", label: "Image URL" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        imageWidth: { type: "number", label: "Image Column Width (%)" },
        imageHeight: { type: "number", label: "Image Height (px)" },
        orientation: {
          type: "select",
          label: "Orientation",
          options: [
            { label: "Horizontal", value: "horizontal" },
            { label: "Vertical", value: "vertical" },
          ],
        },
        reverse: {
          type: "select",
          label: "Layout",
          options: [
            { label: "Image Left", value: "false" },
            { label: "Image Right", value: "true" },
          ],
        },
        ...sectionFields,
      },
      defaultProps: {
        title: "Section Title",
        description: "Description goes here",
        orientation: "horizontal",
        reverse: "false",
        imageWidth: 50,
        imageHeight: 320,
        paddingTop: 40,
        paddingBottom: 40,
        display: "flex",
        alignItems: "center",
        gap: 32,
      },
      render: ({
        image,
        title,
        description,
        orientation,
        reverse,
        imageWidth,
        imageHeight,
        overlayColor,
        htmlId,
        className,
        ...props
      }) => (
        (() => {
          const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
          return (
            <div
              id={htmlId || undefined}
              className={className || undefined}
              style={{
                ...buildStyle(styleProps),
                position: "relative",
                display: "flex",
                flexDirection:
                  orientation === "vertical"
                    ? reverse === "true"
                      ? "column-reverse"
                      : "column"
                    : reverse === "true"
                      ? "row-reverse"
                      : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 32,
              }}
            >
              {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
              <Overlay color={overlayColor} />
              <div
                style={{
                  flex:
                    orientation === "vertical"
                      ? "0 0 auto"
                      : `0 0 ${imageWidth || 50}%`,
                  width: orientation === "vertical" ? "100%" : undefined,
                }}
              >
                <img
                  src={image}
                  alt={title}
                  style={{
                    width: "100%",
                    height: imageHeight ? `${imageHeight}px` : undefined,
                    objectFit: "cover",
                    borderRadius: styleProps.borderRadius
                      ? `${styleProps.borderRadius}px`
                      : undefined,
                  }}
                />
              </div>
              <div style={{ flex: 1, zIndex: 1 }}>
                <h2 style={{ marginBottom: 12 }}>{title}</h2>
                <p style={{ lineHeight: 1.7 }}>{description}</p>
              </div>
            </div>
          );
        })()
      ),
    },

    Spacer: {
      label: <BlockLabel icon={Maximize2} label="Spacer" color="#64748b" />,
      fields: {
        height: { type: "number", label: "Height (px)" },
        backgroundColor: colorPickerField("Background Color"),
      },
      defaultProps: { height: 40 },
      render: ({ height, backgroundColor }) => (
        <div
          style={{
            height: height ? `${height}px` : "40px",
            backgroundColor: backgroundColor || "transparent",
          }}
        />
      ),
    },

    Card: {
      label: <BlockLabel icon={CreditCard} label="Card" color="#7c3aed" />,
      inline: true,
      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        titleTag: {
          type: "select",
          label: "Title Tag",
          options: [
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ],
        },
        titleColor: colorPickerField("Title Color"),
        titleFontSize: { type: "number", label: "Title Font Size (px)" },
        titleFontWeight: {
          type: "select",
          label: "Title Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Medium (500)", value: "500" },
            { label: "Semi Bold (600)", value: "600" },
            { label: "Bold (700)", value: "700" },
            { label: "Extra Bold (800)", value: "800" },
          ],
        },
        titleTextAlign: {
          type: "select",
          label: "Title Align",
          options: ["left", "center", "right"],
        },
        descriptionColor: colorPickerField("Description Color"),
        descriptionFontSize: {
          type: "number",
          label: "Description Font Size (px)",
        },
        descriptionFontWeight: {
          type: "select",
          label: "Description Font Weight",
          options: [
            { label: "Normal (400)", value: "400" },
            { label: "Medium (500)", value: "500" },
            { label: "Semi Bold (600)", value: "600" },
          ],
        },
        descriptionTextAlign: {
          type: "select",
          label: "Description Align",
          options: ["left", "center", "right"],
        },
        image: { type: "text", label: "Image URL" },
        imageHeight: { type: "number", label: "Image Height (px)" },
        cardHeight: { type: "number", label: "Card Height (px)" },
        colSpan: {
          type: "select",
          label: "Column Span",
          options: [
            { label: "1 column", value: 1 },
            { label: "2 columns", value: 2 },
            { label: "3 columns", value: 3 },
          ],
        },
        ...sectionFields,
      },
      defaultProps: {
        title: "Card Title",
        description: "Card description here",
        titleTag: "h3",
        titleColor: "#111827",
        titleFontSize: 16,
        titleFontWeight: "600",
        titleTextAlign: "left",
        descriptionColor: "#6b7280",
        descriptionFontSize: 14,
        descriptionFontWeight: "400",
        descriptionTextAlign: "left",
        colSpan: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        backgroundColor: "#ffffff",
        imageHeight: 180,
        cardHeight: 0,
      },
      render: ({
        title,
        description,
        titleTag,
        titleColor,
        titleFontSize,
        titleFontWeight,
        titleTextAlign,
        descriptionColor,
        descriptionFontSize,
        descriptionFontWeight,
        descriptionTextAlign,
        image,
        imageHeight,
        cardHeight,
        colSpan,
        puck,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <div
            ref={puck.dragRef}
            id={htmlId || undefined}
            className={className || undefined}
            style={{
              ...buildStyle(styleProps),
              gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
              width: "100%",
              height: cardHeight ? `${cardHeight}px` : "100%",
              minHeight: cardHeight ? `${cardHeight}px` : undefined,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            {image && (
              <img
                src={image}
                alt={title}
                style={{
                  height: imageHeight ? `${imageHeight}px` : 180,
                  objectFit: "cover",
                  display: "block",
                  marginTop: -(styleProps.paddingTop || 16),
                  marginLeft: -(styleProps.paddingLeft || 16),
                  marginRight: -(styleProps.paddingRight || 16),
                  width: `calc(100% + ${(styleProps.paddingLeft || 16) + (styleProps.paddingRight || 16)}px)`,
                  marginBottom: 12,
                  borderRadius: styleProps.borderRadius
                    ? `${styleProps.borderRadius}px ${styleProps.borderRadius}px 0 0`
                    : 0,
                }}
              />
            )}
            {(() => {
              const Tag = titleTag || "h3";
              return (
                <Tag
                  style={{
                    fontSize: titleFontSize ? `${titleFontSize}px` : "1rem",
                    fontWeight: titleFontWeight || 600,
                    marginBottom: 8,
                    color: titleColor || "#111827",
                    textAlign: titleTextAlign || undefined,
                  }}
                >
                  {title}
                </Tag>
              );
            })()}
            <p
              style={{
                fontSize: descriptionFontSize
                  ? `${descriptionFontSize}px`
                  : "0.875rem",
                color: descriptionColor || "#6b7280",
                fontWeight: descriptionFontWeight || undefined,
                textAlign: descriptionTextAlign || undefined,
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              {description}
            </p>
          </div>
        );
      },
    },

    Image: {
      label: <BlockLabel icon={ImageBlockIcon} label="Image" color="#0284c7" />,
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        width: { type: "text", label: "Width (px / % / auto)" },
        ...borderFields,
        ...spacingFields,
        ...effectFields,
        objectFit: {
          type: "select",
          label: "Object Fit",
          options: ["fill", "contain", "cover", "none", "scale-down"],
        },
      },
      defaultProps: { alt: "Image", width: "100%" },
      render: ({ src, alt, width, objectFit, htmlId, className, ...props }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
        <div id={htmlId || undefined} className={className || undefined} style={buildStyle(styleProps)}>
          {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
          <img
            src={src}
            alt={alt || ""}
            style={{
              width: width || "100%",
              objectFit: objectFit || undefined,
              display: "block",
              borderRadius: styleProps.borderRadius
                ? `${styleProps.borderRadius}px`
                : undefined,
            }}
          />
        </div>
      );
      },
    },

    Button: {
      label: <BlockLabel icon={Link} label="Button" color="#2563eb" />,
      fields: {
        label: { type: "text", label: "Label" },
        link: { type: "text", label: "URL" },
        target: {
          type: "select",
          label: "Open In",
          options: [
            { label: "Same Tab", value: "_self" },
            { label: "New Tab", value: "_blank" },
          ],
        },
        ...typographyFields,
        ...backgroundFields,
        ...borderFields,
        ...spacingFields,
        ...layoutFields,
        ...effectFields,
      },
      defaultProps: {
        label: "Click Me",
        link: "#",
        target: "_self",
        backgroundColor: "#000000",
        color: "#ffffff",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 24,
        paddingRight: 24,
        borderRadius: 6,
        fontWeight: "600",
        fontSize: 14,
        cursor: "pointer",
        display: "inline-block",
      },
      render: ({ label, link, target, htmlId, className, ...props }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <>
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <a
              id={htmlId || undefined}
              className={className || undefined}
              href={link}
              target={target || "_self"}
              rel="noopener noreferrer"
              style={{ ...buildStyle(styleProps), textDecoration: "none" }}
            >
              {label}
            </a>
          </>
        );
      },
    },

    FeatureGrid: {
      label: (
        <BlockLabel icon={Sparkles} label="Feature Grid" color="#d97706" />
      ),
      fields: {
        title: { type: "text", label: "Section Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
          ],
        },
        items: {
          type: "array",
          label: "Features",
          arrayFields: {
            title: { type: "text", label: "Title" },
            description: { type: "textarea", label: "Description" },
            icon: { type: "text", label: "Icon (emoji or text)" },
          },
        },
        ...sectionFields,
      },
      defaultProps: {
        title: "Why shop with us",
        subtitle: "Beautiful sections you can reuse across pages.",
        columns: 3,
        items: [
          {
            icon: "⚡",
            title: "Fast delivery",
            description: "Reliable shipping with live tracking.",
          },
          {
            icon: "🛡️",
            title: "Secure payments",
            description: "Trusted payment providers and fraud protection.",
          },
          {
            icon: "💬",
            title: "Support",
            description: "Friendly support whenever you need it.",
          },
        ],
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#ffffff",
      },
      render: ({
        title,
        subtitle,
        columns,
        items = [],
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <section
            id={htmlId || undefined}
            className={className || undefined}
            style={{ ...buildStyle(styleProps), position: "relative" }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              {title && (
                <h2 style={{ fontWeight: 800, marginBottom: 10 }}>{title}</h2>
              )}
              {subtitle && (
                <p style={{ opacity: 0.75, maxWidth: 720, margin: "0 auto" }}>
                  {subtitle}
                </p>
              )}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Number(columns) || 3}, minmax(0, 1fr))`,
                gap: 16,
              }}
            >
              {items.map((f, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 18,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 10 }}>
                    {f.icon || "✨"}
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>
                    {f.title || "Feature title"}
                  </div>
                  <div style={{ color: "#6b7280", lineHeight: 1.65 }}>
                    {f.description || ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>
        );
      },
    },

    Testimonials: {
      label: <BlockLabel icon={Quote} label="Testimonials" color="#9333ea" />,
      fields: {
        title: { type: "text", label: "Section Title" },
        description: { type: "textarea", label: "Description" },
        direction: {
          type: "select",
          label: "Slider Direction",
          options: [
            { label: "Left to right", value: "ltr" },
            { label: "Right to left", value: "rtl" },
          ],
        },
        cardWidth: { type: "number", label: "Card Width (px)" },
        gap: { type: "number", label: "Gap (px)" },
        autoScroll: {
          type: "select",
          label: "Auto Scroll",
          options: [
            { label: "Off", value: "false" },
            { label: "On", value: "true" },
          ],
        },
        autoScrollDuration: {
          type: "number",
          label: "Auto Scroll Duration (s)",
        },
        autoScrollDelay: { type: "number", label: "Auto Scroll Delay (s)" },
        items: {
          type: "array",
          label: "Testimonials",
          arrayFields: {
            name: { type: "text", label: "Name" },
            role: { type: "text", label: "Role" },
            quote: { type: "textarea", label: "Quote" },
            avatar: { type: "text", label: "Avatar URL (optional)" },
          },
        },
        ...sectionFields,
      },
      defaultProps: {
        title: "What customers say",
        description: "What customers say about us",
        direction: "ltr",
        cardWidth: 340,
        gap: 16,
        autoScroll: "false",
        autoScrollDuration: 30,
        autoScrollDelay: 0,
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#f9fafb",
        items: [
          {
            name: "Ayesha Rahman",
            role: "Customer",
            quote: "Great quality, fast delivery. Exactly what I needed.",
          },
          {
            name: "Rohit Sen",
            role: "Customer",
            quote: "Smooth checkout and awesome support team.",
          },
          {
            name: "Maria Gomez",
            role: "Customer",
            quote: "The products look premium and the site is easy to use.",
          },
        ],
      },
      render: ({
        title,
        description,
        direction,
        cardWidth,
        gap,
        autoScroll,
        autoScrollDuration,
        autoScrollDelay,
        items = [],
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <section
            id={htmlId || undefined}
            className={className || undefined}
            style={{ ...buildStyle(styleProps), position: "relative" }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            {title && (
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <h2 style={{ fontWeight: 800 }}>{title}</h2>
              </div>
            )}
            {description && (
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <p style={{ opacity: 0.75, maxWidth: 720, margin: "0 auto" }}>
                  {description}
                </p>
              </div>
            )}
            {(() => {
              const uid = `t-${(title || "testimonials").replace(/\s+/g, "-").toLowerCase()}`;
              const scrollItems =
                autoScroll === "true" && items.length > 0
                  ? [...items, ...items]
                  : items;
              return (
                <>
                  {autoScroll === "true" && (
                    <style>{`
                      .${uid} { overflow: hidden !important; }
                      .${uid}-track {
                        width: max-content;
                        animation-name: ${uid}-marquee;
                        animation-duration: ${Math.max(6, Number(autoScrollDuration) || 30)}s;
                        animation-delay: ${Math.max(0, Number(autoScrollDelay) || 0)}s;
                        animation-timing-function: linear;
                        animation-iteration-count: infinite;
                      }
                      .${uid}:hover .${uid}-track { animation-play-state: paused; }
                      @keyframes ${uid}-marquee {
                        from { transform: translateX(${direction === "rtl" ? "-50%" : "0%"}); }
                        to { transform: translateX(${direction === "rtl" ? "0%" : "-50%"}); }
                      }
                    `}</style>
                  )}
                  <div
                    className={`${uid}`}
                    style={{
                      direction: direction || "ltr",
                      display: "flex",
                      gap: `${gap ?? 16}px`,
                      overflowX: "auto",
                      paddingBottom: 8,
                      scrollSnapType: "x mandatory",
                    }}
                  >
                    <div
                      className={`${autoScroll === "true" ? `${uid}-track` : ""}`}
                      style={{ display: "flex", gap: `${gap ?? 16}px` }}
                    >
                      {scrollItems.map((t, idx) => (
                        <figure
                          key={`${t.name || "item"}-${idx}`}
                          style={{
                            flex: `0 0 ${cardWidth || 340}px`,
                            scrollSnapAlign: "start",
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 16,
                            padding: 18,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                          }}
                        >
                          <div
                            style={{
                              color: "#111827",
                              fontWeight: 700,
                              marginBottom: 10,
                            }}
                          >
                            "{t.quote || ""}"
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              marginTop: 14,
                            }}
                          >
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 999,
                                overflow: "hidden",
                                background: "#e5e7eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#374151",
                                fontWeight: 800,
                                flexShrink: 0,
                              }}
                            >
                              {t.avatar ? (
                                <img
                                  src={t.avatar}
                                  alt={t.name || "Avatar"}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                (t.name || "C").slice(0, 1).toUpperCase()
                              )}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{ fontWeight: 700, color: "#111827" }}
                              >
                                {t.name || "Customer"}
                              </div>
                              <div style={{ fontSize: 12, color: "#6b7280" }}>
                                {t.role || ""}
                              </div>
                            </div>
                          </div>
                        </figure>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
          </section>
        );
      },
    },

    Accordion: {
      label: <BlockLabel icon={HelpCircle} label="Accordion" color="#0891b2" />,
      fields: {
        title: { type: "text", label: "Section Title" },
        items: {
          type: "array",
          label: "Questions",
          arrayFields: {
            q: { type: "text", label: "Question" },
            a: { type: "textarea", label: "Answer" },
          },
        },
        ...sectionFields,
      },
      defaultProps: {
        title: "Frequently asked questions",
        items: [
          {
            q: "How long does delivery take?",
            a: "Typically 2–5 business days depending on your location.",
          },
          {
            q: "Can I return items?",
            a: "Yes, returns are accepted within 7 days for eligible items.",
          },
          {
            q: "Do you offer support?",
            a: "Absolutely — contact us anytime via email or phone.",
          },
        ],
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#ffffff",
      },
      render: ({
        title,
        items = [],
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <section
            id={htmlId || undefined}
            className={className || undefined}
            style={{ ...buildStyle(styleProps), position: "relative" }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <style>{`
              .cms-accordion details[open] { border-color: #c7d2fe !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
              .cms-accordion details[open] summary { color: #3730a3 !important; }
            `}</style>
            {title && (
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <h2 style={{ fontWeight: 800 }}>{title}</h2>
              </div>
            )}
            <div className="cms-accordion" style={{ display: "grid", gap: 12 }}>
              {items.map((it, idx) => (
                <details
                  key={idx}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 14,
                    background: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {it.q || "Question"}
                  </summary>
                  <div
                    style={{ marginTop: 10, color: "#6b7280", lineHeight: 1.7 }}
                  >
                    {it.a || ""}
                  </div>
                </details>
              ))}
            </div>
          </div>
          </section>
        );
      },
    },

    Stats: {
      label: <BlockLabel icon={BarChart2} label="Stats" color="#16a34a" />,
      fields: {
        title: { type: "text", label: "Section Title" },
        items: {
          type: "array",
          label: "Stats",
          arrayFields: {
            label: { type: "text", label: "Label" },
            value: { type: "text", label: "Value" },
          },
        },
        ...sectionFields,
      },
      defaultProps: {
        title: "Trusted by thousands",
        items: [
          { label: "Happy customers", value: "12k+" },
          { label: "Products", value: "2.4k" },
          { label: "Avg. rating", value: "4.8/5" },
          { label: "Delivery SLA", value: "48h" },
        ],
        paddingTop: 56,
        paddingBottom: 56,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#111827",
        color: "#ffffff",
      },
      render: ({
        title,
        items = [],
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <section
            id={htmlId || undefined}
            className={className || undefined}
            style={{ ...buildStyle(styleProps), position: "relative" }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {title && <h2 style={{ fontWeight: 800, margin: 0 }}>{title}</h2>}
            </div>
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {items.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    padding: 16,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 900 }}>
                    {s.value || ""}
                  </div>
                  <div style={{ opacity: 0.75, marginTop: 4 }}>
                    {s.label || ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </section>
        );
      },
    },

    Divider: {
      label: <BlockLabel icon={Minus} label="Divider" color="#94a3b8" />,
      fields: {
        height: { type: "number", label: "Height (px)" },
        color: colorPickerField("Line Color"),
        ...spacingFields,
      },
      defaultProps: {
        height: 1,
        color: "#e5e7eb",
        marginTop: 24,
        marginBottom: 24,
      },
      render: ({ height, color, htmlId, className, ...props }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
        <div id={htmlId || undefined} className={className || undefined} style={buildStyle(styleProps)}>
          {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
          <div
            style={{
              height: height || 1,
              background: color || "#e5e7eb",
              width: "100%",
            }}
          />
        </div>
      );
      },
    },

    Newsletter: {
      label: <BlockLabel icon={Mail} label="Newsletter" color="#dc2626" />,
      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        placeholder: { type: "text", label: "Input Placeholder" },
        buttonText: { type: "text", label: "Button Text" },
        ...sectionFields,
      },
      defaultProps: {
        title: "Subscribe to our newsletter",
        description: "Get updates on new products and special offers.",
        placeholder: "Enter your email",
        buttonText: "Subscribe",
        paddingTop: 56,
        paddingBottom: 56,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: "center",
        backgroundColor: "#eef2ff",
        color: "#111827",
      },
      render: ({
        title,
        description,
        placeholder,
        buttonText,
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
        <section
          id={htmlId || undefined}
          className={className || undefined}
          style={{ ...buildStyle(styleProps), position: "relative" }}
        >
          {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
          <Overlay color={overlayColor} />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 760,
              margin: "0 auto",
            }}
          >
            {title && (
              <h2 style={{ fontWeight: 800, marginBottom: 8 }}>{title}</h2>
            )}
            {description && (
              <p style={{ opacity: 0.8, marginBottom: 16 }}>{description}</p>
            )}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                placeholder={placeholder || "Email"}
                style={{
                  minWidth: 240,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                }}
              />
              <button
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "#4f46e5",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {buttonText || "Subscribe"}
              </button>
            </div>
          </div>
        </section>
      );
      },
    },

    Footer: {
      label: <BlockLabel icon={PanelBottom} label="Footer" color="#374151" />,
      fields: {
        brand: { type: "text", label: "Brand" },
        tagline: { type: "textarea", label: "Tagline" },
        columns: {
          type: "array",
          label: "Columns",
          arrayFields: {
            title: { type: "text", label: "Title" },
            links: {
              type: "array",
              label: "Links",
              arrayFields: {
                label: { type: "text", label: "Label" },
                href: { type: "text", label: "Href" },
              },
            },
          },
        },
        socialLinks: {
          type: "array",
          label: "Social Links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "Href" },
          },
        },
        contactEmail: { type: "text", label: "Contact Email" },
        contactPhone: { type: "text", label: "Contact Phone" },
        bottomLinks: {
          type: "array",
          label: "Bottom Links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "Href" },
          },
        },
        links: {
          type: "array",
          label: "Links",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "Href" },
          },
        },
        ...sectionFields,
      },
      defaultProps: {
        brand: "MyHomeStore",
        tagline: "Modern home essentials for everyday living.",
        contactEmail: "support@myhomestore.com",
        contactPhone: "+1 (555) 010-020",
        socialLinks: [
          { label: "Facebook", href: "#" },
          { label: "Instagram", href: "#" },
          { label: "Twitter", href: "#" },
        ],
        columns: [
          {
            title: "Company",
            links: [
              { label: "About", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Press", href: "/press" },
            ],
          },
          {
            title: "Help",
            links: [
              { label: "Support", href: "/support" },
              { label: "Shipping", href: "/shipping" },
              { label: "Returns", href: "/returns" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ],
          },
        ],
        bottomLinks: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Cookies", href: "/cookies" },
        ],
        links: [
          { label: "Products", href: "/products" },
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
        paddingTop: 56,
        paddingBottom: 56,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#0b1220",
        color: "#ffffff",
      },
      render: ({
        brand,
        tagline,
        columns = [],
        socialLinks = [],
        contactEmail,
        contactPhone,
        bottomLinks = [],
        links = [],
        overlayColor,
        htmlId,
        className,
        ...props
      }) => {
        const { styleProps, responsiveStyleTag } = getBlockStyleContext(htmlId, props);
        return (
          <footer
            id={htmlId || undefined}
            className={className || undefined}
            style={{ ...buildStyle(styleProps), position: "relative" }}
          >
            {responsiveStyleTag && <style>{responsiveStyleTag}</style>}
            <Overlay color={overlayColor} />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 1100,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 2fr",
                gap: 22,
              }}
            >
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>
                  {brand || ""}
                </div>
                {tagline && (
                  <div
                    style={{ opacity: 0.75, marginTop: 10, lineHeight: 1.7 }}
                  >
                    {tagline}
                  </div>
                )}
                <div
                  style={{
                    marginTop: 14,
                    display: "grid",
                    gap: 6,
                    opacity: 0.85,
                  }}
                >
                  {contactEmail && (
                    <div style={{ fontSize: 13 }}>Email: {contactEmail}</div>
                  )}
                  {contactPhone && (
                    <div style={{ fontSize: 13 }}>Phone: {contactPhone}</div>
                  )}
                </div>
                {socialLinks.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginTop: 14,
                    }}
                  >
                    {socialLinks.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.href || "#"}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          opacity: 0.85,
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {s.label || "Social"}
                      </a>
                    ))}
                  </div>
                )}
                <div style={{ opacity: 0.55, marginTop: 16, fontSize: 12 }}>
                  © {new Date().getFullYear()} {brand || ""}. All rights
                  reserved.
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 18,
                }}
              >
                {(columns.length ? columns : [{ title: "Links", links }]).map(
                  (c, idx) => (
                    <div key={idx} style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: 12,
                          letterSpacing: 0.6,
                          textTransform: "uppercase",
                          opacity: 0.85,
                        }}
                      >
                        {c.title || "Section"}
                      </div>
                      <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                        {(c.links || []).map((l, j) => (
                          <a
                            key={j}
                            href={l.href || "#"}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              opacity: 0.8,
                              fontSize: 13,
                            }}
                          >
                            {l.label || "Link"}
                          </a>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
            {bottomLinks.length > 0 && (
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  opacity: 0.9,
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  Built with MyHomeStore CMS
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {bottomLinks.map((l, idx) => (
                    <a
                      key={idx}
                      href={l.href || "#"}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        opacity: 0.75,
                        fontSize: 12,
                      }}
                    >
                      {l.label || "Link"}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          </footer>
        );
      },
    },
  },
};
