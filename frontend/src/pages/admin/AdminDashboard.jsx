import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";

import ManageAccounts from "./ManageAccounts";
import ProductsList from "./ProductsList";
import OrdersList from "./OrdersList";
import ManageCategories from "./ManageCategories";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [section, setSection] = useState("accounts");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-dashboard-container">

      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>
          <span>🌱</span> <span>Admin Panel</span>
        </h2>

        <div className="sidebar-nav">
          <div
            className={`nav-item ${section === "accounts" ? "active" : ""}`}
            onClick={() => setSection("accounts")}
          >
            <span>👥</span> <span>Accounts</span>
          </div>
          <div
            className={`nav-item ${section === "products" ? "active" : ""}`}
            onClick={() => setSection("products")}
          >
            <span>📦</span> <span>Products</span>
          </div>
          <div
            className={`nav-item ${section === "catalog" ? "active" : ""}`}
            onClick={() => setSection("catalog")}
          >
            <span>🛠️</span> <span>Catalog</span>
          </div>
          <div
            className={`nav-item ${section === "orders" ? "active" : ""}`}
            onClick={() => setSection("orders")}
          >
            <span>🧾</span> <span>Orders</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="nav-item logout-item" onClick={handleLogout}>
            <span>🚪</span> <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        <header className="admin-header">
          <h3>GreenCart Management System</h3>
          <div className="user-profile">
            <span>Welcome, Administrator</span>
          </div>
        </header>

        <main className="admin-content-body">
          {section === "accounts" && <ManageAccounts />}
          {section === "products" && <ProductsList />}
          {section === "catalog" && <ManageCategories />}
          {section === "orders" && <OrdersList />}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
