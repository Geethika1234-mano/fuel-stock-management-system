import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiFetch } from "../api/api";

export default function StockFormModal({ open, onClose, initial, onSaved }) {
  const [form, setForm] = useState({
    StationID: "",
    TankID: "",
    RecordDate: "",
    OpeningStock: "",
    ClosingStock: "",
    ExpectedStock: "",
    Variance: "",
    VariancePercent: "",
  });

  useEffect(() => {
    if (initial) setForm(initial);
    else
      setForm({
        StationID: "",
        TankID: "",
        RecordDate: "",
        OpeningStock: "",
        ClosingStock: "",
        ExpectedStock: "",
        Variance: "",
        VariancePercent: "",
      });
  }, [initial, open]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = initial ? "PUT" : "POST";
    const url = initial ? `/fuelstock/${initial.FuelStockID}` : "/fuelstock";
    try {
      const res = await apiFetch(url, { method, body: JSON.stringify(form) });
      onSaved(res);
      onClose();
    } catch (err) {
      console.error("Failed to save stock:", err);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-[520px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {initial ? "Edit Stock Record" : "Add Stock Record"}
              </h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200" />

            {/* Form body */}
            <form
              onSubmit={handleSubmit}
              className="px-6 py-6 grid grid-cols-2 gap-x-4 gap-y-5"
            >
              <div>
                <label className="block text-xs text-slate-500 mb-1">Station ID</label>
                <input
                  name="StationID"
                  value={form.StationID}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  className="w-full border rounded-md p-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Tank ID</label>
                <input
                  name="TankID"
                  value={form.TankID}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  className="w-full border rounded-md p-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Record Date</label>
                <input
                  type="date"
                  name="RecordDate"
                  value={form.RecordDate}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 text-sm text-slate-600 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Opening Stock (L)</label>
                <input
                  name="OpeningStock"
                  value={form.OpeningStock}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  className="w-full border rounded-md p-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Closing Stock (L)</label>
                <input
                  name="ClosingStock"
                  value={form.ClosingStock}
                  onChange={handleChange}
                  placeholder="e.g. 4800"
                  className="w-full border rounded-md p-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Expected Stock (L)</label>
                <input
                  name="ExpectedStock"
                  value={form.ExpectedStock}
                  onChange={handleChange}
                  placeholder="e.g. 4900"
                  className="w-full border rounded-md p-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Variance (L)</label>
                <input
                  name="Variance"
                  value={form.Variance}
                  onChange={handleChange}
                  placeholder="e.g. -100"
                  className="w-full border rounded-md p-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Variance %</label>
                <input
                  name="VariancePercent"
                  value={form.VariancePercent}
                  onChange={handleChange}
                  placeholder="e.g. -2.1"
                  className="w-full border rounded-md p-2 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--aqua)] focus:outline-none"
                />
              </div>
            </form>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="stock-form"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm text-white font-medium rounded-md shadow-md transition"
                style={{
                  background: "linear-gradient(135deg, #35D7FF, #8CEBFF)",
                }}
              >
                {initial ? "Update Record" : "Create Record"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
