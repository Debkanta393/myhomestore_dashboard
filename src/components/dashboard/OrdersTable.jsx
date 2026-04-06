import { motion } from "framer-motion";
import Card from "./Card";
import StatusBadge from "./StatusBadge";
import { recentOrders } from "../../data/dashboardData";

const TH = ({ children }) => (
  <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted px-3 pb-3 border-b border-border whitespace-nowrap">
    {children}
  </th>
);

export default function OrdersTable() {
  return (
    <Card
      title="Recent Orders"
      subtitle="Latest transactions"
      delay={0.55}
      action={
        <button className="text-[12px] font-semibold text-primary bg-primaryhl px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity">
          View All →
        </button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <TH>Order</TH>
              <TH>Customer</TH>
              <TH>Items</TH>
              <TH>Amount</TH>
              <TH>Status</TH>
              <TH>Date</TH>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                className="border-b border-divider hover:bg-surfoff transition-colors duration-150 cursor-default"
              >
                <td className="px-3 py-3 text-[13px] font-semibold text-primary tabnum whitespace-nowrap">
                  #ORD-{order.id}
                </td>
                <td className="px-3 py-3 text-[13px] text-tx whitespace-nowrap">
                  {order.customer}
                </td>
                <td className="px-3 py-3 text-[13px] text-muted text-center tabnum">
                  {order.items}
                </td>
                <td className="px-3 py-3 text-[13px] font-semibold text-tx tabnum whitespace-nowrap">
                  ₹{order.amount.toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-3 py-3 text-[12px] text-muted whitespace-nowrap">
                  {order.date}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}