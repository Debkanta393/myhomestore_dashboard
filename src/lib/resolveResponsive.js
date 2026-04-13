// lib/resolveResponsive.js

export const RESPONSIVE_MEDIA = {
  desktop: "(min-width: 1025px)",
  tablet:  "(max-width: 1024px)",
  mobile:  "(max-width: 768px)",
};

/**
 * Resolves a responsive value with cascade fallback.
 * mobile → tablet → desktop → ""
 */
export function resolveVal(val, bp = "desktop") {
  if (typeof val !== "object" || val === null) return val ?? "";
  if (bp === "mobile") return val.mobile ?? val.tablet ?? val.desktop ?? "";
  if (bp === "tablet") return val.tablet ?? val.desktop ?? "";
  return val.desktop ?? "";
}

/**
 * Returns the desktop value for inline style fallback.
 */
export function desktopVal(val) {
  return resolveVal(val, "desktop");
}

/**
 * Builds scoped media-query CSS blocks for responsive props.
 * propToCss: (propName, value) => "css-prop: value;" | null
 */
export function buildResponsiveCss(selector, responsiveProps, propToCss) {
  const blocks = { desktop: [], tablet: [], mobile: [] };

  for (const [propName, val] of Object.entries(responsiveProps)) {
    if (typeof val !== "object" || val === null) continue;
    for (const bp of ["desktop", "tablet", "mobile"]) {
      if (val[bp] !== undefined && val[bp] !== "") {
        const css = propToCss(propName, val[bp]);
        if (css) blocks[bp].push(css);
      }
    }
  }

  return [
    blocks.desktop.length
      ? `@media ${RESPONSIVE_MEDIA.desktop} { ${selector} { ${blocks.desktop.join(" ")} } }`
      : "",
    blocks.tablet.length
      ? `@media ${RESPONSIVE_MEDIA.tablet} { ${selector} { ${blocks.tablet.join(" ")} } }`
      : "",
    blocks.mobile.length
      ? `@media ${RESPONSIVE_MEDIA.mobile} { ${selector} { ${blocks.mobile.join(" ")} } }`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}