import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
  const API_URL = "https://fuel-stock-backend-b6fccqcsyc7exfbas.uksouth-01.azurewebsites.net";

const res = await fetch(`${API_URL}/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.msg || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error, please try again later.",err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ice)] flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--ocean)]">
          Login
        </h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 rounded-md text-white font-semibold hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #35D7FF, #8CEBFF)",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

