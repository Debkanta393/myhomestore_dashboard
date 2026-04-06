import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Card from "./Card";
import ChartTooltip from "./ChartTooltip";
import { trafficData } from "../../data/dashboardData";

export default function TrafficChart() {
  return (
    <Card title="Weekly Site Traffic" subtitle="Visits & conversions this week" delay={0.5}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={trafficData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Line type="monotone" dataKey="visits"      name="Visits"      stroke="var(--color-blue)"   strokeWidth={2} dot={{ r: 3, fill: "var(--color-blue)" }}   activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="conversions" name="Conversions" stroke="var(--color-purple)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-purple)" }} activeDot={{ r: 5 }} strokeDasharray="5 3" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}