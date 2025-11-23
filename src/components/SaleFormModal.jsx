import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../api/api";

export default function SaleFormModal({ open, onClose, onSaved, initial }) {
  const isEdit = Boolean(initial?.FuelSalesID);
  const [form, setForm] = useState({
    StationID: "",
    FuelTypeID: "",
    SaleDate: "",
    VolumeDispensed: "",
    UnitPrice: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        StationID: initial.StationID ?? "",
        FuelTypeID: initial.FuelTypeID ?? "",
        SaleDate: (initial.SaleDate || "").slice(0, 10),
        VolumeDispensed: initial.VolumeDispensed ?? "",
        UnitPrice: initial.UnitPrice ?? "",
      });
    } else {
      setForm({
        StationID: "",
        FuelTypeID: "",
        SaleDate: "",
        VolumeDispensed: "",
        UnitPrice: "",
      });
    }
    setErrors({});
  }, [initial, open]);

  const saleValue = useMemo(() => {
    const v = parseFloat(form.VolumeDispensed || 0);
    const p = parseFloat(form.UnitPrice || 0);
    return isFinite(v * p) ? (v * p).toFixed(2) : "0.00";
  }, [form.VolumeDispensed, form.UnitPrice]);

  const validate = () => {
    const e = {};
    if (!form.StationID) e.StationID = "Station is required";
    if (!form.FuelTypeID) e.FuelTypeID = "Fuel type is required";
    if (!form.SaleDate) e.SaleDate = "Sale date is required";
    if (!form.VolumeDispensed || parseFloat(form.VolumeDispensed) <= 0)
      e.VolumeDispensed = "Volume must be > 0";
    if (!form.UnitPrice || parseFloat(form.UnitPrice) <= 0)
      e.UnitPrice = "Unit price must be > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

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

    const API_URL = "https://fuel-stock-backend-b6fccqcyc7exfbas.uksouth-01.azurewebsites.net";

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
      const err = await response.json().catch(() => ({}));
      throw new Error(err.msg || "Failed to save");
    }

    const saved = await response.json();

    onSaved?.(saved);
    onClose?.();

  } catch (err) {
    console.error("Save error", err);
    onSaved?.(null, err);
    alert("Failed to save sale. Please try again.");
  } finally {
    setSubmitting(false);
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] grid place-items-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit Sale" : "Add Sale"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500">Station ID</label>
            <input
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none ${
                errors.StationID ? "border-red-300" : "border-slate-200"
              }`}
              value={form.StationID}
              onChange={(e) => setForm({ ...form, StationID: e.target.value })}
              placeholder="e.g. 1"
            />
            {errors.StationID && <p className="text-xs text-red-500 mt-1">{errors.StationID}</p>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Fuel Type ID</label>
            <input
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none ${
                errors.FuelTypeID ? "border-red-300" : "border-slate-200"
              }`}
              value={form.FuelTypeID}
              onChange={(e) => setForm({ ...form, FuelTypeID: e.target.value })}
              placeholder="e.g. 2"
            />
            {errors.FuelTypeID && <p className="text-xs text-red-500 mt-1">{errors.FuelTypeID}</p>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Sale Date</label>
            <input
              type="date"
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none ${
                errors.SaleDate ? "border-red-300" : "border-slate-200"
              }`}
              value={form.SaleDate}
              onChange={(e) => setForm({ ...form, SaleDate: e.target.value })}
            />
            {errors.SaleDate && <p className="text-xs text-red-500 mt-1">{errors.SaleDate}</p>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Volume (L)</label>
            <input
              type="number"
              step="0.01"
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none ${
                errors.VolumeDispensed ? "border-red-300" : "border-slate-200"
              }`}
              value={form.VolumeDispensed}
              onChange={(e) => setForm({ ...form, VolumeDispensed: e.target.value })}
              placeholder="e.g. 1000"
            />
            {errors.VolumeDispensed && <p className="text-xs text-red-500 mt-1">{errors.VolumeDispensed}</p>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Unit Price (£)</label>
            <input
              type="number"
              step="0.01"
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none ${
                errors.UnitPrice ? "border-red-300" : "border-slate-200"
              }`}
              value={form.UnitPrice}
              onChange={(e) => setForm({ ...form, UnitPrice: e.target.value })}
              placeholder="e.g. 1.69"
            />
            {errors.UnitPrice && <p className="text-xs text-red-500 mt-1">{errors.UnitPrice}</p>}
          </div>

          <div>
            <label className="text-xs text-slate-500">Sale Value (£)</label>
            <input
              disabled
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-slate-50 border-slate-200"
              value={saleValue}
              readOnly
            />
          </div>

          <div className="col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="px-4 py-2 rounded-xl text-white shadow-md hover:opacity-95 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #35D7FF, #8CEBFF)" }}
            >
              {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

