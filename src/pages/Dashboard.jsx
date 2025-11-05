import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Fuel, Truck, Database, BarChart3, Plus, Search, LogOut } from "lucide-react";

const DEMO_TANKS = [
  { id: 1, name: "Tank 4", fuel: "BP Ultimate E5", capacity: 20000, stock: 7000 },
  { id: 2, name: "Tank 6", fuel: "BP ULSP",        capacity: 20000, stock: 4000 },
];

const DEMO_ACTIVITY = [
  { id: "a1", type: "delivery", label: "Delivery • BP ULSP", qty: 7000, tank: "Tank 6", ts: "2025-08-28 07:50" },
  { id: "a2", type: "sale",     label: "Sale • BP Ultimate E5", qty: 320, tank: "Tank 4", ts: "2025-08-28 08:30" },
  { id: "a3", type: "sale",     label: "Sale • BP ULSP",        qty: 160, tank: "Tank 6", ts: "2025-08-28 09:10" },
];

function Stat({ icon, label, value, sub }) {
  return (
    <div className="rounded-2xl p-4 bg-white shadow-sm border">
      <div className="flex items-center gap-2 text-[var(--ocean)]">{icon}<span className="text-sm font-medium text-slate-600">{label}</span></div>
      <div className="mt-2 text-2xl font-bold text-slate-800">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [query, setQuery] = useState("");

  const totals = useMemo(() => {
    const litresSold = 320 + 160; // demo
    const deliveries = 7000;      // demo
    const stock = DEMO_TANKS.reduce((a, t) => a + t.stock, 0);
    return { litresSold, deliveries, stock, variance: -0.7 };
  }, []);

  const filteredTanks = useMemo(
    () => DEMO_TANKS.filter(t =>
      `${t.name} ${t.fuel}`.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  return (
    <div className="min-h-screen bg-[var(--ice)] text-slate-800">
      {/* Topbar */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl grid place-items-center"
                 style={{ background: "linear-gradient(135deg, var(--ocean), var(--aqua))" }}>
              <Fuel className="text-white" size={18}/>
            </div>
            <div>
              <h1 className="font-semibold">Fuel Stock Manager</h1>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white border px-3 py-2 rounded-xl">
              <Search size={16} className="text-[var(--ocean)]"/>
              <input
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                placeholder="Search tanks..."
                className="bg-transparent outline-none text-sm w-64"
              />
            </div>
            <button className="px-4 py-2 rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, var(--ocean), var(--aqua))" }}>
              <Plus size={16} className="inline -mt-0.5 mr-1"/> New Record
            </button>
            <button className="px-3 py-2 rounded-xl border bg-white text-red-500">
              <LogOut size={16}/>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-6 py-6">

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="rounded-2xl bg-white shadow-sm border p-2 sticky top-20">
            <a className="flex items-center gap-2 p-3 rounded-xl hover:bg-[var(--breeze)]/40 transition cursor-pointer">
              <BarChart3 size={18}/> Overview
            </a>
            <a className="flex items-center gap-2 p-3 rounded-xl hover:bg-[var(--breeze)]/40 transition cursor-pointer">
              <Fuel size={18}/> Sales
            </a>
            <a className="flex items-center gap-2 p-3 rounded-xl hover:bg-[var(--breeze)]/40 transition cursor-pointer">
              <Truck size={18}/> Deliveries
            </a>
            <a className="flex items-center gap-2 p-3 rounded-xl hover:bg-[var(--breeze)]/40 transition cursor-pointer">
              <Database size={18}/> Stock
            </a>
          </nav>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          {/* Hero */}
          <motion.section
            initial={{opacity:0, y:8}}
            animate={{opacity:1, y:0}}
            className="rounded-2xl border bg-gradient-to-r from-white to-[var(--breeze)]/30 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Today at Cherwell S/STN</h2>
                <p className="text-sm text-slate-600">Snapshot of sales, deliveries & stock.</p>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--aqua)]/10 text-[var(--ocean)]">
                Light Blue Theme
              </div>
            </div>
          </motion.section>

          {/* Stats */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat icon={<Fuel size={16}/>} label="Litres Sold" value={`${totals.litresSold.toLocaleString()} L`} sub="vs yesterday +6%" />
            <Stat icon={<Truck size={16}/>} label="Deliveries" value={`${totals.deliveries.toLocaleString()} L`} sub="BP ULSP • Tank 6" />
            <Stat icon={<Database size={16}/>} label="Stock On Hand" value={`${totals.stock.toLocaleString()} L`} sub="2 tanks" />
            <Stat icon={<BarChart3 size={16}/>} label="Variance" value={`${totals.variance}%`} sub="within tolerance" />
          </section>

          {/* Tanks table */}
          <section className="rounded-2xl bg-white shadow-sm border">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Tanks</h3>
              <button className="px-3 py-2 rounded-xl border bg-white text-[var(--ocean)]">Export</button>
            </div>

            <div className="overflow-auto rounded-b-2xl">
              <table className="min-w-full">
                <thead className="bg-[var(--breeze)]/60 text-left text-sm">
                  <tr>
                    <th className="px-4 py-3">Tank</th>
                    <th className="px-4 py-3">Fuel</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Fill %</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredTanks.map((t) => {
                    const pct = Math.round((t.stock / t.capacity) * 100);
                    return (
                      <tr key={t.id} className="border-t">
                        <td className="px-4 py-3 font-medium">{t.name}</td>
                        <td className="px-4 py-3">{t.fuel}</td>
                        <td className="px-4 py-3">{t.capacity.toLocaleString()} L</td>
                        <td className="px-4 py-3">{t.stock.toLocaleString()} L</td>
                        <td className="px-4 py-3">
                          <div className="h-2 bg-[var(--ice)] rounded-full overflow-hidden">
                            <div className="h-2"
                                 style={{
                                   width: `${pct}%`,
                                   background: "linear-gradient(135deg, var(--ocean), var(--aqua))"
                                 }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent activity */}
          <section className="rounded-2xl bg-white shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Recent Activity</h3>
            </div>
            <ul className="divide-y">
              {DEMO_ACTIVITY.map((a) => (
                <li key={a.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg grid place-items-center text-white"
                         style={{ background: a.type === "delivery" ? "var(--ocean)" : "var(--aqua)" }}>
                      {a.type === "delivery" ? <Truck size={16}/> : <Fuel size={16}/>}
                    </div>
                    <div>
                      <div className="font-medium">{a.label}</div>
                      <div className="text-xs text-slate-500">{a.tank} • {a.ts}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{a.qty.toLocaleString()} L</div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
