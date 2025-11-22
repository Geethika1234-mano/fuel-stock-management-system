import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "../api/api";
import DeliveryFormModal from "../components/DeliveryFormModal";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const data = await apiFetch("/fueldeliveries");
      setDeliveries(data);
    } catch (err) {
      console.error("Failed to fetch deliveries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (saved) => {
    if (editing) {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.FuelDeliveryID === saved.FuelDeliveryID ? saved : d
        )
      );
    } else {
      setDeliveries((prev) => [saved, ...prev]);
    }
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await apiFetch(`/fueldeliveries/${id}`, { method: "DELETE" });
      setDeliveries((prev) =>
        prev.filter((d) => d.FuelDeliveryID !== id)
      );
    } catch (err) {
      console.error("Failed to delete delivery", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            <Truck className="text-[var(--ocean)]" size={20} /> Deliveries
          </h2>
          <p className="text-sm text-slate-500">
            Manage incoming fuel delivery records.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-xl shadow-md"
          style={{
            background: "linear-gradient(135deg, #35D7FF, #8CEBFF)",
          }}
        >
          <Plus size={16} /> New Delivery
        </button>
      </div>

      {/* Table */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white shadow-md hover:shadow-lg p-6"
      >
        {loading ? (
          <p className="text-slate-500">Loading deliveries…</p>
        ) : deliveries.length === 0 ? (
          <p className="text-slate-500">No delivery records found.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-[var(--breeze)]/60 text-slate-600 uppercase text-xs font-semibold tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Delivery ID</th>
                  <th className="px-4 py-3 text-left">Station</th>
                  <th className="px-4 py-3 text-left">Tank</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Received Qty (L)</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {deliveries.map((d) => (
                  <tr
                    key={d.FuelDeliveryID}
                    className="hover:bg-[var(--breeze)]/30 transition"
                  >
                    <td className="px-4 py-3 font-medium">
                      {d.FuelDeliveryID}
                    </td>
                    <td className="px-4 py-3">{d.StationID}</td>
                    <td className="px-4 py-3">{d.TankID}</td>
                    <td className="px-4 py-3">{d.SupplierID}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {d.DeliveryDate}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {d.ReceivedQty?.toLocaleString()} L
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => {
                          setEditing(d);
                          setModalOpen(true);
                        }}
                        className="text-[var(--ocean)] hover:text-[var(--aqua)]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(d.FuelDeliveryID)}
                        className="text-red-500 hover:text-red-400"
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
      <DeliveryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSaved={handleSave}
      />
    </motion.div>
  );
}
