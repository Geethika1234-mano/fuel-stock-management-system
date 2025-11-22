import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setSuccess("Registration successful!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setError(data.msg || "Registration failed.");
      }
    } catch (err) {
      setError("Server error, please try again later.", err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ice)] flex items-center justify-center">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-[var(--breeze)]"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--ocean)]">
          Create Account
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-[var(--aqua)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-[var(--aqua)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-[var(--aqua)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

        <button
          type="submit"
          className="w-full mt-5 py-2 rounded-md text-white font-semibold hover:opacity-90 transition"
          style={{
            background: "linear-gradient(135deg, #35D7FF, #8CEBFF)",
          }}
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-[var(--ocean)] font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
