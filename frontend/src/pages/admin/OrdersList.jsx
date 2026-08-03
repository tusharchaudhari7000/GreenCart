import { useEffect, useState } from "react";
import adminService from "../../services/adminService";

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInspect = (order) => {
    setSelectedOrder(order);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-orders-section">
      <div className="section-header">
        <h2>🧾 System-wide Orders Overview</h2>
        <div className="order-stats">
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Viewing all active transactions</span>
        </div>
      </div>

      <div className="admin-card-grid">
        {orders.map(o => (
          <div key={o.orderId} className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span className={`status-badge ${o.payment?.paymentStatus === 'SUCCESS' ? 'approved' : 'suspended'}`}>
                {o.payment?.paymentStatus || 'PENDING'}
              </span>
              <span style={{ color: "#aaa", fontSize: "0.75rem" }}>ORDER-#{o.orderId}</span>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <h4 style={{ margin: "0 0 0.25rem 0", color: "#333", fontSize: "1.1rem" }}>{o.buyer.firstName} {o.buyer.lastName}</h4>
              <p style={{ margin: "0", color: "#888", fontSize: "0.85rem" }}>
                Placed on: {new Date(o.orderDate).toLocaleDateString()} • {o.payment?.paymentMethod || 'N/A'}
              </p>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#fdfdfd",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #f0f0f0",
              marginBottom: "1.5rem"
            }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer ID</div>
                <div style={{ fontWeight: "600", color: "#444" }}>#{o.buyer.userId}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.7rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Amount</div>
                <div style={{ fontWeight: "800", color: "#1b5e20", fontSize: "1.2rem" }}>₹{o.totalAmount}</div>
              </div>
            </div>

            <button
              className="admin-btn admin-btn-outline"
              style={{ width: "100%", fontSize: "0.9rem", fontWeight: "700" }}
              onClick={() => handleInspect(o)}
            >
              Inspect Full Order Details
            </button>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div className="admin-modal-content" style={{
            background: "white", padding: "2rem", borderRadius: "15px", width: "90%", maxWidth: "600px",
            maxHeight: "80vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0 }}>Order Details: #{selectedOrder.orderId}</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ border: "none", background: "none", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <p><strong>Customer:</strong> {selectedOrder.buyer.firstName} {selectedOrder.buyer.lastName} ({selectedOrder.buyer.email})</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>
              <p><strong>Payment:</strong> {selectedOrder.payment?.paymentMethod || 'N/A'} ({selectedOrder.payment?.paymentStatus || 'PENDING'})</p>
            </div>

            <h4>Line Items:</h4>
            <div style={{ border: "1px solid #eee", borderRadius: "10px", overflow: "hidden" }}>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex", justifyContent: "space-between", padding: "0.75rem 1rem",
                  borderBottom: idx === selectedOrder.items.length - 1 ? "none" : "1px solid #eee"
                }}>
                  <div>
                    <div style={{ fontWeight: "600" }}>{item.product.pname}</div>
                    <div style={{ fontSize: "0.8rem", color: "#888" }}>₹{item.unitPrice} × {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: "700" }}>₹{item.totalPrice}</div>
                </div>
              ))}
              {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                <div style={{ padding: "1rem", textAlign: "center", color: "#888" }}>No items found in this order record.</div>
              )}
            </div>

            <button
              className="admin-btn admin-btn-primary"
              style={{ width: "100%", marginTop: "1.5rem" }}
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersList;
