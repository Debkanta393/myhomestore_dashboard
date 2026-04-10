
import KPICard from "../components/dashboard/KPICard";
import OrdersChart from "../components/dashboard/OrdersChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import BrandChart from "../components/dashboard/BrandChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import InventoryChart from "../components/dashboard/InventoryChart";
import TrafficChart from "../components/dashboard/TrafficChart";
import OrdersTable from "../components/dashboard/OrdersTable";
import TopProducts from "../components/dashboard/TopProducts";
import { kpiCards } from "../data/dashboardData";
import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";

export default function Dashboard() {

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-[#8c6f61] text-white
       shadow-[0_18px_60px_rgba(79,70,229,0.18)]">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
              Store performance at a glance
            </h1>
            <p className="mt-2 text-sm text-white/80 max-w-xl">
              Track orders, revenue, inventory, and customer activity. Use the tiles below to spot trends fast.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold hover:bg-white/15
             transition cursor-pointer">
              <CalendarDays size={16} />
              Last 30 days
              <ArrowUpRight size={16} className="opacity-80" />
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-white text-[#998e8a] text-sm font-extrabold shadow-lg shadow-black/10 hover:bg-indigo-50
             transition cursor-pointer">
              View reports
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpiCards.map((kpi, i) => (
          <KPICard key={i} {...kpi} delay={i * 0.05} />
        ))}
      </div>

      {/* Row 1: Orders Area + Revenue Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <OrdersChart />
        <RevenueChart />
      </div>

      {/* Row 2: Brand Donut + Category Pie + Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <BrandChart />
        <CategoryChart />
        <InventoryChart />
      </div>

      {/* Row 3: Traffic Line + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TrafficChart />
        <TopProducts />
      </div>

      {/* Row 4: Full width Orders Table */}
      <OrdersTable />
    </div>
  );
}