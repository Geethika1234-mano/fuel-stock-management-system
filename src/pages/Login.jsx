import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL =
    "https://fuel-stock-backend-b6fccqcyc7exfbas.uksouth-01.azurewebsites.net";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid credentials");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FF] to-[#C2EBFF] flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-white/70 shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/40">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-[var(--ocean)] mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Login to manage fuel operations
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-xl border border-slate-200 shadow-sm bg-white focus:ring-2 focus:ring-[var(--ocean)] outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 rounded-xl border border-slate-200 shadow-sm bg-white focus:ring-2 focus:ring-[var(--ocean)] outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #35D7FF, #8CEBFF)",
            }}
          >
            {loading ? (
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
