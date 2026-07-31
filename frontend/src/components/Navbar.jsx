import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { IconHeart, IconHome, IconClose } from "./Icons";

export default function Navbar() {
  const { favoriteIds } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-brand-500" : "text-gray-600 hover:text-brand-500"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
            <IconHome className="w-5 h-5" />
          </span>
          <span className="text-lg font-extrabold text-gray-800 tracking-tight">
            Estate<span className="text-brand-500">Nest</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/?listingType=sale" className={navLinkClass}>
            Buy
          </NavLink>
          <NavLink to="/?listingType=rent" className={navLinkClass}>
            Rent
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favorites
          </NavLink>
          <NavLink to="/admin/login" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/favorites"
            className="relative flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors"
          >
            <IconHeart className="w-4 h-4" />
            <span className="hidden sm:inline">Favorites</span>
            {favoriteIds.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-white">
                {favoriteIds.length}
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconClose /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container-x py-3 flex flex-col gap-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)} end>
              Home
            </NavLink>
            <NavLink to="/?listingType=sale" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Buy
            </NavLink>
            <NavLink to="/?listingType=rent" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Rent
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Favorites
            </NavLink>
            <NavLink to="/admin/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Admin
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
