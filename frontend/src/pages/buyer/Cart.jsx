import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logout } from "../../redux/authSlice";
import { setCart, updateCartItemSuccess, removeCartItemSuccess, clearCartSuccess, setLoading } from "../../redux/cartSlice";
import { getCart, updateCartItem, removeCartItem, clearCart, placeOrder } from "../../api/buyerApi";
import "./Cart.css";
import "../SharedSidebar.css";

function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { items, totalAmount, itemCount, loading } = useSelector((state) => state.cart);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const fetchCart = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const cartData = await getCart(user.userId);
            dispatch(setCart(cartData));
        } catch (err) {
            toast.error("Failed to load cart");
        }
    }, [user?.userId, dispatch]);

    useEffect(() => {
        if (user?.userId) {
            fetchCart();
        }
    }, [user?.userId, fetchCart]);

    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity <= 0) return;

        try {
            const updatedItem = await updateCartItem(cartItemId, newQuantity);
            dispatch(updateCartItemSuccess(updatedItem));
            toast.success("Quantity updated");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update quantity");
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            dispatch(removeCartItemSuccess(cartItemId));
            toast.success("Item removed from cart");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your cart?")) return;

        try {
            await clearCart(user.userId);
            dispatch(clearCartSuccess());
            toast.success("Cart cleared");
        } catch (err) {
            toast.error("Failed to clear cart");
        }
    };

    const handlePlaceOrder = async () => {
        if (items.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        if (!window.confirm(`Place order with ${paymentMethod} payment?`)) return;

        try {
            dispatch(setLoading(true));
            const order = await placeOrder(user.userId, paymentMethod);
            dispatch(clearCartSuccess());
            toast.success(`Order placed successfully! Bill Number: ${order.payment.billNumber}`);
            setTimeout(() => navigate(`/buyer/orders/${order.orderId}`), 2000);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to place order");
        }
    };



    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
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

                    <div className="nav-item active">
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

                    <div className="nav-item" onClick={() => navigate("/buyer/orders")}>
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
                        <h3>🛒 My Cart</h3>
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
                            <p>Loading cart...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="empty-cart">
                            <span className="empty-icon">🛒</span>
                            <h2>Your cart is empty</h2>
                            <p>Add some fresh products to get started!</p>
                            <button onClick={() => navigate("/buyer/home")} className="shop-now-btn">
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="cart-content">
                            <div className="cart-items">
                                {items.map((item) => (
                                    <div key={item.cartItemId} className="cart-item">
                                        <div className="item-image">
                                            {item.imagePath ? (
                                                <img src={item.imagePath} alt={item.productName} />
                                            ) : (
                                                <div className="image-placeholder">
                                                    <span>🌾</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="item-details">
                                            <h3>{item.productName}</h3>
                                            <div className="item-category">
                                                <span className="category">{item.categoryName}</span>
                                                {item.subCategoryName && (
                                                    <span className="subcategory">{item.subCategoryName}</span>
                                                )}
                                            </div>
                                            <div className="item-price">
                                                ₹{item.unitPrice.toFixed(2)} per kg
                                            </div>
                                        </div>

                                        <div className="item-quantity">
                                            <label>Quantity (kg)</label>
                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 0.5)}
                                                    disabled={item.quantity <= 0.5}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(item.cartItemId, parseFloat(e.target.value))}
                                                    min="0.5"
                                                    step="0.5"
                                                />
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 0.5)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="item-total">
                                            <span className="total-label">Total</span>
                                            <span className="total-price">₹{item.totalPrice.toFixed(2)}</span>
                                        </div>

                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveItem(item.cartItemId)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <h2>Order Summary</h2>
                                <div className="summary-row">
                                    <span>Items ({itemCount})</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Amount</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>

                                <div className="payment-method">
                                    <label>Payment Method</label>
                                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                        <option value="COD">Cash on Delivery (COD)</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CARD">Card</option>
                                        <option value="NET_BANKING">Net Banking</option>
                                    </select>
                                </div>

                                <button className="checkout-btn" onClick={handlePlaceOrder}>
                                    Place Order
                                </button>
                                <button className="clear-cart-btn" onClick={handleClearCart}>
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Cart;
