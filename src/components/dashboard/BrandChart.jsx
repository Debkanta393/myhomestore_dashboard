import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import Card from "./Card";
import { brandData } from "../../data/dashboardData";

export default function BrandChart() {
  const [active, setActive] = useState(null);

  return (
    <Card title="Sales by Brand" subtitle="% share of total tile revenue" delay={0.35}>
      <div className="flex flex-col gap-3.5">
        <ResponsiveContainer width="100%" height={190}>
          <PieChart>
            <Pie
              data={brandData}
              cx="50%" cy="50%"
              innerRadius={52} outerRadius={82}
              paddingAngle={3} dataKey="value"
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {brandData.map((b, i) => (
                <Cell
                  key={i} fill={b.color} stroke="none"
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

        <div className="grid grid-cols-2 gap-1">
          {brandData.map((b, i) => (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-default transition-colors duration-150
                ${active === i ? "bg-surfoff" : ""}`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.color }} />
              <span className="text-[12px] text-muted flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{b.name}</span>
              <span className="text-[12px] font-bold text-tx tabnum">{b.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}