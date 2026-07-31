import React from "react";
import { useFavorites } from "../context/FavoritesContext";
import { IconHeart } from "./Icons";

export default function FavoriteButton({ propertyId, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      title={active ? "Remove from favorites" : "Add to favorites"}
      className={`flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm transition-transform hover:scale-110 active:scale-95 ${
        active ? "text-red-500" : "text-gray-400 hover:text-red-400"
      } ${className}`}
    >
      <IconHeart filled={active} />
    </button>
  );
}
