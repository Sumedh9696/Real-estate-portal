import React, { useEffect, useState } from "react";
import api from "../api/api";
import { IconSearch, IconFilter, IconClose } from "./Icons";

const initialFilters = {
  search: "",
  listingType: "",
  propertyType: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  sort: "newest",
};

export default function Filters({ filters, setFilters }) {
  const [meta, setMeta] = useState({ cities: [], propertyTypes: [] });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api
      .get("/properties/meta/filters")
      .then(({ data }) => {
        if (isMounted) setMeta(data);
      })
      .catch((err) => console.error("Failed to load filter metadata:", err.message));
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const activeCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== "sort"
  ).length;

  const FilterBody = (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Search
        </label>
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Title, area, or city..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Listing Type
        </label>
        <div className="flex gap-2">
          {["", "sale", "rent"].map((type) => (
            <button
              key={type || "all"}
              type="button"
              onClick={() => handleChange("listingType", type)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                filters.listingType === type
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-200 text-gray-600 hover:border-brand-300"
              }`}
            >
              {type === "" ? "All" : type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Property Type
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) => handleChange("propertyType", e.target.value)}
          className="input-field"
        >
          <option value="">All Types</option>
          {meta.propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          City
        </label>
        <select
          value={filters.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="input-field"
        >
          <option value="">All Cities</option>
          {meta.cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Price Range (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="input-field"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Bedrooms
        </label>
        <div className="flex gap-2">
          {["", "1", "2", "3", "4"].map((n) => (
            <button
              key={n || "any"}
              type="button"
              onClick={() => handleChange("bedrooms", n)}
              className={`flex-1 rounded-lg border px-2 py-2 text-sm font-medium transition ${
                filters.bedrooms === n
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-200 text-gray-600 hover:border-brand-300"
              }`}
            >
              {n === "" ? "Any" : `${n}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleChange("sort", e.target.value)}
          className="input-field"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <button type="button" onClick={resetFilters} className="btn-secondary w-full">
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn-secondary"
        >
          <IconFilter />
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-full md:w-72 shrink-0">
        <div className="card sticky top-20 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-800">
              <IconFilter className="text-brand-500" /> Filters
            </h3>
            {activeCount > 0 && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-600">
                {activeCount} active
              </span>
            )}
          </div>
          {FilterBody}
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800">Filters</h3>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
                <IconClose />
              </button>
            </div>
            {FilterBody}
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export { initialFilters };
