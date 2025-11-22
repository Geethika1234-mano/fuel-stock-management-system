import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Fuel, Truck, Database, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { apiFetch } from "../api/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [tanks, setTanks] = useState([]);
  const [sales, setSales] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

 const API_URL = "https://fuel-stock-backend-b6fccqcyc7exfbas.uksouth-01.azurewebsites.net";

useEffect(() => {
  async function loadData() {
    const token = localStorage.getItem("token");

    try {
      const [tanksRes, salesRes, stockRes] = await Promise.all([
        fetch(`${API_URL}/tanks`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/fuelsales`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/fuelstock`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setTanks(await tanksRes.json());
      setSales(await salesRes.json());
      setStock(await stockRes.json());
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  loadData();
}, []);

const [query, setQuery] = useState("");
// const filteredTanks = useMemo(
//   () => tanks.filter(t =>
//     `${t.TankID} ${t.StationID}`.toLowerCase().includes(query.toLowerCase())
//   ),
//   [tanks, query]
// );

  const totals = useMemo(() => {
    const totalStock = tanks.reduce((a, t) => a + (t.CurrentStock || 0), 0);
    const totalSales = sales.reduce((a, s) => a + (s.SaleValue || 0), 0);
    const totalLitresSold = sales.reduce((a, s) => a + (s.VolumeDispensed || 0), 0);
    return { totalStock, totalSales, totalLitresSold };
  }, [tanks, sales]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
     {/* Dashboard Header */}
<header className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-xl font-semibold text-[var(--ocean)]">
      Dashboard Overview
    </h1>
    <p className="text-sm text-slate-500">
      Live data summary across tanks, sales, and stock
    </p>
  </div>

  {/* Search bar (moved here) */}
  <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-1.5 shadow-sm hover:shadow-md transition-all">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-4 h-4 text-[var(--ocean)]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
      />
    </svg>
    <input
      type="text"
      placeholder="Search..."
      className="bg-transparent outline-none text-sm w-40 focus:w-60 transition-all"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  </div>
</header>


      {/* Stats Section */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Fuel size={18}/>} label="Litres Sold" value={`${totals.totalLitresSold.toLocaleString()} L`} sub="From FuelSales"/>
        <StatCard icon={<Truck size={18}/>} label="Sales Value" value={`£${totals.totalSales.toLocaleString()}`} sub="Today's Total"/>
        <StatCard icon={<Database size={18}/>} label="Stock On Hand" value={`${totals.totalStock.toLocaleString()} L`} sub="Across all tanks"/>
        <StatCard icon={<BarChart3 size={18}/>} label="Active Tanks" value={tanks.length} sub="Connected"/>
      </section>

      {/* Chart Section */}
      <motion.section
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        className="rounded-2xl bg-white shadow-md p-6 transition hover:shadow-lg"
      >
        <h3 className="font-semibold mb-4">Sales Trend</h3>
        {sales.length === 0 ? (
          <p className="text-sm text-slate-500">No sales data available.</p>
        ) : (
         <ResponsiveContainer width="100%" height={260}>
  <LineChart data={sales.slice(-10)} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
    {/* Light background grid */}
    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />

    {/* Axes */}
    <XAxis
      dataKey="SaleDate"
      tick={{ fontSize: 12, fill: "#94A3B8" }}
      tickLine={false}
      axisLine={false}
    />
    <YAxis
      tick={{ fontSize: 12, fill: "#94A3B8" }}
      tickLine={false}
      axisLine={false}
    />

    {/* Tooltip */}
    <Tooltip
      contentStyle={{
        backgroundColor: "rgba(255,255,255,0.95)",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
      labelStyle={{ color: "#475569", fontWeight: 500 }}
      formatter={(value) => [`£${value.toLocaleString()}`, "Sales Value"]}
    />

    {/* Gradient definition */}
    <defs>
      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8CEBFF" />
        <stop offset="100%" stopColor="#35D7FF" />
      </linearGradient>
    </defs>

    {/* Line */}
    <Line
      type="monotone"
      dataKey="SaleValue"
      stroke="url(#lineGradient)"
      strokeWidth={3}
      dot={{
        r: 5,
        fill: "#35D7FF",
        stroke: "#fff",
        strokeWidth: 2,
      }}
      activeDot={{
        r: 6,
        fill: "#8CEBFF",
        stroke: "#fff",
        strokeWidth: 2,
      }}
       isAnimationActive={true}
  animationDuration={800}
  animationEasing="ease-out"
    />
  </LineChart>
        </ResponsiveContainer>

        )}
      </motion.section>

      {/* Tanks Table */}
   <motion.section
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="rounded-2xl bg-white p-6 shadow-md hover:shadow-lg transition-all"
>
  {/* Header */}
  <div className="flex items-center justify-between mb-5">
    <h3 className="font-semibold text-lg text-slate-700">Tanks</h3>
    <span className="text-sm text-slate-500">
      Showing {tanks.length}
    </span>
  </div>

  {/* Content */}
  {loading ? (
    <p className="text-slate-500">Loading...</p>
  ) : (
    <div className="overflow-hidden rounded-2xl">
      <table className="min-w-full text-sm text-slate-700">
        <thead className="bg-[var(--breeze)]/60 text-slate-600 uppercase text-xs font-semibold tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Tank ID</th>
            <th className="px-4 py-3 text-left">Station</th>
            <th className="px-4 py-3 text-left">Fuel Type</th>
            <th className="px-4 py-3 text-left">Capacity</th>
            <th className="px-4 py-3 text-left">Current Stock</th>
            <th className="px-4 py-3 text-left">% Full</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {tanks.map((t) => {
            const pct = Math.round((t.CurrentStock / t.Capacity) * 100);
            return (
              <tr
                key={t.TankID}
                className="hover:bg-[var(--breeze)]/30 transition-all duration-150"
              >
                <td className="px-4 py-3 font-medium text-slate-700">{t.TankID}</td>
                <td className="px-4 py-3">{t.StationID}</td>
                <td className="px-4 py-3 text-slate-600">{t.FuelTypeID}</td>
                <td className="px-4 py-3">{t.Capacity?.toLocaleString()} L</td>
                <td className="px-4 py-3">{t.CurrentStock?.toLocaleString()} L</td>
                <td className="px-4 py-3">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        background:
                          "linear-gradient(135deg, #35D7FF 0%, #8CEBFF 100%)",
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</motion.section>

    </div>
  );
}

