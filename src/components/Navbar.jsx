import { LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b flex items-center justify-between px-5 h-14 shadow-sm">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <h2 className="text-[var(--ocean)] font-semibold text-base">
          Dashboard
        </h2>

        {/* Small search box */}
        <div className="hidden md:flex items-center gap-2 bg-[var(--breeze)] px-2 py-1.5 rounded-lg text-sm text-[var(--text-dark)] focus-within:ring-1 focus-within:ring-[var(--ocean)] transition">
          <Search size={14} className="text-[var(--ocean)]" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-32 focus:w-48 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 px-3 py-1.5 border text-sm rounded-lg text-red-500 hover:bg-red-50 transition"
      >
        <LogOut size={14} /> Logout
      </button>
    </header>
  );
}
