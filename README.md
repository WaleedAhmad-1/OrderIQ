# 🍽️ OrderIQ

**OrderIQ** is a full-stack food ordering platform that connects customers, restaurant owners, and administrators in real-time. Built with a modern React frontend and a Node.js/Express backend, it supports live order tracking via Socket.io, Firebase authentication, Cloudinary image uploads, and a PostgreSQL database managed through Prisma.

---

## 📐 Architecture Overview

```
orderiq/
├── frontend/          # React (Vite) — Customer, Restaurant, Admin UIs
└── backend/           # Node.js (Express) — REST API + Socket.io server
```

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion, React Router v7 |
| **State / Context** | React Context API (Auth, Cart, Restaurant, Admin) |
| **Real-time** | Socket.io Client |
| **Auth** | Firebase Authentication |
| **HTTP Client** | Axios |
| **UI Extras** | Lucide React, Headless UI, React Hot Toast |
| **Backend** | Node.js, Express 5 |
| **Database** | PostgreSQL (hosted on Supabase) via Prisma ORM |
| **Auth (Server)** | Firebase Admin SDK |
| **Image Uploads** | Cloudinary + Multer |
| **Real-time** | Socket.io |
| **Security** | Helmet, express-rate-limit, CORS |
| **Logging** | Morgan |
| **Email** | Nodemailer |

---

## ✨ Features

### 👤 Customer
- Browse restaurants by cuisine, area, and service type
- Real-time restaurant details and menu browsing
- Cart management with delivery / pickup / dine-in selection
- Live order tracking with Socket.io
- Saved addresses, favorites, rewards points, and referral codes
- Firebase-authenticated profile and settings

### 🍳 Restaurant Owner
- Secure restaurant dashboard (protected route)
- Live orders panel with real-time status updates
- Full menu management (categories + items, images via Cloudinary)
- Availability toggling and working hours
- Team management (invite staff / managers)
- Order history and analytics

### 🛡️ Admin
- Admin-only protected dashboard
- Manage all users, restaurants, orders, and campaigns
- Platform-wide settings

---

## 🗂️ Database Schema (Prisma)

Models: `User` · `Restaurant` · `Category` · `MenuItem` · `Order` · `OrderItem` · `Address` · `TeamMember` · `Reward` · `Favorite`

Key enums: `Role` · `OrderStatus` · `OrderType` · `PaymentMethod` · `RestaurantStatus`

> See [`backend/prisma/schema.prisma`](./backend/prisma/schema.prisma) for the full schema.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Supabase](https://supabase.com) PostgreSQL project (or any PostgreSQL instance)
- A [Firebase](https://firebase.google.com) project (Auth enabled)
- A [Cloudinary](https://cloudinary.com) account

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/orderiq.git
cd orderiq
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000

# PostgreSQL — Supabase connection pooler URL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/postgres"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

Push the database schema:

```bash
npx prisma db push
```

Start the backend:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

The API will be available at `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Firebase Web SDK
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints (Overview)

| Prefix | Description |
|---|---|
| `GET /api/health` | Server health check |
| `/api/auth` | Registration, login, profile (`/me`) |
| `/api/restaurants` | List, create, update restaurants and menu |
| `/api/orders` | Place, track, and manage orders |
| `/api/users` | User profile, addresses, favorites, rewards |
| `/api/admin` | Admin-only: users, restaurants, orders, campaigns |
| `/api/upload` | Image upload to Cloudinary |

---

## 🔌 Real-time Events (Socket.io)

| Event | Direction | Description |
|---|---|---|
| `join_restaurant` | Client → Server | Join a restaurant's notification room |
| `join_order` | Client → Server | Join an order tracking room |
| `new_order` | Server → Restaurant | Notify restaurant of a new order |
| `order_status_update` | Server → Customer | Broadcast order status change |

---

## 🌳 Project Structure

```
frontend/src/
├── components/         # Reusable UI components
│   ├── auth/           # Login modal, protected routes
│   ├── customer/       # DishCard, RestaurantCard
│   ├── layout/         # Navbar, Footer, CustomerLayout, DashboardSidebar
│   ├── sections/       # Landing page sections (Hero, CTA, Features, etc.)
│   └── ui/             # Button, Card, Drawer primitives
├── features/           # React Context providers
│   ├── auth/           # AuthContext (Firebase)
│   ├── customer/       # CartContext
│   ├── restaurant/     # RestaurantContext
│   └── admin/          # AdminAuthContext, AdminFiltersContext
├── layouts/            # AdminLayout, RestaurantLayout (with sidebar)
├── pages/              # Route-level page components
│   ├── LandingPage/
│   ├── auth/           # RoleSelection, CustomerSignup, RestaurantSignup
│   ├── customer/       # Home, RestaurantDetails, CartPage, OrderTracking, Profile, ...
│   ├── restaurant/     # Dashboard, LiveOrders, MenuManagement, Analytics, ...
│   └── admin/          # Dashboard, Users, Restaurants, Orders, Campaigns, Settings
├── services/           # Axios service modules per domain
└── config/             # Firebase web config

backend/
├── config/             # db.js (Prisma client), firebase.js (Admin SDK)
├── controllers/        # Business logic per domain
├── middleware/         # auth.js (Firebase token verify), upload.js (multer)
├── prisma/             # schema.prisma
├── routes/             # Express routers
├── scripts/            # createAdmin.js (seed admin user)
├── uploads/            # Runtime image uploads (gitignored)
└── server.js           # Entry point
```

---

## 🔐 Creating an Admin User

There is no admin registration UI. Use the seed script:

```bash
cd backend
node scripts/createAdmin.js
```

Then log in at `/admin` with the credentials set in the script.

---

## 📦 Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend — no build step required, deploy server.js directly
```

---

## 📝 License

MIT — feel free to fork and build on this project.
