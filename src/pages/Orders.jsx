import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  ChevronDown,
  PackageCheck,
  Truck,
  XCircle,
  Clock,
} from "lucide-react";

const STATUS_STYLES = {
  Processing: {
    icon: Clock,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Shipped: {
    icon: Truck,
    pill: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Delivered: {
    icon: PackageCheck,
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Cancelled: {
    icon: XCircle,
    pill: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const SAMPLE_ORDERS = [
  {
    id: "ORD-10241",
    customer: "Ayesha Rahman",
    items: 3,
    total: 128.4,
    status: "Processing",
    date: "2026-04-05",
    payment: "Paid",
  },
  {
    id: "ORD-10240",
    customer: "Rohit Sen",
    items: 1,
    total: 49.99,
    status: "Shipped",
    date: "2026-04-04",
    payment: "Paid",
  },
  {
    id: "ORD-10239",
    customer: "Maria Gomez",
    items: 2,
    total: 89.0,
    status: "Delivered",
    date: "2026-04-03",
    payment: "Paid",
  },
  {
    id: "ORD-10238",
    customer: "Nayeem Ahmed",
    items: 4,
    total: 212.75,
    status: "Cancelled",
    date: "2026-04-02",
    payment: "Refunded",
  },
];

function formatMoney(v) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(v);
  } catch {
    return `$${Number(v || 0).toFixed(2)}`;
  }
}

export default function Orders() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const orders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_ORDERS.filter((o) => {
      const matchesQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q);
      const matchesStatus = !status || o.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-800 shadow-sm hover:shadow transition">
            Export
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition">
            Create Order
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order id or customer…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm
                         focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition"
            />
          </div>

          <div className="relative md:w-64">
            <Filter
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full appearance-none pl-9 pr-9 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition cursor-pointer"
            >
              <option value="">All status</option>
              {Object.keys(STATUS_STYLES).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p className="col-span-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Order
          </p>
          <p className="col-span-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Customer
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Date
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Total
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400 text-right pr-2">
            Status
          </p>
        </div>

        <AnimatePresence mode="wait">
          {orders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center"
            >
              <p className="text-sm font-semibold text-gray-700">
                No orders found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try changing filters or search terms.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={query + status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-gray-100"
            >
              {orders.map((o) => {
                const cfg = STATUS_STYLES[o.status] || STATUS_STYLES.Processing;
                const Icon = cfg.icon;
                return (
                  <div
                    key={o.id}
                    className="grid grid-cols-12 gap-3 px-5 py-3.5 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className="col-span-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {o.id}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {o.items} item{o.items !== 1 ? "s" : ""} • {o.payment}
                      </p>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <p className="text-sm text-gray-700">{o.customer}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <p className="text-sm text-gray-600">{o.date}</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(o.total)}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.pill}`}
                      >
                        <Icon size={14} />
                        {o.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

