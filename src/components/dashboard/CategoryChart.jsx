import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import Card from "./Card";
import { categoryData } from "../../data/dashboardData";

export default function CategoryChart() {
  const [active, setActive] = useState(null);

  return (
    <Card title="Sales by Category" subtitle="Product type breakdown" delay={0.4}>
      <div className="flex flex-col gap-3.5">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%" cy="50%"
              outerRadius={82} paddingAngle={2} dataKey="value"
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {categoryData.map((c, i) => (
                <Cell
                  key={i} fill={c.color} stroke="none"
                  opacity={active === null || active === i ? 1 : 0.35}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active: a, payload: p }) => {
                if (!a || !p?.length) return null;
                const d = p[0].payload;
                return (
                  <div className="bg-surface2 border border-border rounded-lg px-3.5 py-2 shadow-md text-[13px]">
                    <span className="font-bold" style={{ color: d.color }}>{d.name}</span>: {d.value}%
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col gap-2">
          {categoryData.map((c, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="flex items-center gap-2 cursor-default"
            >
              <span className="w-2 h-2 rounded-[2px] flex-shrink-0" style={{ background: c.color }} />
              <span className="text-[12px] text-muted flex-1">{c.name}</span>
              <div className="flex-[2] h-[5px] bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: c.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${c.value}%` }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="text-[12px] font-bold text-tx tabnum min-w-[28px] text-right">
                {c.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}