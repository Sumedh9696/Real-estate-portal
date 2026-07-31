import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-x flex flex-col items-center justify-center py-28 text-center">
      <h1 className="text-6xl font-extrabold text-brand-500">404</h1>
      <p className="mt-3 text-lg font-semibold text-gray-700">Page not found</p>
      <p className="mt-1 text-sm text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
