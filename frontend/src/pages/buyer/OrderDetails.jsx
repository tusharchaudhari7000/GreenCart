import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails } from "../../api/buyerApi";
import "./OrderDetails.css";

function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await getOrderDetails(orderId);
            setOrder(data);
        } catch (err) {
            setError("Failed to load order details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="order-details-page">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-details-page">
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <h2>{error || "Order not found"}</h2>
                    <button onClick={() => navigate("/buyer/orders")} className="back-btn">
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="order-details-page">
            <header className="details-header no-print">
                <button onClick={() => navigate("/buyer/orders")} className="back-btn">
                    ← Back to Orders
                </button>
                <h1>Order Details</h1>
                <button onClick={handlePrint} className="print-btn">
                    🖨️ Print Bill
                </button>
            </header>

            <main className="details-main">
                <div className="invoice-container">
                    {/* Invoice Header */}
                    <div className="invoice-header">
                        <div className="company-info">
                            <h1>🌿 GreenCart</h1>
                            <p>Fresh Vegetables & Fruits</p>
                            <p>Email: support@greencart.com</p>
                            <p>Phone: +91 1234567890</p>
                        </div>
                        <div className="invoice-info">
                            <h2>INVOICE</h2>
                            <p><strong>Bill No:</strong> {order.payment?.billNumber}</p>
                            <p><strong>Order ID:</strong> #{order.orderId}</p>
                            <p><strong>Date:</strong> {formatDate(order.orderDate)}</p>
                            <p><strong>Shipping Address:</strong> {order.areaName || 'N/A'}, {order.cityName || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="payment-status-section">
                        <div className="status-row">
                            <span className="label">Payment Status:</span>
                            <span className={`status-badge status-${order.payment?.paymentStatus?.toLowerCase()}`}>
                                {order.payment?.paymentStatus}
                            </span>
                        </div>
                        <div className="status-row">
                            <span className="label">Payment Method:</span>
                            <span className="value">{order.payment?.paymentMethod}</span>
                        </div>
                        <div className="status-row">
                            <span className="label">Payment Date:</span>
                            <span className="value">{formatDate(order.payment?.paymentDate)}</span>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="items-section">
                        <h3>Order Items</h3>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, index) => (
                                    <tr key={item.orderItemId}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="product-cell">
                                                {item.imagePath && (
                                                    <img src={item.imagePath} alt={item.productName} className="product-thumb" />
                                                )}
                                                <span>{item.productName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="category-cell">
                                                {item.categoryName && <span className="category-tag">{item.categoryName}</span>}
                                                {item.subCategoryName && <span className="subcategory-tag">{item.subCategoryName}</span>}
                                            </div>
                                        </td>
                                        <td>₹{item.unitPrice?.toFixed(2)}</td>
                                        <td>{item.quantity} kg</td>
                                        <td className="item-total">₹{item.totalPrice?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Billing Summary */}
                    <div className="billing-summary">
                        <div className="summary-row">
                            <span className="label">Subtotal ({order.items?.length} items):</span>
                            <span className="value">₹{order.totalAmount?.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span className="label">Delivery Charges:</span>
                            <span className="value free">FREE</span>
                        </div>
                        <div className="summary-row total-row">
                            <span className="label">Total Amount:</span>
                            <span className="value">₹{order.totalAmount?.toFixed(2)}</span>
                        </div>
                        <div className="summary-row payable-row">
                            <span className="label">Amount Payable:</span>
                            <span className="value">₹{order.payment?.payableAmount?.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="invoice-footer">
                        <p className="thank-you">Thank you for shopping with GreenCart! 🌿</p>
                        <p className="note">For any queries, please contact our support team.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default OrderDetails;
