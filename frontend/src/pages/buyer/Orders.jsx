import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/authSlice";
import { getOrders } from "../../api/buyerApi";
import "./Orders.css";
import "../SharedSidebar.css";

function Orders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getOrders(user.userId);
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user?.userId]);

    useEffect(() => {
        if (user?.userId) {
            fetchOrders();
        }
    }, [user?.userId, fetchOrders]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "SUCCESS":
                return "status-success";
            case "PENDING":
                return "status-pending";
            case "FAILED":
                return "status-failed";
            default:
                return "status-pending";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="buyer-home-layout">
            {/* Sidebar */}
            <div className="sidebar-container">
                <div className="sidebar-header">
                    <h2>
                        <span>🌱</span> <span>GreenCart</span>
                    </h2>
                </div>

                <div className="sidebar-nav">
                    <div className="nav-item" onClick={() => navigate("/buyer/home")}>
                        <span>🏪</span> <span>Back to Shopping</span>
                    </div>

                    <div className="nav-item" onClick={() => navigate("/buyer/cart")}>
                        <span>🛒</span>
                        <span>My Cart</span>
                        {itemCount > 0 && (
                            <span style={{
                                marginLeft: 'auto',
                                background: '#ff5722',
                                color: 'white',
                                borderRadius: '12px',
                                padding: '2px 8px',
                                fontSize: '0.75rem'
                            }}>{itemCount}</span>
                        )}
                    </div>

                    <div className="nav-item active">
                        <span>📦</span> <span>My Orders</span>
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div className="nav-item logout-item" onClick={handleLogout}>
                        <span>🚪</span> <span>Logout</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="buyer-main-content">
                <header className="buyer-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h3>📦 My Orders</h3>
                    </div>
                    <div className="user-profile">
                        <span style={{ fontWeight: 600, color: '#2e7d32' }}>
                            Welcome, {user?.firstName || 'Buyer'}
                        </span>
                    </div>
                </header>

                <main className="buyer-main">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <h2>{error}</h2>
                            <button onClick={fetchOrders} className="retry-btn">Try Again</button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="empty-orders">
                            <span className="empty-icon">📦</span>
                            <h2>No orders yet</h2>
                            <p>Start shopping and place your first order!</p>
                            <button onClick={() => navigate("/buyer/home")} className="shop-now-btn">
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div
                                    key={order.orderId}
                                    className="order-card"
                                    onClick={() => navigate(`/buyer/orders/${order.orderId}`)}
                                >
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3>Order #{order.orderId}</h3>
                                            <p className="order-date">{formatDate(order.orderDate)}</p>
                                        </div>
                                        <span className={`status-badge ${getStatusBadgeClass(order.payment?.paymentStatus)}`}>
                                            {order.payment?.paymentStatus || "PENDING"}
                                        </span>
                                    </div>

                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span className="label">Delivery To:</span>
                                            <span className="value">{order.cityName || "N/A"}, {order.areaName || "N/A"}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Bill Number:</span>
                                            <span className="value">{order.payment?.billNumber}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Payment Method:</span>
                                            <span className="value">{order.payment?.paymentMethod}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Items:</span>
                                            <span className="value">{order.items?.length} items</span>
                                        </div>
                                    </div>

                                    <div className="order-footer">
                                        <div className="total-amount">
                                            <span className="label">Total Amount</span>
                                            <span className="amount">₹{order.totalAmount?.toFixed(2)}</span>
                                        </div>
                                        <button className="view-details-btn">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Orders;
