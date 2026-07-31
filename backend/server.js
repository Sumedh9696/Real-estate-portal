require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

const { readCollection, writeCollection } = require("./utils/db");
const propertiesRoutes = require("./routes/properties");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------- Middleware ----------
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------- Ensure default admin user exists ----------
function ensureAdminUser() {
  const usersFile = path.join(__dirname, "data", "users.json");
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]", "utf-8");
  }

  const users = readCollection("users");
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@realestate.com").toLowerCase();

  const alreadyExists = users.some((u) => u.email.toLowerCase() === adminEmail);
  if (!alreadyExists) {
    const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Admin@123", 10);
    users.push({
      id: "admin-1",
      name: "Administrator",
      email: adminEmail,
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    writeCollection("users", users);
    console.log(`✔ Default admin created -> ${adminEmail} / ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
  }
}

ensureAdminUser();

// ---------- Routes ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Real Estate Portal API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/contact", contactRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log(`🚀 Real Estate Portal API running on http://localhost:${PORT}`);
});
