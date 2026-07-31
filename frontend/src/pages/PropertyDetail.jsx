import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import { Loader, EmptyState } from "../components/Loader";
import FavoriteButton from "../components/FavoriteButton";
import ContactOwnerModal from "../components/ContactOwnerModal";
import {
  IconBed,
  IconBath,
  IconArea,
  IconLocation,
  IconPhone,
  IconMail,
} from "../components/Icons";
import { formatPrice, formatArea, formatDate } from "../utils/format";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .get(`/properties/${id}`)
      .then(({ data }) => {
        if (isMounted) {
          setProperty(data);
          setActiveImage(0);
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
  }, [id]);

  if (loading) return <Loader label="Loading property details..." />;

  if (error || !property) {
    return (
      <div className="container-x py-16">
        <EmptyState
          title="Property not found"
          subtitle={error || "This listing may have been removed."}
          action={
            <Link to="/" className="btn-primary mt-4">
              Back to Listings
            </Link>
          }
        />
      </div>
    );
  }

  const images = property.images?.length ? property.images : [property.image];

  return (
    <div className="container-x py-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-brand-500">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images + details */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={images[activeImage]}
              alt={property.title}
              className="h-[380px] w-full object-cover md:h-[440px]"
            />
            <FavoriteButton propertyId={property.id} className="absolute top-4 right-4 h-10 w-10" />
            <span className="absolute top-4 left-4 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white capitalize">
              For {property.listingType}
            </span>
          </div>

          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    activeImage === idx ? "border-brand-500" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`${property.title} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="card mt-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{property.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <IconLocation className="w-4 h-4 text-brand-500" />
                  {property.location}, {property.city}
                </p>
              </div>
              <p className="text-2xl font-extrabold text-brand-600 whitespace-nowrap">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-gray-100 py-5">
              <Stat icon={<IconBed className="w-5 h-5" />} label="Bedrooms" value={property.bedrooms} />
              <Stat icon={<IconBath className="w-5 h-5" />} label="Bathrooms" value={property.bathrooms} />
              <Stat icon={<IconArea className="w-5 h-5" />} label="Area" value={formatArea(property.area)} />
              <Stat icon={<IconLocation className="w-5 h-5" />} label="Type" value={property.propertyType} />
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Description</h3>
              <p className="leading-relaxed text-gray-600">{property.description}</p>
            </div>

            <p className="mt-6 text-xs text-gray-400">
              Listed on {formatDate(property.createdAt)}
            </p>
          </div>
        </div>

        {/* Right: Owner card */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20 p-6">
            <h3 className="text-base font-semibold text-gray-800">Listed By</h3>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
                {property.owner?.name?.charAt(0) || "O"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{property.owner?.name || "Property Owner"}</p>
                <p className="text-xs text-gray-500">Property Owner</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-gray-600">
              {property.owner?.phone && (
                <p className="flex items-center gap-2">
                  <IconPhone className="w-4 h-4 text-brand-500" /> {property.owner.phone}
                </p>
              )}
              {property.owner?.email && (
                <p className="flex items-center gap-2">
                  <IconMail className="w-4 h-4 text-brand-500" /> {property.owner.email}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowContactModal(true)}
              className="btn-primary mt-6 w-full"
            >
              Contact Owner
            </button>
          </div>
        </div>
      </div>

      {showContactModal && (
        <ContactOwnerModal property={property} onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-brand-50/60 py-3 text-center">
      <span className="text-brand-500">{icon}</span>
      <span className="mt-1 text-sm font-bold text-gray-800">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
