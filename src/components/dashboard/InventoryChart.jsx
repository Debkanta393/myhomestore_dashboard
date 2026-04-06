import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Card from "./Card";
import ChartTooltip from "./ChartTooltip";
import { inventoryData } from "../../data/dashboardData";

export default function InventoryChart() {
  return (
    <Card title="Inventory Status" subtitle="In Stock / Low Stock / Out of Stock" delay={0.45}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={inventoryData}
          layout="vertical"
          margin={{ top: 0, right: 20, left: 12, bottom: 0 }}
          barSize={14}
        >
          <XAxis type="number" tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="cat" tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} width={75} />
          <Tooltip content={<ChartTooltip suffix=" units" />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Bar dataKey="inStock" name="In Stock"     stackId="a" fill="var(--color-success)" />
          <Bar dataKey="low"     name="Low Stock"    stackId="a" fill="var(--color-gold)" />
          <Bar dataKey="out"     name="Out of Stock" stackId="a" fill="var(--color-error)" radius={[0,4,4,0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}