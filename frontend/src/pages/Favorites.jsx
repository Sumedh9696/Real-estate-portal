import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import { useFavorites } from "../context/FavoritesContext";
import PropertyCard from "../components/PropertyCard";
import { Loader, EmptyState } from "../components/Loader";

export default function Favorites() {
  const { favoriteIds } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (favoriteIds.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .get("/properties")
      .then(({ data }) => {
        if (isMounted) {
          const filtered = data.properties.filter((p) => favoriteIds.includes(p.id));
          setProperties(filtered);
        }
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
  }, [favoriteIds]);

  return (
    <div className="container-x py-10">
      <div className="mb-8">
        <h1 className="section-title">Your Favorite Properties</h1>
        <p className="mt-1 text-sm text-gray-500">
          Properties you've saved for later — stored right on this device.
        </p>
      </div>

      {loading ? (
        <Loader label="Loading your favorites..." />
      ) : error ? (
        <EmptyState title="Failed to load favorites" subtitle={error} />
      ) : properties.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          subtitle="Tap the heart icon on any property to save it here for quick access later."
          action={
            <Link to="/" className="btn-primary mt-4">
              Browse Properties
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
