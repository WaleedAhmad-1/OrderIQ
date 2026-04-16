import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ChatAssistant from "./components/chat/ChatAssistant";

// Admin Auth & Providers
import { AdminAuthProvider } from "./features/admin/AdminAuthContext";
import { AdminFiltersProvider } from "./features/admin/AdminFiltersContext";
import { CartProvider } from "./features/customer/CartContext";
import { FavoritesProvider } from "./features/customer/FavoritesContext";
import ProtectedAdminRoute from "./components/auth/ProtectedAdminRoute";
import ProtectedRestaurantRoute from "./components/auth/ProtectedRestaurantRoute";

// Lazy Imports
const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));

// Auth Pages
const RoleSelection = lazy(() => import("./pages/auth/RoleSelection"));
const CustomerSignup = lazy(() => import("./pages/auth/CustomerSignup"));
const RestaurantSignup = lazy(() => import("./pages/auth/RestaurantSignup"));

// Customer
const CustomerHome = lazy(() => import("./pages/customer/Home"));
const RestaurantDetails = lazy(() => import("./pages/customer/RestaurantDetails"));
const CartPage = lazy(() => import("./pages/customer/CartPage"));
const OrderTracking = lazy(() => import("./pages/customer/OrderTracking"));
const Profile = lazy(() => import("./pages/customer/Profile"));
const Favorites = lazy(() => import("./pages/customer/Favorites"));
const Addresses = lazy(() => import("./pages/customer/Addresses"));
const ProfileSettings = lazy(() => import("./pages/customer/ProfileSettings"));
const Rewards = lazy(() => import("./pages/customer/Rewards"));
const Referrals = lazy(() => import("./pages/customer/Referrals"));
const QRMenuPage = lazy(() => import("./pages/customer/QRMenuPage"));

// Restaurant
const RestaurantDashboard = lazy(() => import("./pages/restaurant/Dashboard"));
const RestaurantLayout = lazy(() => import("./layouts/RestaurantLayout"));
const LiveOrders = lazy(() => import("./pages/restaurant/LiveOrders"));
const Menu = lazy(() => import("./pages/restaurant/MenuManagement"));
const OrderHistory = lazy(() => import("./pages/restaurant/OrderHistory"));
const Availability = lazy(() => import("./pages/restaurant/Availability"));
const Team = lazy(() => import("./pages/restaurant/Team"));
const Settings = lazy(() => import("./pages/restaurant/Settings"));
const Analytics = lazy(() => import("./pages/restaurant/Analytics"));
const QRCodeManagement = lazy(() => import("./pages/restaurant/QRCodeManagement"));

// Admin
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminRestaurants = lazy(() => import("./pages/admin/Restaurants"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminCampaigns = lazy(() => import("./pages/admin/Campaigns"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

function App() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>}>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RoleSelection />} />
        <Route path="/register/customer" element={<CustomerSignup />} />
        <Route path="/register/restaurant" element={<RestaurantSignup />} />

        {/*Customer Dashboard*/}
        <Route
          element={
            <CartProvider>
              <FavoritesProvider>
                <Outlet />
              </FavoritesProvider>
            </CartProvider>
          }
        >
          <Route path="/customer" element={<CustomerHome />} />
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route
            path="/customer/restaurant/:id"
            element={<RestaurantDetails />}
          />
          <Route path="/customer/checkout" element={<CartPage />} />
          <Route path="/customer/orders/:id" element={<OrderTracking />} />
          <Route path="/customer/orders" element={<Profile />} />
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/customer/profile/favorites" element={<Favorites />} />
          <Route path="/customer/profile/addresses" element={<Addresses />} />
          <Route
            path="/customer/profile/settings"
            element={<ProfileSettings />}
          />
          <Route path="/customer/profile/rewards" element={<Rewards />} />
          <Route path="/customer/profile/referrals" element={<Referrals />} />
        </Route>

        {/*Restaurant*/}
        <Route
          path="/restaurant"
          element={
            <ProtectedRestaurantRoute>
              <RestaurantLayout />
            </ProtectedRestaurantRoute>
          }
        >
          <Route index element={<RestaurantDashboard />} />
          <Route path="dashboard" element={<RestaurantDashboard />} />
          <Route path="live-orders" element={<LiveOrders />} />
          <Route path="menu" element={<Menu />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="availability" element={<Availability />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Settings />} />
          <Route path="qr-codes" element={<QRCodeManagement />} />
        </Route>

        {/* Admin Dashboard (protected) */}
        <Route
          path="/admin"
          element={
            <AdminAuthProvider>
              <ProtectedAdminRoute>
                <AdminFiltersProvider>
                  <AdminLayout />
                </AdminFiltersProvider>
              </ProtectedAdminRoute>
            </AdminAuthProvider>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="restaurants" element={<AdminRestaurants />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public QR Menu Route (for scanned QR codes) */}
        <Route
          element={
            <CartProvider>
              <Outlet />
            </CartProvider>
          }
        >
          <Route path="/menu/:restaurantId" element={<QRMenuPage />} />
        </Route>
      </Routes>
      </Suspense>
      <ChatAssistant />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
    </>
  );
}

export default App;
