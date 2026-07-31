export function formatPrice(value, listingType) {
  if (value === undefined || value === null) return "N/A";

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

  return listingType === "rent" ? `${formatted} / month` : formatted;
}

export function formatArea(area) {
  if (!area) return "N/A";
  return `${new Intl.NumberFormat("en-IN").format(area)} sq.ft`;
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
