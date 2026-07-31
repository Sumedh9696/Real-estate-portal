import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Filters, { initialFilters } from "../components/Filters";
import PropertyListings from "../components/PropertyListings";
import { IconSearch } from "../components/Icons";

export default function Home() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...initialFilters,
    listingType: searchParams.get("listingType") || "",
  });

  useEffect(() => {
    const listingType = searchParams.get("listingType");
    if (listingType) {
      setFilters((prev) => ({ ...prev, listingType }));
    }
  }, [searchParams]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="container-x py-20 md:py-28 relative z-10">
          <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide">
            #1 Trusted Real Estate Platform
          </span>
          <h1 className="mt-5 max-w-2xl text-3xl md:text-5xl font-extrabold leading-tight">
            Find a place you'll love to call home
          </h1>
          <p className="mt-4 max-w-xl text-brand-50/90 text-base md:text-lg">
            Explore thousands of verified properties for sale and rent —
            filter by budget, location, and amenities to find your perfect match.
          </p>

          <div className="mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-2 shadow-xl">
            <IconSearch className="ml-2 w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by city, locality, or property title..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full bg-transparent px-1 py-2 text-sm text-gray-700 outline-none"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-brand-50/90">
            <div><span className="text-xl font-bold text-white">1,200+</span> Listings</div>
            <div><span className="text-xl font-bold text-white">850+</span> Happy Clients</div>
            <div><span className="text-xl font-bold text-white">40+</span> Cities Covered</div>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
      </section>

      {/* Listings Section */}
      <section className="container-x py-12">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="section-title">Explore Properties</h2>
          <p className="text-sm text-gray-500">
            Use the filters to narrow down properties that match exactly what you need.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <Filters filters={filters} setFilters={setFilters} />
          <div className="flex-1">
            <PropertyListings filters={filters} />
          </div>
        </div>
      </section>
    </div>
  );
}
