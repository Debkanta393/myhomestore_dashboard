
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

export default function Dashboard() {

  return (
    <div className="flex min-h-screen bg-bg">

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <main className="flex-1 p-5 overflow-y-auto space-y-4">

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

        </main>
      </div>
    </div>
  );
}