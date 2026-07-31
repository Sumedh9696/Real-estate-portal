import React from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { IconBed, IconBath, IconArea, IconLocation } from "./Icons";
import { formatPrice, formatArea } from "../utils/format";

export default function PropertyCard({ property }) {
  return (
    <Link
      to={`/property/${property.id}`}
      className="card group overflow-hidden hover:shadow-cardHover hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white capitalize shadow">
            For {property.listingType}
          </span>
          {property.featured && (
            <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white shadow">
              Featured
            </span>
          )}
        </div>
        <FavoriteButton
          propertyId={property.id}
          className="absolute top-3 right-3 h-9 w-9"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-lg font-bold text-brand-600">
          {formatPrice(property.price, property.listingType)}
        </p>
        <h3 className="mt-1 line-clamp-1 text-base font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 line-clamp-1">
          <IconLocation className="w-4 h-4 shrink-0 text-gray-400" />
          {property.location}
        </p>

        <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <IconBed className="w-4 h-4 text-brand-500" /> {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <IconBath className="w-4 h-4 text-brand-500" /> {property.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <IconArea className="w-4 h-4 text-brand-500" /> {formatArea(property.area)}
          </span>
        </div>
      </div>
    </Link>
  );
}
