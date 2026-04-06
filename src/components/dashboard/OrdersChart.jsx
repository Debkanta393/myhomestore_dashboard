import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Card from "./Card";
import Tabs from "./Tabs";
import ChartTooltip from "./ChartTooltip";
import { ordersData } from "../../data/dashboardData";

export default function OrdersChart() {
  const [range, setRange] = useState("1Y");
  const data = ordersData[range];

  return (
    <Card
      title="Orders Received"
      subtitle="Total orders placed & returned per period"
      delay={0.25}
      action={
        <Tabs options={["1M", "3M", "6M", "1Y"]} value={range} onChange={setRange} />
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="gOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gReturns" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-error)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--color-error)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-muted)" }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip suffix=" orders" />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Area type="monotone" dataKey="orders"  name="Orders"  stroke="var(--color-primary)" strokeWidth={2} fill="url(#gOrders)"  dot={false} activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="returns" name="Returns" stroke="var(--color-error)"   strokeWidth={1.5} fill="url(#gReturns)" dot={false} activeDot={{ r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}