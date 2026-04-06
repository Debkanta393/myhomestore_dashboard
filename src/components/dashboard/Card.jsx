import { motion } from "framer-motion";

export default function Card({ title, subtitle, action, delay = 0, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-surface border border-border rounded-xl p-5 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-[15px] font-semibold text-tx">{title}</h3>
          {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {children}
    </motion.div>
  );
}