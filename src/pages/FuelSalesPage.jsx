import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Fuel } from "lucide-react";
import { apiGet } from "../api/http";
import SaleFormModal from "../components/SaleFormModal";
import { apiDelete } from "../api/http";

export default function FuelSalesPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const data = await apiGet("/fuelsales");
      setSales(data);
    } catch (err) {
      console.error("Failed to load sales", err);
      alert("Failed to load sales.");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSaved = (saved, err) => {
    if (err) {
      console.error("Save failed", err);
      alert("Save failed.");
      return;
    }
    if (editing) {
      setSales((prev) =>
        prev.map((s) => (s.FuelSalesID === saved.FuelSalesID ? saved : s))
      );
      // alert("Sale updated."); // optional
    } else {
      setSales((prev) => [saved, ...prev]);
      // alert("Sale created."); // optional
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await apiDelete(`/fuelsales/${id}`);
      setSales((a) => a.filter((s) => s.FuelSalesID !== id));
      // alert("Sale deleted."); // optional
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6">
      {/* Header */}
  <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
      <Fuel className="text-[var(--ocean)]" size={20} />
      Fuel Sales
    </h2>
    <p className="text-sm text-slate-500">Manage fuel sales records.</p>
  </div>

  <div className="flex gap-3">
    {/* Upload Button */}
    <button
      onClick={() => document.getElementById("fileInput").click()}
      className="flex items-center gap-2 text-[var(--ocean)] border border-[var(--ocean)] px-4 py-2 rounded-xl hover:bg-[var(--breeze)]/60 transition shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16v-8m0 0l-3 3m3-3l3 3m-6 5h6m-9 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z"
        />
      </svg>
      Upload Report
    </button>

    {/* Hidden File Input */}
    <input
      id="fileInput"
      type="file"
      accept=".csv, .xlsx"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          alert(`Selected: ${file.name}`);
          // TODO: handle upload & parsing
        }
      }}
    />

    {/* New Sale Button */}
    <button
      onClick={openAdd}
      className="flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-md transition"
      style={{ background: "linear-gradient(135deg, #35D7FF, #8CEBFF)" }}
    >
      <Plus size={16} /> New Sale
    </button>
  </div>
</div>


      {/* Table */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-md hover:shadow-lg transition-all p-6"
      >
        {loading ? (
          <p className="text-slate-500">Loading sales…</p>
        ) : sales.length === 0 ? (
          <p className="text-slate-500">No fuel sales found.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-[var(--breeze)]/60 text-slate-600 uppercase text-xs font-semibold tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Sale ID</th>
                  <th className="px-4 py-3 text-left">Station</th>
                  <th className="px-4 py-3 text-left">Fuel Type</th>
                  <th className="px-4 py-3 text-left">Volume (L)</th>
                  <th className="px-4 py-3 text-left">Unit Price (£)</th>
                  <th className="px-4 py-3 text-left">Sale Value (£)</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((s) => (
                  <tr key={s.FuelSalesID} className="hover:bg-[var(--breeze)]/30 transition-all duration-150">
                    <td className="px-4 py-3 font-medium">{s.FuelSalesID}</td>
                    <td className="px-4 py-3">{s.StationID}</td>
                    <td className="px-4 py-3">{s.FuelTypeID}</td>
                    <td className="px-4 py-3">{s.VolumeDispensed}</td>
                    <td className="px-4 py-3">{s.UnitPrice}</td>
                    <td className="px-4 py-3 font-semibold">{s.SaleValue}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.SaleDate}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        className="text-[var(--ocean)] hover:text-[var(--aqua)]"
                        onClick={() => openEdit(s)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-400"
                        onClick={() => handleDelete(s.FuelSalesID)}
                      >
                        <Trash2 size={16} />
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
      <SaleFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        initial={editing}
      />
    </motion.div>
  );
}
