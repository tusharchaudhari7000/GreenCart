import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { logout } from "../../redux/authSlice";
import { setCart, addToCartSuccess, setLoading } from "../../redux/cartSlice";
import { getAllAvailableProducts, addToCart as addToCartAPI, getCart } from "../../api/buyerApi";
import "./BuyerHome.css";
import "../SharedSidebar.css";

function BuyerHome() {
    const [products, setProducts] = useState([]);
    const [loading, setLoadingProducts] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [quantities, setQuantities] = useState({});

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);

    const fetchProducts = useCallback(async () => {
        try {
            setLoadingProducts(true);
            const data = await getAllAvailableProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError("Failed to load products. Please try again later.");
            console.error("Error fetching products:", err);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    const fetchCart = useCallback(async () => {
        try {
            const cartData = await getCart(user.userId);
            dispatch(setCart(cartData));
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    }, [user?.userId, dispatch]);

    useEffect(() => {
        fetchProducts();
        if (user?.userId) {
            fetchCart();
        }
    }, [user?.userId, fetchProducts, fetchCart]);

    const handleAddToCart = async (stockId) => {
        if (!user?.userId) {
            toast.error("Please login to add items to cart");
            return;
        }

        const quantity = quantities[stockId] || 1;

        try {
            dispatch(setLoading(true));
            const cartData = await addToCartAPI(user.userId, stockId, quantity);
            dispatch(addToCartSuccess(cartData));
            toast.success(`Added ${quantity} kg to cart!`);
            setQuantities({ ...quantities, [stockId]: 1 });
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to add to cart");
        }
    };

    const handleQuantityChange = (stockId, value) => {
        const numValue = parseFloat(value);
        if (numValue > 0) {
            setQuantities({ ...quantities, [stockId]: numValue });
        }
    };



    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    // Filter products
    const categories = ["All", ...new Set(products.map(p => p.categoryName).filter(Boolean))];
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.categoryName === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                    <div className="nav-item active">
                        <span>🏪</span> <span>Marketplace</span>
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
                    <h3>Explore Fresh Produce</h3>
                    <div className="user-profile">
                        <span style={{ fontWeight: 600, color: '#2e7d32' }}>
                            Welcome, {user?.firstName || 'Buyer'}
                        </span>
                    </div>
                </header>

                <main className="buyer-main">
                    <div className="welcome-section">
                        <h2>GreenCart Marketplace</h2>
                        <p>Fresh farm products delivered directly from producers to your home</p>
                    </div>

                    {/* Search and Filter */}
                    <div className="controls">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search fresh vegetables, fruits and more..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="category-filter">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                            <p>Harvesting fresh data...</p>
                        </div>
                    ) : error ? (
                        <div className="error">
                            <span className="error-icon">⚠️</span>
                            <p>{error}</p>
                            <button onClick={fetchProducts} className="retry-btn">Try Again</button>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <div key={product.stockId} className="product-card">
                                    <div className="product-image">
                                        <span className="placeholder-icon">🌾</span>
                                        {product.imagePath && (
                                            <img
                                                src={product.imagePath}
                                                alt={product.productName}
                                                style={{ position: 'absolute', top: 0, left: 0 }}
                                            />
                                        )}
                                    </div>

                                    <div className="product-info">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 className="product-name">{product.productName}</h3>
                                            <span className="category-badge">{product.categoryName}</span>
                                        </div>

                                        <p className="product-description">{product.description || "Freshly sourced from our verified farmers."}</p>

                                        <div className="product-details">
                                            <div className="price-section">
                                                <span className="price">₹{product.price}</span>
                                                <span className="price-unit">per kg</span>
                                            </div>
                                            <div className="stock-section" style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.85rem', color: '#888', display: 'block' }}>In Stock</span>
                                                <span style={{ fontWeight: 700, color: '#1b5e20' }}>{product.quantity} kg</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ flex: '0 0 100px' }}>
                                                <input
                                                    type="number"
                                                    min="0.5"
                                                    step="0.5"
                                                    value={quantities[product.stockId] || 1}
                                                    onChange={(e) => handleQuantityChange(product.stockId, e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        borderRadius: '12px',
                                                        border: '2px solid #eef2f3',
                                                        textAlign: 'center',
                                                        fontWeight: 700
                                                    }}
                                                />
                                            </div>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product.stockId)}
                                            >
                                                🛒 Add to Cart
                                            </button>
                                        </div>
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

export default BuyerHome;
