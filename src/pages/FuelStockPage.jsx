import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Database, Plus, Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "../api/api";
import StockFormModal from "../components/StockFormModal";

export default function FuelStockPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchStock(); }, []);

  const API_URL = "https://fuel-stock-backend-b6fccqcyc7exfbas.uksouth-01.azurewebsites.net";

const fetchStock = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/fuelstock`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch stock");
    }

    const data = await res.json();
    setStock(data);
  } catch (err) {
    console.error("Failed to fetch fuel stock", err);
    alert("Failed to fetch fuel stock.");
  } finally {
    setLoading(false);
  }
};


  const handleSave = (saved) => {
    if (editing) {
      setStock((prev) => prev.map((s) => s.FuelStockID === saved.FuelStockID ? saved : s));
    } else {
      setStock((prev) => [saved, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await apiFetch(`/fuelstock/${id}`, { method: "DELETE" });
    setStock((prev) => prev.filter((s) => s.FuelStockID !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            <Database className="text-[var(--ocean)]" size={20}/> Fuel Stock
          </h2>
          <p className="text-sm text-slate-500">Track daily stock and variances.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-md"
          style={{ background: "linear-gradient(135deg, #35D7FF, #8CEBFF)" }}
        >
          <Plus size={16}/> New Record
        </button>
      </div>

      {/* Table */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-md hover:shadow-lg p-6">
        {loading ? (
          <p className="text-slate-500">Loading stock data…</p>
        ) : stock.length === 0 ? (
          <p className="text-slate-500">No stock records found.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-[var(--breeze)]/60 text-slate-600 uppercase text-xs font-semibold tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Stock ID</th>
                  <th className="px-4 py-3 text-left">Station</th>
                  <th className="px-4 py-3 text-left">Tank</th>
                  <th className="px-4 py-3 text-left">Opening</th>
                  <th className="px-4 py-3 text-left">Closing</th>
                  <th className="px-4 py-3 text-left">Expected</th>
                  <th className="px-4 py-3 text-left">Variance</th>
                  <th className="px-4 py-3 text-left">% Var</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stock.map((s) => (
                  <tr key={s.FuelStockID} className="hover:bg-[var(--breeze)]/30 transition">
                    <td className="px-4 py-3 font-medium">{s.FuelStockID}</td>
                    <td className="px-4 py-3">{s.StationID}</td>
                    <td className="px-4 py-3">{s.TankID}</td>
                    <td className="px-4 py-3">{s.OpeningStock}</td>
                    <td className="px-4 py-3">{s.ClosingStock}</td>
                    <td className="px-4 py-3">{s.ExpectedStock}</td>
                    <td className="px-4 py-3 text-red-500 font-semibold">{s.Variance}</td>
                    <td className="px-4 py-3">{s.VariancePercent}%</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.RecordDate}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => { setEditing(s); setModalOpen(true); }} className="text-[var(--ocean)] hover:text-[var(--aqua)]">
                        <Pencil size={16}/>
                      </button>
                      <button onClick={() => handleDelete(s.FuelStockID)} className="text-red-500 hover:text-red-400">
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>

      {/* Modal */}
      <StockFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSaved={handleSave}
      />
    </motion.div>
  );
}

