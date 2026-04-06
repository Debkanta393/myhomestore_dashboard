import { motion } from "framer-motion";
import Card from "./Card";
import { topProducts } from "../../data/dashboardData";

export default function TopProducts() {
  return (
    <Card title="Top Products" subtitle="Best-selling tiles this year" delay={0.6}>
      <div className="flex flex-col gap-0.5">
        {topProducts.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.65 + i * 0.07 }}
            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-surfoff transition-colors duration-150 cursor-default"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 tabnum"
              style={{
                background: "var(--color-primary)",
                opacity: 0.55 + i * 0.1,
              }}
            >
              #{p.rank}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-tx truncate">{p.name}</p>
              <p className="text-[12px] text-muted">{p.brand}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-[13px] font-semibold text-tx tabnum">{p.sold} sold</p>
              <p className="text-[11px]" style={{ color: "var(--color-success)" }}>
                ₹{(p.rev / 1000).toFixed(0)}K
              </p>
            </div>

            <div
              className="px-2 py-1 rounded-md text-[11px] font-bold flex-shrink-0"
              style={{
                background: "var(--color-gold)" + "22",
                color: "var(--color-gold)",
              }}
            >
              ★ {p.rating}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}