import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Users, Mail, Phone } from "lucide-react";

const SAMPLE_CUSTOMERS = [
  {
    id: "CUS-8012",
    name: "Ayesha Rahman",
    email: "ayesha@email.com",
    phone: "+1 (555) 012-208",
    orders: 6,
    spent: 542.25,
    segment: "VIP",
    lastOrder: "2026-04-05",
  },
  {
    id: "CUS-8011",
    name: "Rohit Sen",
    email: "rohit@email.com",
    phone: "+1 (555) 010-124",
    orders: 2,
    spent: 129.99,
    segment: "Returning",
    lastOrder: "2026-04-04",
  },
  {
    id: "CUS-8010",
    name: "Maria Gomez",
    email: "maria@email.com",
    phone: "+1 (555) 010-778",
    orders: 1,
    spent: 89.0,
    segment: "New",
    lastOrder: "2026-04-03",
  },
  {
    id: "CUS-8009",
    name: "Nayeem Ahmed",
    email: "nayeem@email.com",
    phone: "+1 (555) 010-010",
    orders: 4,
    spent: 310.75,
    segment: "Returning",
    lastOrder: "2026-04-02",
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

const SEGMENT_STYLES = {
  VIP: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Returning: "bg-emerald-50 text-emerald-700 border-emerald-200",
  New: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Customers() {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("");

  const customers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_CUSTOMERS.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      const matchesSegment = !segment || c.segment === segment;
      return matchesQuery && matchesSegment;
    });
  }, [query, segment]);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Customers
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {customers.length} customer{customers.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-lg shadow-gray-900/10 hover:bg-gray-800 transition">
          Add Customer
        </button>
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
              placeholder="Search by name, email, or id…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm
                         focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition"
            />
          </div>

          <div className="relative md:w-64">
            <Users
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="w-full appearance-none pl-9 pr-9 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition cursor-pointer"
            >
              <option value="">All segments</option>
              {Object.keys(SEGMENT_STYLES).map((s) => (
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
          <p className="col-span-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Customer
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Segment
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Orders
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Spent
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400 text-right pr-2">
            Last order
          </p>
        </div>

        <AnimatePresence mode="wait">
          {customers.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center"
            >
              <p className="text-sm font-semibold text-gray-700">
                No customers found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try changing filters or search terms.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={query + segment}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="divide-y divide-gray-100"
            >
              {customers.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-12 gap-3 px-5 py-3.5 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="col-span-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {c.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Mail size={13} /> {c.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={13} /> {c.phone}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${
                        SEGMENT_STYLES[c.segment] ||
                        "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {c.segment}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-gray-700">{c.orders}</p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatMoney(c.spent)}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-end pr-2">
                    <p className="text-sm text-gray-600">{c.lastOrder}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

