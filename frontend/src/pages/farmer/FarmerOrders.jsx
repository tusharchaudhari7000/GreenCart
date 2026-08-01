import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  getFarmerOrders,
  updatePaymentStatus
} from "../../services/farmerService";
import "./FarmerOrders.css";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getFarmerOrders(user.userId);
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId) {
      loadOrders();
    }
  }, [user?.userId, loadOrders]);

  const handleMarkAsPaid = async (paymentId) => {
    if (window.confirm("Are you sure you want to mark this order as paid? This action cannot be undone.")) {
      try {
        await updatePaymentStatus(paymentId, "SUCCESS");
        // Reload orders to reflect status change
        loadOrders();
      } catch (err) {
        console.error("Error updating payment status:", err);
        toast.error("Failed to update payment status. " + (err.response?.data?.error || err.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-container">
        <span className="empty-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={loadOrders} className="mark-paid-btn" style={{ marginTop: '1rem' }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="farmer-orders-container">
      <div className="farmer-orders-header">
        <h2>🧾 Buyer Orders</h2>
        <div className="order-stats">
          <span>Total Orders: {orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-container">
          <span className="empty-icon">📦</span>
          <p>No orders yet. Orders will appear here when buyers purchase your products.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.orderId} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Order #{order.orderId}</h3>
                  <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString()}
                  </span>
                </div>
                <div className={`payment-badge ${order.payment?.paymentStatus?.toLowerCase()}`}>
                  {order.payment?.paymentStatus || 'PENDING'}
                </div>
              </div>

              <div className="order-card-body">
                <div className="buyer-info">
                  <p><strong>Buyer ID:</strong> {order.buyerId}</p>
                  <p><strong>Address:</strong> {order.areaName || 'N/A'}, {order.cityName || 'N/A'}</p>
                  <p><strong>Payment Method:</strong> {order.payment?.paymentMethod || 'COD'}</p>
                  <p><strong>Bill Number:</strong> {order.payment?.billNumber || 'N/A'}</p>
                </div>

                <div className="items-list">
                  <h4>Items in this order:</h4>
                  {order.items.map(item => (
                    <div key={item.orderItemId} className="order-item">
                      <div className="item-details">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="item-price">₹{item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-card-footer">
                <div className="total-container">
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Order Total</span>
                  <div className="total-amount">₹{order.totalAmount.toFixed(2)}</div>
                </div>

                {order.payment?.paymentStatus === 'PENDING' && (
                  <button
                    onClick={() => handleMarkAsPaid(order.payment.paymentId)}
                    className="mark-paid-btn"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FarmerOrders;
