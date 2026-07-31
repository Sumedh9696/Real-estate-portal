import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  IconDashboard,
  IconHome,
  IconMessage,
  IconLogout,
} from "../../components/Icons";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-500 text-white shadow-sm"
        : "text-gray-600 hover:bg-brand-50 hover:text-brand-600"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-100 bg-white p-5">
        <div className="mb-8 flex items-center gap-2 px-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
            <IconHome className="w-5 h-5" />
          </span>
          <span className="text-lg font-extrabold text-gray-800">
            Estate<span className="text-brand-500">Nest</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <NavLink to="/admin/dashboard" className={linkClass} end>
            <IconDashboard /> Dashboard
          </NavLink>
          <NavLink to="/admin/properties" className={linkClass}>
            <IconHome /> Properties
          </NavLink>
          <NavLink to="/admin/messages" className={linkClass}>
            <IconMessage /> Messages
          </NavLink>
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-4">
          <p className="px-2 text-xs text-gray-400">Signed in as</p>
          <p className="px-2 text-sm font-semibold text-gray-700">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <IconLogout /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-gray-100 bg-white py-2 md:hidden">
        <NavLink to="/admin/dashboard" className={linkClass} end><IconDashboard /></NavLink>
        <NavLink to="/admin/properties" className={linkClass}><IconHome /></NavLink>
        <NavLink to="/admin/messages" className={linkClass}><IconMessage /></NavLink>
        <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500">
          <IconLogout />
        </button>
      </div>

      <main className="flex-1 p-5 md:p-8 pb-20 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
