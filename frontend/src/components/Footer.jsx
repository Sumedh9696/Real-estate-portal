import React from "react";
import { Link } from "react-router-dom";
import { IconHome, IconMail, IconPhone } from "./Icons";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="container-x py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
              <IconHome className="w-5 h-5" />
            </span>
            <span className="text-lg font-extrabold text-gray-800">
              Estate<span className="text-brand-500">Nest</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed">
            Making property search simple, transparent, and enjoyable — find
            your next home or investment with confidence.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-800">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/" className="hover:text-brand-500">Home</Link></li>
            <li><Link to="/?listingType=sale" className="hover:text-brand-500">Buy Property</Link></li>
            <li><Link to="/?listingType=rent" className="hover:text-brand-500">Rent Property</Link></li>
            <li><Link to="/favorites" className="hover:text-brand-500">Favorites</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-800">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/admin/login" className="hover:text-brand-500">Admin Login</Link></li>
            <li><span className="cursor-default">About Us</span></li>
            <li><span className="cursor-default">Terms of Service</span></li>
            <li><span className="cursor-default">Privacy Policy</span></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-800">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="flex items-center gap-2"><IconPhone className="w-4 h-4 text-brand-500" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><IconMail className="w-4 h-4 text-brand-500" /> support@estatenest.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} EstateNest. All rights reserved.
      </div>
    </footer>
  );
}
