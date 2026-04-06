import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";

export default function KPICard({ icon, label, value, prefix, suffix, delta, note, accent, delay = 0 }) {
  const isUp = delta >= 0;

  const ICONS = {
    ShoppingCart: "🛒", IndianRupee: "💰", Layers: "⬡",
    Users: "👥", Clock: "⏳", Star: "⭐",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: "var(--shadow-md)" }}
      className="bg-surface border border-border rounded-xl p-5 shadow-sm relative overflow-hidden cursor-default"
    >
      {/* Accent top strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-2">
            {label}
          </p>
          <p className="text-[27px] font-bold leading-none text-tx">
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className="text-[12px] font-bold"
              style={{ color: isUp ? "var(--color-success)" : "var(--color-error)" }}
            >
              {isUp ? "↑" : "↓"} {Math.abs(delta)}%
            </span>
            <span className="text-[12px] text-muted">{note}</span>
          </div>
        </div>

        <div
          className="w-11 h-11 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: accent + "22", color: accent }}
        >
          {ICONS[icon] || "📊"}
        </div>
      </div>
    </motion.div>
  );
}