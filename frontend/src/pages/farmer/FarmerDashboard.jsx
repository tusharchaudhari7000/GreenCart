import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";

import MyProducts from "./MyProducts";
import AddProduct from "./AddProduct";
import FarmerOrders from "./FarmerOrders";
import "../SharedSidebar.css";

function FarmerDashboard() {
  const [section, setSection] = useState("my-products");
  const [productToEdit, setProductToEdit] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setSection("add-product");
  };

  const handleBackToProducts = () => {
    setProductToEdit(null);
    setSection("my-products");
  };

  return (
    <div className="admin-dashboard-container"> {/* Reusing the flex container structure */}
      {/* Sidebar */}
      <div className="sidebar-container">
        <div className="sidebar-header">
          <h2>
            <span>👨‍🌾</span> <span>Farmer Panel</span>
          </h2>
        </div>

        <div className="sidebar-nav">
          <div
            className={`nav-item ${section === "my-products" ? "active" : ""}`}
            onClick={() => {
              setProductToEdit(null);
              setSection("my-products");
            }}
          >
            <span>📦</span> <span>My Products</span>
          </div>

          <div
            className={`nav-item ${section === "add-product" ? "active" : ""}`}
            onClick={() => {
              setProductToEdit(null);
              setSection("add-product");
            }}
          >
            <span>➕</span> <span>Add Product</span>
          </div>

          <div
            className={`nav-item ${section === "orders" ? "active" : ""}`}
            onClick={() => setSection("orders")}
          >
            <span>🧾</span> <span>Buyer Orders</span>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="nav-item logout-item" onClick={handleLogout}>
            <span>🚪</span> <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content"> {/* Reusing content area styling */}
        <header className="admin-header">
          <h3>Farmer Operations Center</h3>
          <div className="user-profile">
            <span>Welcome, Farmer</span>
          </div>
        </header>

        <main className="admin-content-body">
          {section === "my-products" && (
            <MyProducts
              onAddProductClick={() => setSection("add-product")}
              onEditProduct={handleEditProduct}
            />
          )}
          {section === "add-product" && (
            <AddProduct
              productToEdit={productToEdit}
              onBackToProducts={handleBackToProducts}
            />
          )}
          {section === "orders" && <FarmerOrders />}
        </main>
      </div>
    </div>
  );
}

export default FarmerDashboard;
