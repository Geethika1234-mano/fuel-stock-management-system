import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const API_URL =
    "https://fuel-stock-backend-b6fccqcyc7exfbas.uksouth-01.azurewebsites.net";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid credentials");
        setShake(true);

        setTimeout(() => setShake(false), 500);
      } else {
        localStorage.setItem("token", data.token);

        if (remember) {
          localStorage.setItem("savedUser", username);
        } else {
          localStorage.removeItem("savedUser");
        }

        navigate("/dashboard");
      }
    } catch {
      setError("Server error. Try again.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F7FF] to-[#C2EBFF] flex items-center justify-center px-4">

      {/* LOGIN CARD */}
      <div
        className={`backdrop-blur-xl bg-white/70 shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/40 transition-all ${
          shake ? "animate-[shake_0.4s_ease]" : ""
        }`}
      >
        {/* Animated Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#35D7FF] to-[#8CEBFF] flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-white text-3xl font-bold">⛽</span>
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-center text-[var(--ocean)] mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Login to manage fuel operations
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* USERNAME */}
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <input
              type="text"
              className="mt-1 w-full p-3 rounded-xl border border-slate-200 shadow-sm bg-white focus:ring-2 focus:ring-[var(--ocean)] outline-none transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD WITH EYE ICON */}
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <div className="mt-1 relative">
              <input
                type={showPass ? "text" : "password"}
                className="w-full p-3 pr-12 rounded-xl border border-slate-200 shadow-sm bg-white focus:ring-2 focus:ring-[var(--ocean)] outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Eye Icon */}
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-3 text-slate-500 cursor-pointer hover:text-slate-700"
              >
                {showPass ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="text-sm text-slate-600">Remember me</label>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* LOGIN BUTTON */}
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

      {/* SHAKE ANIMATION KEYFRAMES */}
      <style>
        {`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}
      </style>
    </div>
  );
}
