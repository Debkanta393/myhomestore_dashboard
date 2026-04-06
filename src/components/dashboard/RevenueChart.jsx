import {
  BarChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Card from "./Card";
import ChartTooltip from "./ChartTooltip";
import { revenueData } from "../../data/dashboardData";

export default function RevenueChart() {
  return (
    <Card
      title="Revenue vs Target"
      subtitle="Monthly revenue, target & cost (₹)"
      delay={0.3}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false}
            tickFormatter={(v) => "₹" + v / 1000 + "K"} />
          <Tooltip content={<ChartTooltip prefix="₹" />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Bar dataKey="revenue" name="Revenue" fill="var(--color-primary)" radius={[4,4,0,0]} maxBarSize={14} />
          <Bar dataKey="target"  name="Target"  fill="var(--color-border)"  radius={[4,4,0,0]} maxBarSize={14} />
          <Line type="monotone"  dataKey="cost" name="Cost" stroke="var(--color-orange)" strokeWidth={2} dot={false} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}