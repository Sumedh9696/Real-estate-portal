import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Loader, EmptyState } from "../../components/Loader";
import { IconPlus, IconEdit, IconTrash, IconStar } from "../../components/Icons";
import { formatPrice } from "../../utils/format";

export default function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadProperties = () => {
    setLoading(true);
    api
      .get("/properties")
      .then(({ data }) => setProperties(data.properties))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader label="Loading properties..." />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Properties</h1>
          <p className="text-sm text-gray-500">{properties.length} total listings</p>
        </div>
        <Link to="/admin/properties/new" className="btn-primary">
          <IconPlus /> Add Property
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-sm"
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {filtered.length === 0 ? (
        <EmptyState
          title="No properties found"
          subtitle="Try a different search or add a new property."
        />
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-500">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-11 w-14 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1 max-w-[220px]">
                          {p.title}
                        </p>
                        {p.featured && (
                          <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-accent-600">
                            <IconStar className="w-3 h-3" /> Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.city}</td>
                  <td className="px-4 py-3 text-gray-600">{p.propertyType}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{p.listingType}</td>
                  <td className="px-4 py-3 font-semibold text-brand-600">
                    {formatPrice(p.price, p.listingType)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/properties/${p.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-500"
                        title="Edit"
                      >
                        <IconEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        disabled={deletingId === p.id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 disabled:opacity-50"
                        title="Delete"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
