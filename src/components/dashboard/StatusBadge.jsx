const STYLES = {
  Delivered:  { bg: "#68a63f22", color: "#68a63f" },
  Processing: { bg: "#4d98a422", color: "#4d98a4" },
  Shipped:    { bg: "#528ec422", color: "#528ec4" },
  Pending:    { bg: "#e3ac3022", color: "#e3ac30" },
  Cancelled:  { bg: "#d9647022", color: "#d96470" },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] || { bg: "var(--color-border)", color: "var(--color-muted)" };
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}