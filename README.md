<<<<<<< HEAD
# EstateNest — Real Estate Portal

A complete, professional full-stack Real Estate Portal built with **React (Vite + Tailwind CSS)** on the frontend and **Node.js + Express** on the backend.

## ✨ Features

1. **Property Listings** — Responsive grid of properties with pagination, images, price, beds/baths/area.
2. **Filters** — Filter by listing type (sale/rent), property type, city, price range, bedrooms, keyword search, and sorting (newest / price low-high / high-low). Works on desktop (sidebar) and mobile (slide-in drawer).
3. **Contact Owner** — Modal form on each property's detail page that sends an inquiry straight to the admin panel.
4. **Favorite Properties** — Save/unsave any listing with a heart icon; persists locally per device (localStorage) and has its own "Favorites" page.
5. **Admin Panel** — Secure JWT-protected dashboard to:
   - View stats (total listings, for sale/rent, featured, unread messages)
   - Add / Edit / Delete properties
   - View & manage contact messages from interested buyers/tenants

## 🗂️ Project Structure

```
real-estate-portal/
├── backend/                 # Express REST API
│   ├── data/                 # JSON "database" files (properties, messages, users)
│   ├── middleware/            # JWT auth middleware
│   ├── routes/                 # auth, properties, contact routes
│   ├── utils/                   # db read/write helper
│   ├── server.js                # app entry point
│   ├── package.json
│   └── .env                      # environment variables (already configured)
│
└── frontend/                 # React (Vite) application
    ├── src/
    │   ├── api/                  # axios instance
    │   ├── components/            # Navbar, Footer, Filters, PropertyCard, etc.
    │   ├── context/                 # FavoritesContext, AuthContext
    │   ├── pages/                    # Home, PropertyDetail, Favorites, Admin/*
    │   ├── utils/                     # formatting helpers
    │   ├── App.jsx                    # routes
    │   ├── main.jsx                   # entry point
    │   └── index.css                  # Tailwind + custom styles
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm start          # or: npm run dev  (auto-restart with nodemon)
```

The API runs on **http://localhost:5000**. A default admin account is automatically created on first run using the credentials in `.env`:

```
Email:    admin@realestate.com
Password: Admin@123
```

You can change these at any time by editing `backend/.env` **before** the first run (the admin user is only auto-created if it doesn't already exist in `data/users.json`).

### 2. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173** and automatically talks to the backend at `http://localhost:5000/api` (configurable via `frontend/.env` — copy `.env.example` to `.env` if you need to change it).

### 3. Using the App

- Visit `http://localhost:5173` to browse listings, use filters, favorite properties, and contact owners.
- Visit `http://localhost:5173/admin/login` and sign in with the admin credentials above to manage properties and view messages.

## 🏗️ Building for Production

```bash
cd frontend
npm run build       # outputs static files to frontend/dist
```

Serve the `dist` folder with any static host (Nginx, Vercel, Netlify, etc.), and deploy the `backend` folder to any Node hosting (Render, Railway, an EC2 box, etc.) — just make sure to set real environment variables (`JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`) in production and point `VITE_API_URL` at your deployed API URL.

## 🧱 Tech Stack

| Layer     | Technology                                  |
|-----------|----------------------------------------------|
| Frontend  | React 18, Vite, React Router, Tailwind CSS, Axios |
| Backend   | Node.js, Express, JWT (jsonwebtoken), bcryptjs |
| Storage   | JSON file-based data store (zero external DB setup needed) |

> **Note:** This project uses a lightweight JSON-file data store so it runs instantly with no database installation. For a production deployment, swap `backend/utils/db.js` calls for a real database (MongoDB, PostgreSQL, etc.) — the route logic is already structured so this is a drop-in change.

## 🔒 Security Notes for Production

- Change `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env` before deploying.
- Add HTTPS / a reverse proxy in front of the API.
- Consider rate-limiting the `/api/contact` and `/api/auth/login` endpoints.

---

Built with ❤️ — fully tested end-to-end (backend API smoke-tested, frontend production build verified with zero errors).
=======
# Real-estate-portal
the new age real estate portal fully functional 
>>>>>>> e14a9a03f4e1da0efd42807577e2154117ff2126
