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
} from "./styleFields.jsx";

// All style field groups merged for section-level components
const sectionFields = {
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
    // ── HERO ────────────────────────────────────────────────────────────────
    Hero: {
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        content: { type: "slot", allow: ["Text", "Button", "Image"] },
        ...sectionFields,
      },
      defaultProps: {
        title: "Hero Title",
        subtitle: "A short subtitle here",
        paddingTop: 80,
        paddingBottom: 80,
        textAlign: "center",
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
      render: ({
        title,
        subtitle,
        content: Content,
        overlayColor,
        ...props
      }) => (
        <div style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            <h1>{title}</h1>
            {subtitle && (
              <p style={{ marginTop: 12, opacity: 0.85 }}>{subtitle}</p>
            )}
            <div style={{ marginTop: 24 }}>
              <Content />
            </div>
          </div>
        </div>
      ),
    },

    // ── TEXT BLOCK ──────────────────────────────────────────────────────────
    TextBlock: {
      fields: {
        text: { type: "textarea", label: "Content" },
        ...sectionFields,
      },
      defaultProps: {
        text: "Enter your text here...",
        paddingTop: 16,
        paddingBottom: 16,
      },
      render: ({ text, ...props }) => (
        <div style={buildStyle(props)}>
          <p>{text}</p>
        </div>
      ),
    },

    // ── BANNER ──────────────────────────────────────────────────────────────
    Banner: {
      fields: {
        content: { type: "slot", allow: ["Text", "Button"] },
        ...sectionFields,
      },
      defaultProps: {
        paddingTop: 60,
        paddingBottom: 60,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        textAlign: "center",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
      },
      render: ({ content: Content, overlayColor, ...props }) => (
        <div style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            <Content />
          </div>
        </div>
      ),
    },

    // ── PRODUCT GRID ────────────────────────────────────────────────────────
    ProductGrid: {
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
        title: "Products",
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
          ...wrapperProps
        } = props;

        // Unique ID for responsive styles
        const uid = `pg-${(title || "grid").replace(/\s+/g, "-").toLowerCase()}`;

        return (
          <div
            style={{
              ...buildStyle(wrapperProps),
              position: "relative",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Overlay color={overlayColor} />

            {/* Responsive breakpoint styles */}
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

              {/* ✅ KEY FIX: pass style + className directly to <Items />
              This makes the slot wrapper itself the CSS grid container
              so each card is a direct grid child */}
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
                // Empty state
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

    // ── CTA ─────────────────────────────────────────────────────────────────
    CTA: {
      fields: {
        title: { type: "text", label: "Heading" },
        description: { type: "textarea", label: "Description" },
        content: { type: "slot", allow: ["Button", "Text"] },
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
        ...props
      }) => (
        <div style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            <h2 style={{ marginBottom: 16 }}>{title}</h2>
            {description && (
              <p style={{ marginBottom: 24, opacity: 0.8 }}>{description}</p>
            )}
            <Content />
          </div>
        </div>
      ),
    },

    // ── CARD SECTION ────────────────────────────────────────────────────────
    CardSection: {
      fields: {
        title: { type: "text", label: "Section Title" },
        columns: {
          type: "select",
          label: "Columns",
          options: [
            { label: "2", value: "repeat(2,1fr)" },
            { label: "3", value: "repeat(3,1fr)" },
            { label: "4", value: "repeat(4,1fr)" },
          ],
        },
        items: { type: "slot", allow: ["Card"] },
        ...sectionFields,
      },
      defaultProps: {
        columns: "repeat(3,1fr)",
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 24,
        paddingRight: 24,
        gap: 24,
      },
      render: ({ title, columns, items: Items, overlayColor, ...props }) => (
        <div style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1 }}>
            {title && <h2 style={{ marginBottom: 24 }}>{title}</h2>}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: columns,
                gap: props.gap ? `${props.gap}px` : "24px",
              }}
            >
              <Items />
            </div>
          </div>
        </div>
      ),
    },

    // ── IMAGE TEXT ──────────────────────────────────────────────────────────
    ImageText: {
      fields: {
        image: { type: "text", label: "Image URL" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        imageWidth: { type: "number", label: "Image Column Width (%)" },
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
        reverse: "false",
        imageWidth: 50,
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
        reverse,
        imageWidth,
        overlayColor,
        ...props
      }) => (
        <div
          style={{
            ...buildStyle(props),
            position: "relative",
            display: "flex",
            flexDirection: reverse === "true" ? "row-reverse" : "row",
          }}
        >
          <Overlay color={overlayColor} />
          <div style={{ flex: `0 0 ${imageWidth || 50}%` }}>
            <img
              src={image}
              alt={title}
              style={{
                width: "100%",
                borderRadius: props.borderRadius
                  ? `${props.borderRadius}px`
                  : undefined,
              }}
            />
          </div>
          <div style={{ flex: 1, zIndex: 1 }}>
            <h2 style={{ marginBottom: 12 }}>{title}</h2>
            <p style={{ lineHeight: 1.7 }}>{description}</p>
          </div>
        </div>
      ),
    },

    // ── SPACER ──────────────────────────────────────────────────────────────
    Spacer: {
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

    // ── CARD ────────────────────────────────────────────────────────────────
    Card: {
      inline: true, // ✅ removes Puck's wrapper div — card becomes direct grid child

      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        image: { type: "text", label: "Image URL" },
        imageHeight: { type: "number", label: "Image Height (px)" },
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
      },
      render: ({
        title,
        description,
        image,
        imageHeight,
        colSpan,
        puck,
        ...props
      }) => (
        <div
          ref={puck.dragRef}
          style={{
            ...buildStyle(props),
            gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined, // ← span multiple columns
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {image && (
            <img
              src={image}
              alt={title}
              style={{
                height: imageHeight ? `${imageHeight}px` : 180,
                objectFit: "cover",
                display: "block",
                marginTop: -(props.paddingTop || 16),
                marginLeft: -(props.paddingLeft || 16),
                marginRight: -(props.paddingRight || 16),
                width: `calc(100% + ${(props.paddingLeft || 16) + (props.paddingRight || 16)}px)`,
                marginBottom: 12,
                borderRadius: props.borderRadius
                  ? `${props.borderRadius}px ${props.borderRadius}px 0 0`
                  : 0,
              }}
            />
          )}
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 8 }}>
            {title}
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {description}
          </p>
        </div>
      ),
    },

    // ── TEXT ────────────────────────────────────────────────────────────────
    Text: {
      fields: {
        text: { type: "textarea", label: "Text" },
        ...typographyFields,
        ...spacingFields,
        ...effectFields,
      },
      defaultProps: { text: "Text content here" },
      render: ({ text, ...props }) => <p style={buildStyle(props)}>{text}</p>,
    },

    // ── IMAGE ───────────────────────────────────────────────────────────────
    Image: {
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
      render: ({ src, alt, width, objectFit, ...props }) => (
        <div style={buildStyle(props)}>
          <img
            src={src}
            alt={alt || ""}
            style={{
              width: width || "100%",
              objectFit: objectFit || undefined,
              display: "block",
              borderRadius: props.borderRadius
                ? `${props.borderRadius}px`
                : undefined,
            }}
          />
        </div>
      ),
    },

    // ── BUTTON ──────────────────────────────────────────────────────────────
    Button: {
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
      render: ({ label, link, target, ...props }) => (
        <a
          href={link}
          target={target || "_self"}
          rel="noopener noreferrer"
          style={{ ...buildStyle(props), textDecoration: "none" }}
        >
          {label}
        </a>
      ),
    },
  },
};
