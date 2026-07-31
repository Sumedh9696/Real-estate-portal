import React, { useEffect, useState } from "react";
import api from "../api/api";
import PropertyCard from "./PropertyCard";
import { Loader, EmptyState } from "./Loader";

const PAGE_SIZE = 6;

export default function PropertyListings({ filters }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        params[key] = value;
      }
    });

    api
      .get("/properties", { params })
      .then(({ data }) => {
        if (isMounted) setProperties(data.properties);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  if (loading) return <Loader label="Fetching properties..." />;

  if (error) {
    return (
      <EmptyState
        title="Failed to load properties"
        subtitle={error}
      />
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties match your filters"
        subtitle="Try adjusting your search criteria or resetting the filters."
      />
    );
  }

  const totalPages = Math.ceil(properties.length / PAGE_SIZE);
  const paginated = properties.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-700">{properties.length}</span>{" "}
        {properties.length === 1 ? "property" : "properties"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginated.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-secondary px-3 py-1.5 disabled:opacity-40"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                p === page
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn-secondary px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
