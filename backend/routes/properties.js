const express = require("express");
const { readCollection, writeCollection } = require("../utils/db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/properties - list properties with optional filters
// Supported query params: city, propertyType, listingType, minPrice, maxPrice,
// bedrooms, search, sort (price_asc | price_desc | newest)
router.get("/", (req, res) => {
  let properties = readCollection("properties");

  const {
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    bedrooms,
    search,
    sort,
  } = req.query;

  if (city) {
    properties = properties.filter(
      (p) => p.city.toLowerCase() === String(city).toLowerCase()
    );
  }

  if (propertyType) {
    properties = properties.filter(
      (p) => p.propertyType.toLowerCase() === String(propertyType).toLowerCase()
    );
  }

  if (listingType) {
    properties = properties.filter(
      (p) => p.listingType.toLowerCase() === String(listingType).toLowerCase()
    );
  }

  if (minPrice) {
    properties = properties.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    properties = properties.filter((p) => p.price <= Number(maxPrice));
  }

  if (bedrooms) {
    properties = properties.filter((p) => p.bedrooms >= Number(bedrooms));
  }

  if (search) {
    const q = String(search).toLowerCase();
    properties = properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }

  if (sort === "price_asc") {
    properties = [...properties].sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    properties = [...properties].sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    properties = [...properties].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  res.json({ count: properties.length, properties });
});

// GET /api/properties/meta/cities - distinct cities & property types for filter dropdowns
router.get("/meta/filters", (req, res) => {
  const properties = readCollection("properties");
  const cities = [...new Set(properties.map((p) => p.city))].sort();
  const propertyTypes = [...new Set(properties.map((p) => p.propertyType))].sort();
  const prices = properties.map((p) => p.price);
  res.json({
    cities,
    propertyTypes,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
  });
});

// GET /api/properties/:id - single property detail
router.get("/:id", (req, res) => {
  const properties = readCollection("properties");
  const property = properties.find((p) => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found." });
  }
  res.json(property);
});

// POST /api/properties - create a new property (admin only)
router.post("/", requireAdmin, (req, res) => {
  const properties = readCollection("properties");

  const {
    title,
    description,
    price,
    listingType,
    propertyType,
    bedrooms,
    bathrooms,
    area,
    city,
    location,
    image,
    images,
    owner,
    featured,
  } = req.body;

  if (!title || !price || !listingType || !propertyType || !city || !location) {
    return res.status(400).json({
      message:
        "title, price, listingType, propertyType, city and location are required.",
    });
  }

  const newProperty = {
    id: Date.now().toString(),
    title,
    description: description || "",
    price: Number(price),
    listingType,
    propertyType,
    bedrooms: Number(bedrooms) || 0,
    bathrooms: Number(bathrooms) || 0,
    area: Number(area) || 0,
    city,
    location,
    image: image || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    images: images && images.length ? images : [image || ""],
    owner: owner || { name: "", phone: "", email: "" },
    featured: Boolean(featured),
    createdAt: new Date().toISOString(),
  };

  properties.push(newProperty);
  writeCollection("properties", properties);

  res.status(201).json(newProperty);
});

// PUT /api/properties/:id - update an existing property (admin only)
router.put("/:id", requireAdmin, (req, res) => {
  const properties = readCollection("properties");
  const index = properties.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Property not found." });
  }

  properties[index] = {
    ...properties[index],
    ...req.body,
    id: properties[index].id,
    updatedAt: new Date().toISOString(),
  };

  writeCollection("properties", properties);
  res.json(properties[index]);
});

// DELETE /api/properties/:id - delete a property (admin only)
router.delete("/:id", requireAdmin, (req, res) => {
  const properties = readCollection("properties");
  const index = properties.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Property not found." });
  }

  const removed = properties.splice(index, 1);
  writeCollection("properties", properties);
  res.json({ message: "Property deleted successfully.", property: removed[0] });
});

module.exports = router;
