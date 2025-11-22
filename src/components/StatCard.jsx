import { motion } from "framer-motion";

export default function StatCard({ icon, label, value, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        rounded-2xl
        bg-white
        p-5
        shadow-md
        hover:shadow-lg
        transition-all
        border border-slate-100
        hover:border-[var(--aqua)]
        group
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="
            h-9 w-9
            rounded-xl
            grid place-items-center
            text-white
            shadow-sm
            transition-all
            group-hover:scale-105
          "
          style={{
            background: "linear-gradient(135deg, #35D7FF, #8CEBFF)",
          }}
        >
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>

      {/* Value */}
      <div className="mt-3 text-3xl font-semibold text-slate-800 tracking-tight">
        {value}
      </div>

      {/* Subtext */}
      {sub && (
        <div className="text-xs text-slate-400 mt-1 font-medium">{sub}</div>
      )}
    </motion.div>
  );
}
