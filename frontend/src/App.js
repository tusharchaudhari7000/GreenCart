import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logoutUser } from "./redux/authSlice";
import { store } from "./redux/store";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  Navigate
} from "react-router-dom";

import LandingPage from "./pages/welcome/LandingPage";
import Login from "./pages/loginReg/Login";
import Register from "./pages/loginReg/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import BuyerHome from "./pages/buyer/BuyerHome";
import Cart from "./pages/buyer/Cart";
import Orders from "./pages/buyer/Orders";
import OrderDetails from "./pages/buyer/OrderDetails";
import ForgotPassword from "./pages/loginReg/ForgotPassword";

import { FaShoppingCart } from "react-icons/fa";
import { Toaster } from "react-hot-toast";

/* 🔒 Protected Route Component */
function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role, loading } = useSelector((state) => state.auth);

  console.log("🔒 ProtectedRoute check:", {
    isAuthenticated,
    role,
    loading,
    allowedRole,
    path: window.location.pathname
  });

  // Wait for auth state to load
  if (loading) {
    console.log("⏳ Auth still loading, showing nothing...");
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    console.log("❌ Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    console.log(`❌ Role mismatch: expected ${allowedRole}, got ${role}, redirecting to /login`);
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Access granted to protected route");
  return children;
}

function Layout() {
  const location = useLocation();

  // Hide navbar on admin, farmer, and buyer pages
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/farmer") ||
    location.pathname.startsWith("/buyer");

  return (
    <>
      {!hideNavbar && (
        <nav className="navbar">
          <Link to="/" className="nav-left" style={{ textDecoration: 'none' }}>
            <FaShoppingCart className="cart-icon" />
            <span className="brand-name">GreenCart</span>
          </Link>

          <div className="nav-right">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Register
            </NavLink>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer"
          element={
            <ProtectedRoute allowedRole="FARMER">
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/home"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <BuyerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/cart"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/orders"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buyer/orders/:orderId"
          element={
            <ProtectedRoute allowedRole="BUYER">
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🚀 Initializing App - checking auth session...");
    dispatch(checkAuth());
  }, [dispatch]);

  // 🔒 Check token expiration every 5 seconds
  useEffect(() => {
    const checkTokenExpiration = setInterval(() => {
      const state = store.getState();
      if (state.auth.tokenExpiry && Date.now() > state.auth.tokenExpiry) {
        console.warn('⏰ Token expired, logging out...');
        localStorage.removeItem('authState');
        dispatch(logoutUser());
      }
    }, 5000);

    return () => clearInterval(checkTokenExpiration);
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Layout />
    </Router>
  );
}

export default App;
