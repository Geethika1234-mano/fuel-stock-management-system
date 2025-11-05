import { useState } from "react";
import { Fuel } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // Temporary development credentials
    if (form.username === "admin@gmail.com" && form.password === "1234") {
      localStorage.setItem("token", "dev-temp-token");
      window.location.href = "/dashboard";
      return;
    }

    // Otherwise, call your backend
    const res = await axios.post("/auth/login", form);
    localStorage.setItem("token", res.data.access_token);
    window.location.href = "/dashboard";
  } catch (err) {
    setError("Invalid credentials. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--ocean)] to-[var(--aqua)] text-slate-700">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md"
      >
        {/* Logo / Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-[var(--ocean)] grid place-items-center">
            <Fuel className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-semibold text-[var(--ocean)]">
            Fuel Stock Manager
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--aqua)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--aqua)]"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--ocean)] text-white py-2 rounded-xl mt-2 hover:brightness-105 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-slate-500 mt-4">
          © {new Date().getFullYear()} Fuel Stock Management System
        </p>
      </motion.div>
    </div>
  );
}

