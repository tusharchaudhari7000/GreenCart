import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminService from "../../services/adminService";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await adminService.toggleStockVisibility(id);
      fetchData(); // Refresh list
    } catch (error) {
      toast.error("Failed to toggle visibility");
    }
  };

  const handleDeleteStock = async (id) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      try {
        await adminService.deleteStockItem(id);
        fetchData(); // Refresh list
      } catch (error) {
        toast.error("Failed to delete stock item");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-products-section">
      <div className="section-header">
        <h2>📦 Manage Product Listings</h2>
        <div className="order-stats">
          <span className="admin-badge" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", padding: "5px 15px", borderRadius: "15px", fontSize: "0.8rem", fontWeight: "bold" }}>
            Total Stock Items: {products.length}
          </span>
        </div>
      </div>

      <div className="admin-card-grid">
        {products.map(p => {
          const isHidden = p.status === "HIDDEN";
          return (
            <div key={p.stockId} className="admin-card" style={{ opacity: isHidden ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span className={`status-badge ${isHidden ? "suspended" : "approved"}`}>
                  {isHidden ? "Hidden" : "Available"}
                </span>
                <span style={{ color: "#aaa", fontSize: "0.75rem" }}>STOCK-{p.stockId}</span>
              </div>

              <h4 style={{ margin: "0 0 0.5rem 0", color: "#1b5e20", fontSize: "1.1rem" }}>{p.product.pname} {isHidden && "(Offline)"}</h4>
              <div style={{ marginBottom: "1.25rem", borderLeft: "3px solid #e8f5e9", paddingLeft: "10px" }}>
                <p style={{ margin: "0.25rem 0", color: "#555", fontSize: "0.9rem" }}>
                  <strong>Current Price:</strong> ₹{p.price}
                </p>
                <p style={{ margin: "0.25rem 0", color: "#555", fontSize: "0.9rem" }}>
                  <strong>Sold by:</strong> {p.seller ? `${p.seller.firstName} ${p.seller.lastName}` : "Unknown Seller"}
                </p>
                <p style={{
                  margin: "0.25rem 0",
                  color: p.quantity < 20 ? "#d32f2f" : "#555",
                  fontSize: "0.9rem",
                  fontWeight: p.quantity < 20 ? "700" : "500"
                }}>
                  <strong>Stock Level:</strong> {p.quantity} units {p.quantity < 20 && "(Low Inventory!)"}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  className={`admin-btn ${isHidden ? "admin-btn-outline" : "admin-btn-outline"}`}
                  style={{ flex: 1, fontSize: "0.8rem", border: isHidden ? "1px solid #4caf50" : "1px solid #ff9800" }}
                  onClick={() => handleToggleVisibility(p.stockId)}
                >
                  {isHidden ? "Unhide" : "Hide Listing"}
                </button>
                <button
                  className="admin-btn admin-btn-danger"
                  style={{ flex: 1, fontSize: "0.8rem" }}
                  onClick={() => handleDeleteStock(p.stockId)}
                >
                  Remove Fully
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsList;
