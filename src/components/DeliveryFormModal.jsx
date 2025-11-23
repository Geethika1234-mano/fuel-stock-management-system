import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../api/api";

export default function DeliveryFormModal({ open, onClose, initial, onSaved }) {
  const [form, setForm] = useState({
    StationID: "",
    TankID: "",
    SupplierID: "",
    ReceivedQty: "",
    DeliveryDate: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        StationID: initial.StationID || "",
        TankID: initial.TankID || "",
        SupplierID: initial.SupplierID || "",
        ReceivedQty: initial.ReceivedQty || "",
        DeliveryDate: initial.DeliveryDate || "",
      });
    } else {
      setForm({
        StationID: "",
        TankID: "",
        SupplierID: "",
        ReceivedQty: "",
        DeliveryDate: "",
      });
    }
  }, [initial, open]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (ev) => {
  ev.preventDefault();
  if (!validate()) return;

  setSubmitting(true);

  try {
    const payload = {
      StationID: Number(form.StationID),
      FuelTypeID: Number(form.FuelTypeID),
      SaleDate: form.SaleDate,
      VolumeDispensed: Number(form.VolumeDispensed),
      UnitPrice: Number(form.UnitPrice),
      SaleValue: Number(saleValue),
    };

    const API_URL =
      "https://fuel-stock-backend-b6fccqcyc7exfbas.uksouth-01.azurewebsites.net";
    const endpoint = isEdit
      ? `${API_URL}/fuelsales/${initial.FuelSalesID}`
      : `${API_URL}/fuelsales`;

    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errMsg = "Failed to save";
      try {
        const errJson = await response.json();
        errMsg = errJson.msg || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    const saved = await response.json();

    onSaved?.(saved);
    onClose?.();

  } catch (err) {
    console.error("Save error:", err);
    onSaved?.(null, err);
    alert(err.message || "Failed to save sale. Please try again.");
  } finally {
    setSubmitting(false);
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-[480px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-slate-800">
                {initial ? "Edit Delivery" : "Add Delivery"}
              </h3>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Station ID
                  </label>
                  <input
                    name="StationID"
                    value={form.StationID}
                    onChange={handleChange}
                    placeholder="e.g. 1"
                    className="w-full border rounded-md p-2 focus:ring-1 focus:ring-[var(--ocean)] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Tank ID
                  </label>
                  <input
                    name="TankID"
                    value={form.TankID}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    className="w-full border rounded-md p-2 focus:ring-1 focus:ring-[var(--ocean)] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Supplier ID
                  </label>
                  <input
                    name="SupplierID"
                    value={form.SupplierID}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    className="w-full border rounded-md p-2 focus:ring-1 focus:ring-[var(--ocean)] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 mb-1 block">
                    Received Quantity (L)
                  </label>
                  <input
                    name="ReceivedQty"
                    type="number"
                    value={form.ReceivedQty}
                    onChange={handleChange}
                    placeholder="e.g. 4000"
                    className="w-full border rounded-md p-2 focus:ring-1 focus:ring-[var(--ocean)] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  Delivery Date
                </label>
                <input
                  name="DeliveryDate"
                  type="date"
                  value={form.DeliveryDate}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2 focus:ring-1 focus:ring-[var(--ocean)] outline-none"
                  required
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-md shadow-md hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #35D7FF, #8CEBFF)",
                  }}
                >
                  {initial ? "Save Changes" : "Create Delivery"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

