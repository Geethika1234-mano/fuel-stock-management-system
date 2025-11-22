import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Fuel,
  Truck,
  Database,
  LogOut,
  User,
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <BarChart3 size={18} /> },
    { name: "Fuel Sales", path: "/sales", icon: <Fuel size={18} /> },
    { name: "Deliveries", path: "/deliveries", icon: <Truck size={18} /> },
    { name: "Fuel Stock", path: "/stock", icon: <Database size={18} /> },
  ];

  return (
    <aside
      className={`flex flex-col justify-between h-screen transition-all duration-300
        ${collapsed ? "w-16" : "w-64"}
        bg-white/80 backdrop-blur border-r border-slate-200 shadow-md
      `}
    >
      {/* ─── Top Section ─────────────────────────────────────────────── */}
      <div>
        {/* Logo / Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          {!collapsed && (
            <h1 className="text-lg font-bold text-[var(--ocean)] tracking-tight whitespace-nowrap">
              Fuel Manager
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-100 rounded-xl transition"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150
                ${
                  isActive
                    ? "bg-[var(--breeze)] text-[var(--ocean)] shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[var(--ocean)]"
                }
              `
              }
            >
              <div
                className={`flex items-center justify-center ${
                  collapsed ? "mx-auto" : ""
                }`}
              >
                {item.icon}
              </div>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ─── Bottom Section (User Info) ─────────────────────────────── */}
     {/* Bottom User Info */}
{/* Bottom User Info */}
<div className="border-t p-3 flex items-center justify-between transition-all duration-300">
  <div
    className={`flex items-center gap-2 ${
      collapsed ? "justify-center w-full" : ""
    }`}
  >
    {/* Profile Icon (always visible) */}
    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-[var(--breeze)] shrink-0">
      <User size={18} className="text-[var(--ocean)]" />
    </div>

    {/* User Info (hidden when collapsed) */}
    {!collapsed && (
      <div className="overflow-hidden">
        <p className="text-sm font-medium leading-tight">Admin</p>
        <p className="text-xs text-slate-400">admin@gmail.com</p>
      </div>
    )}
  </div>

  {/* Logout Button (only visible when expanded) */}
  {!collapsed && (
    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      }}
      className="text-red-500 hover:bg-red-50 p-1.5 rounded-xl ml-2"
      title="Logout"
    >
      <LogOut size={16} />
    </button>
  )}
</div>


    </aside>
  );
}
