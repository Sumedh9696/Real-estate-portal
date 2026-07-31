import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { Loader } from "../../components/Loader";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  listingType: "sale",
  propertyType: "Apartment",
  bedrooms: "",
  bathrooms: "",
  area: "",
  city: "",
  location: "",
  image: "",
  featured: false,
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
};

const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Plot", "Penthouse", "Studio"];

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let isMounted = true;
    api
      .get(`/properties/${id}`)
      .then(({ data }) => {
        if (isMounted) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            price: data.price ?? "",
            listingType: data.listingType || "sale",
            propertyType: data.propertyType || "Apartment",
            bedrooms: data.bedrooms ?? "",
            bathrooms: data.bathrooms ?? "",
            area: data.area ?? "",
            city: data.city || "",
            location: data.location || "",
            image: data.image || "",
            featured: Boolean(data.featured),
            ownerName: data.owner?.name || "",
            ownerPhone: data.owner?.phone || "",
            ownerEmail: data.owner?.email || "",
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id, isEdit]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      listingType: form.listingType,
      propertyType: form.propertyType,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      area: Number(form.area) || 0,
      city: form.city,
      location: form.location,
      image: form.image,
      images: [form.image],
      featured: form.featured,
      owner: {
        name: form.ownerName,
        phone: form.ownerPhone,
        email: form.ownerEmail,
      },
    };

    try {
      if (isEdit) {
        await api.put(`/properties/${id}`, payload);
      } else {
        await api.post("/properties", payload);
      }
      navigate("/admin/properties");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading property..." />;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800">
        {isEdit ? "Edit Property" : "Add New Property"}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Fill in accurate details — this listing will appear immediately on the public site.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 p-6 space-y-5">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="input-field"
            placeholder="Modern 3BHK Apartment in City Center"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="input-field resize-none"
            placeholder="Describe the property's features and highlights..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Price (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Listing Type *</label>
            <select
              value={form.listingType}
              onChange={(e) => handleChange("listingType", e.target.value)}
              className="input-field"
            >
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Property Type *</label>
            <select
              value={form.propertyType}
              onChange={(e) => handleChange("propertyType", e.target.value)}
              className="input-field"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Bedrooms</label>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => handleChange("bedrooms", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Bathrooms</label>
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(e) => handleChange("bathrooms", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Area (sq.ft)</label>
            <input
              type="number"
              min="0"
              value={form.area}
              onChange={(e) => handleChange("area", e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">City *</label>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="input-field"
              placeholder="Mumbai"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Full Location *</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="input-field"
              placeholder="Andheri West, Mumbai"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-600">Image URL</label>
          <input
            type="url"
            value={form.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="input-field"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleChange("featured", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
          />
          <label htmlFor="featured" className="text-sm text-gray-700">Mark as Featured</label>
        </div>

        <hr className="border-gray-100" />

        <h3 className="text-sm font-semibold text-gray-700">Owner Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Owner Name</label>
            <input
              type="text"
              value={form.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Owner Phone</label>
            <input
              type="tel"
              value={form.ownerPhone}
              onChange={(e) => handleChange("ownerPhone", e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Owner Email</label>
            <input
              type="email"
              value={form.ownerEmail}
              onChange={(e) => handleChange("ownerEmail", e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : isEdit ? "Update Property" : "Create Property"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/properties")}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
