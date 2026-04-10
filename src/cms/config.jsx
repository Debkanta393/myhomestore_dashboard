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

// All style field groups merged for section-level components
const sectionFields = {
  htmlId: { type: "text", label: "HTML id" },
  className: { type: "text", label: "Class name" },
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
        return (
          <Tag id={htmlId || undefined} className={className || undefined} style={buildStyle(props)}>
            {text}
          </Tag>
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
        <div id={htmlId || undefined} className={className || undefined} style={buildStyle(props)}>
          <p>{text}</p>
        </div>
      ),
    },

    SectionsGrid: {
      label: <BlockLabel icon={Columns3} label="Sections Grid" color="#2563eb" />,
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

        return (
          <div
            id={htmlId || undefined}
            className={className || undefined}
            style={{
              ...buildStyle(wrapperProps),
              position: "relative",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
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
                <h2 style={{ marginBottom: 24, fontSize: "1.5rem", fontWeight: 700 }}>
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
      label: <BlockLabel icon={MousePointerClick} label="Call to Action" color="#dc2626" />,
      fields: {
        title: { type: "text", label: "Heading" },
        description: { type: "textarea", label: "Description" },
        content: { type: "slot", allow: ["Button", "Heading", "Paragraph", "Image", "SectionsGrid"] },
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
      render: ({ title, description, content: Content, overlayColor, ...props }) => (
        <div style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            <h2 style={{ marginBottom: 16 }}>{title}</h2>
            {description && <p style={{ marginBottom: 24, opacity: 0.8 }}>{description}</p>}
            <Content />
          </div>
        </div>
      ),
    },

    CardSection: {
      label: <BlockLabel icon={LayoutGrid} label="Card Section" color="#059669" />,
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
        items: { type: "slot", allow: ["Card", "Heading", "Paragraph", "Image", "SectionsGrid", "Button", "ImageSection"] },
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
      render: ({ title, layout, columns, items: Items, overlayColor, htmlId, className, ...props }) => (
        <div id={htmlId || undefined} className={className || undefined} style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
            {title && <h2 style={{ marginBottom: 24 }}>{title}</h2>}
            {Items && typeof Items === "function" ? (
              <Items
                style={
                  layout === "horizontal"
                    ? { display: "flex", gap: props.gap ? `${props.gap}px` : "24px", overflowX: "auto", paddingBottom: 6, scrollSnapType: "x mandatory" }
                    : layout === "vertical"
                      ? { display: "flex", flexDirection: "column", gap: props.gap ? `${props.gap}px` : "24px" }
                      : { display: "grid", gridTemplateColumns: columns, gap: props.gap ? `${props.gap}px` : "24px" }
                }
                className={layout === "horizontal" ? "cms-cardsection-horizontal" : undefined}
              />
            ) : (
              <div
                style={
                  layout === "horizontal"
                    ? { display: "flex", gap: props.gap ? `${props.gap}px` : "24px", overflowX: "auto", paddingBottom: 6 }
                    : layout === "vertical"
                      ? { display: "flex", flexDirection: "column", gap: props.gap ? `${props.gap}px` : "24px" }
                      : { display: "grid", gridTemplateColumns: columns, gap: props.gap ? `${props.gap}px` : "24px" }
                }
              >
                <div style={{ opacity: 0.6, fontSize: 13 }}>Drop cards here</div>
              </div>
            )}
          </div>
        </div>
      ),
    },

    ImageSection: {
      label: <BlockLabel icon={ImageIcon} label="Image + Text" color="#0284c7" />,
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
      render: ({ image, title, description, orientation, reverse, imageWidth, imageHeight, overlayColor, htmlId, className, ...props }) => (
        <div
          id={htmlId || undefined}
          className={className || undefined}
          style={{
            ...buildStyle(props),
            position: "relative",
            display: "flex",
            flexDirection:
              orientation === "vertical"
                ? reverse === "true" ? "column-reverse" : "column"
                : reverse === "true" ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <Overlay color={overlayColor} />
          <div style={{ flex: orientation === "vertical" ? "0 0 auto" : `0 0 ${imageWidth || 50}%`, width: orientation === "vertical" ? "100%" : undefined }}>
            <img src={image} alt={title} style={{ width: "100%", height: imageHeight ? `${imageHeight}px` : undefined, objectFit: "cover", borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined }} />
          </div>
          <div style={{ flex: 1, zIndex: 1 }}>
            <h2 style={{ marginBottom: 12 }}>{title}</h2>
            <p style={{ lineHeight: 1.7 }}>{description}</p>
          </div>
        </div>
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
        <div style={{ height: height ? `${height}px` : "40px", backgroundColor: backgroundColor || "transparent" }} />
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
        descriptionFontSize: { type: "number", label: "Description Font Size (px)" },
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
        title, description, titleTag, titleColor, titleFontSize, titleFontWeight,
        titleTextAlign, descriptionColor, descriptionFontSize, descriptionFontWeight,
        descriptionTextAlign, image, imageHeight, cardHeight, colSpan, puck,
        htmlId, className, ...props
      }) => (
        <div
          ref={puck.dragRef}
          id={htmlId || undefined}
          className={className || undefined}
          style={{
            ...buildStyle(props),
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
                borderRadius: props.borderRadius ? `${props.borderRadius}px ${props.borderRadius}px 0 0` : 0,
              }}
            />
          )}
          {(() => {
            const Tag = titleTag || "h3";
            return (
              <Tag style={{ fontSize: titleFontSize ? `${titleFontSize}px` : "1rem", fontWeight: titleFontWeight || 600, marginBottom: 8, color: titleColor || "#111827", textAlign: titleTextAlign || undefined }}>
                {title}
              </Tag>
            );
          })()}
          <p style={{ fontSize: descriptionFontSize ? `${descriptionFontSize}px` : "0.875rem", color: descriptionColor || "#6b7280", fontWeight: descriptionFontWeight || undefined, textAlign: descriptionTextAlign || undefined, lineHeight: 1.6, flex: 1 }}>
            {description}
          </p>
        </div>
      ),
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
      render: ({ src, alt, width, objectFit, ...props }) => (
        <div style={buildStyle(props)}>
          <img src={src} alt={alt || ""} style={{ width: width || "100%", objectFit: objectFit || undefined, display: "block", borderRadius: props.borderRadius ? `${props.borderRadius}px` : undefined }} />
        </div>
      ),
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
      render: ({ label, link, target, ...props }) => (
        <a href={link} target={target || "_self"} rel="noopener noreferrer" style={{ ...buildStyle(props), textDecoration: "none" }}>
          {label}
        </a>
      ),
    },

    FeatureGrid: {
      label: <BlockLabel icon={Sparkles} label="Feature Grid" color="#d97706" />,
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
          { icon: "⚡", title: "Fast delivery", description: "Reliable shipping with live tracking." },
          { icon: "🛡️", title: "Secure payments", description: "Trusted payment providers and fraud protection." },
          { icon: "💬", title: "Support", description: "Friendly support whenever you need it." },
        ],
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#ffffff",
      },
      render: ({ title, subtitle, columns, items = [], overlayColor, htmlId, className, ...props }) => (
        <section id={htmlId || undefined} className={className || undefined} style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              {title && <h2 style={{ fontWeight: 800, marginBottom: 10 }}>{title}</h2>}
              {subtitle && <p style={{ opacity: 0.75, maxWidth: 720, margin: "0 auto" }}>{subtitle}</p>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Number(columns) || 3}, minmax(0, 1fr))`, gap: 16 }}>
              {items.map((f, idx) => (
                <div key={idx} style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon || "✨"}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title || "Feature title"}</div>
                  <div style={{ color: "#6b7280", lineHeight: 1.65 }}>{f.description || ""}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
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
        autoScrollDuration: { type: "number", label: "Auto Scroll Duration (s)" },
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
          { name: "Ayesha Rahman", role: "Customer", quote: "Great quality, fast delivery. Exactly what I needed." },
          { name: "Rohit Sen", role: "Customer", quote: "Smooth checkout and awesome support team." },
          { name: "Maria Gomez", role: "Customer", quote: "The products look premium and the site is easy to use." },
        ],
      },
      render: ({ title, description, direction, cardWidth, gap, autoScroll, autoScrollDuration, autoScrollDelay, items = [], overlayColor, htmlId, className, ...props }) => (
        <section id={htmlId || undefined} className={className || undefined} style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
            {title && <div style={{ textAlign: "center", marginBottom: 10 }}><h2 style={{ fontWeight: 800 }}>{title}</h2></div>}
            {description && <div style={{ textAlign: "center", marginBottom: 28 }}><p style={{ opacity: 0.75, maxWidth: 720, margin: "0 auto" }}>{description}</p></div>}
            {(() => {
              const uid = `t-${(title || "testimonials").replace(/\s+/g, "-").toLowerCase()}`;
              const scrollItems = autoScroll === "true" && items.length > 0 ? [...items, ...items] : items;
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
                  <div className={`${uid}`} style={{ direction: direction || "ltr", display: "flex", gap: `${gap ?? 16}px`, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory" }}>
                    <div className={`${autoScroll === "true" ? `${uid}-track` : ""}`} style={{ display: "flex", gap: `${gap ?? 16}px` }}>
                      {scrollItems.map((t, idx) => (
                        <figure key={`${t.name || "item"}-${idx}`} style={{ flex: `0 0 ${cardWidth || 340}px`, scrollSnapAlign: "start", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                          <div style={{ color: "#111827", fontWeight: 700, marginBottom: 10 }}>"{t.quote || ""}"</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 999, overflow: "hidden", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#374151", fontWeight: 800, flexShrink: 0 }}>
                              {t.avatar ? <img src={t.avatar} alt={t.name || "Avatar"} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (t.name || "C").slice(0, 1).toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 700, color: "#111827" }}>{t.name || "Customer"}</div>
                              <div style={{ fontSize: 12, color: "#6b7280" }}>{t.role || ""}</div>
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
      ),
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
          { q: "How long does delivery take?", a: "Typically 2–5 business days depending on your location." },
          { q: "Can I return items?", a: "Yes, returns are accepted within 7 days for eligible items." },
          { q: "Do you offer support?", a: "Absolutely — contact us anytime via email or phone." },
        ],
        paddingTop: 64,
        paddingBottom: 64,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: "#ffffff",
      },
      render: ({ title, items = [], overlayColor, htmlId, className, ...props }) => (
        <section id={htmlId || undefined} className={className || undefined} style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" }}>
            <style>{`
              .cms-accordion details[open] { border-color: #c7d2fe !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
              .cms-accordion details[open] summary { color: #3730a3 !important; }
            `}</style>
            {title && <div style={{ textAlign: "center", marginBottom: 22 }}><h2 style={{ fontWeight: 800 }}>{title}</h2></div>}
            <div className="cms-accordion" style={{ display: "grid", gap: 12 }}>
              {items.map((it, idx) => (
                <details key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700, color: "#111827" }}>{it.q || "Question"}</summary>
                  <div style={{ marginTop: 10, color: "#6b7280", lineHeight: 1.7 }}>{it.a || ""}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      ),
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
      render: ({ title, items = [], overlayColor, htmlId, className, ...props }) => (
        <section id={htmlId || undefined} className={className || undefined} style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
              {title && <h2 style={{ fontWeight: 800, margin: 0 }}>{title}</h2>}
            </div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
              {items.map((s, idx) => (
                <div key={idx} style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 16, background: "rgba(255,255,255,0.04)" }}>
                  <div style={{ fontSize: 22, fontWeight: 900 }}>{s.value || ""}</div>
                  <div style={{ opacity: 0.75, marginTop: 4 }}>{s.label || ""}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ),
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
      render: ({ height, color, ...props }) => (
        <div style={buildStyle(props)}>
          <div style={{ height: height || 1, background: color || "#e5e7eb", width: "100%" }} />
        </div>
      ),
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
      render: ({ title, description, placeholder, buttonText, overlayColor, htmlId, className, ...props }) => (
        <section id={htmlId || undefined} className={className || undefined} style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
            {title && <h2 style={{ fontWeight: 800, marginBottom: 8 }}>{title}</h2>}
            {description && <p style={{ opacity: 0.8, marginBottom: 16 }}>{description}</p>}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <input placeholder={placeholder || "Email"} style={{ minWidth: 240, padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14 }} />
              <button style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 14 }}>
                {buttonText || "Subscribe"}
              </button>
            </div>
          </div>
        </section>
      ),
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
          { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Press", href: "/press" }] },
          { title: "Help", links: [{ label: "Support", href: "/support" }, { label: "Shipping", href: "/shipping" }, { label: "Returns", href: "/returns" }] },
          { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
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
      render: ({ brand, tagline, columns = [], socialLinks = [], contactEmail, contactPhone, bottomLinks = [], links = [], overlayColor, htmlId, className, ...props }) => (
        <footer id={htmlId || undefined} className={className || undefined} style={{ ...buildStyle(props), position: "relative" }}>
          <Overlay color={overlayColor} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: 22 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{brand || ""}</div>
                {tagline && <div style={{ opacity: 0.75, marginTop: 10, lineHeight: 1.7 }}>{tagline}</div>}
                <div style={{ marginTop: 14, display: "grid", gap: 6, opacity: 0.85 }}>
                  {contactEmail && <div style={{ fontSize: 13 }}>Email: {contactEmail}</div>}
                  {contactPhone && <div style={{ fontSize: 13 }}>Phone: {contactPhone}</div>}
                </div>
                {socialLinks.length > 0 && (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                    {socialLinks.map((s, idx) => (
                      <a key={idx} href={s.href || "#"} style={{ color: "inherit", textDecoration: "none", opacity: 0.85, padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", fontSize: 12, fontWeight: 600 }}>
                        {s.label || "Social"}
                      </a>
                    ))}
                  </div>
                )}
                <div style={{ opacity: 0.55, marginTop: 16, fontSize: 12 }}>
                  © {new Date().getFullYear()} {brand || ""}. All rights reserved.
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
                {(columns.length ? columns : [{ title: "Links", links }]).map((c, idx) => (
                  <div key={idx} style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase", opacity: 0.85 }}>{c.title || "Section"}</div>
                    <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                      {(c.links || []).map((l, j) => (
                        <a key={j} href={l.href || "#"} style={{ color: "inherit", textDecoration: "none", opacity: 0.8, fontSize: 13 }}>{l.label || "Link"}</a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {bottomLinks.length > 0 && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.12)", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", opacity: 0.9 }}>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Built with MyHomeStore CMS</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {bottomLinks.map((l, idx) => (
                    <a key={idx} href={l.href || "#"} style={{ color: "inherit", textDecoration: "none", opacity: 0.75, fontSize: 12 }}>{l.label || "Link"}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </footer>
      ),
    },
  },
};
