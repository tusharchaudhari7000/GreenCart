import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaStore, FaTractor, FaShieldAlt, FaTruck, FaLeaf, FaArrowRight, FaStar, FaUserCheck } from "react-icons/fa";
import "./LandingPage.css";

function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useSelector((state) => state.auth);

    const handleGetStarted = () => {
        if (isAuthenticated && role) {
            switch (role) {
                case "BUYER":
                    navigate("/buyer/home");
                    break;
                case "FARMER":
                    navigate("/farmer");
                    break;
                case "ADMIN":
                    navigate("/admin");
                    break;
                default:
                    navigate("/login");
            }
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="landing-page">
            {/* 🌟 HERO SECTION */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-badge">
                        <FaLeaf className="leaf-icon" /> <span>Direct Farm-to-Fork Ecosystem</span>
                    </div>

                    <h1 className="hero-title">
                        Fresh Farm Produce, Delivered <span className="highlight-text">Directly to You</span>
                    </h1>

                    <p className="hero-subtitle">
                        GreenCart connects local farmers directly with household buyers. No middlemen, no extra markups—just 100% fresh, chemical-free organic produce delivered straight from the field.
                    </p>

                    <div className="hero-cta-buttons">
                        <button onClick={handleGetStarted} className="btn-hero-primary">
                            <FaStore /> {isAuthenticated ? "Go to Dashboard" : "Explore Marketplace"} <FaArrowRight className="arrow-icon" />
                        </button>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn-hero-secondary">
                                <FaTractor /> Register as Farmer
                            </Link>
                        )}
                    </div>

                    {/* Trust Indicators */}
                    <div className="hero-trust-bar">
                        <div className="trust-item"><FaUserCheck /> Verified Farmers</div>
                        <div className="trust-item"><FaShieldAlt /> 100% Quality Guaranteed</div>
                        <div className="trust-item"><FaTruck /> Fast Local Delivery</div>
                    </div>
                </div>
            </section>

            {/* 🍎 CATEGORY HIGHLIGHT CAROUSEL/GRID */}
            <section className="categories-preview-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Explore Fresh Categories</h2>
                        <p>Sourced directly from verified local agricultural partners</p>
                    </div>

                    <div className="category-cards-grid">
                        <div className="cat-card">
                            <div className="cat-img-wrapper">
                                <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80" alt="Fresh Vegetables" />
                            </div>
                            <div className="cat-card-body">
                                <h3>🥬 Organic Vegetables</h3>
                                <p>Tomatoes, Potatoes, Carrots, Spinach & more harvested daily.</p>
                                <span className="cat-link" onClick={handleGetStarted}>Browse Produce &rarr;</span>
                            </div>
                        </div>

                        <div className="cat-card">
                            <div className="cat-img-wrapper">
                                <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80" alt="Fresh Fruits" />
                            </div>
                            <div className="cat-card-body">
                                <h3>🍎 Orchard Fruits</h3>
                                <p>Crisp Himachali Apples, Sweet Grapes, Bananas & Mangoes.</p>
                                <span className="cat-link" onClick={handleGetStarted}>Browse Fruits &rarr;</span>
                            </div>
                        </div>

                        <div className="cat-card">
                            <div className="cat-img-wrapper">
                                <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80" alt="Dairy Products" />
                            </div>
                            <div className="cat-card-body">
                                <h3>🥛 Fresh Dairy</h3>
                                <p>Pure unadulterated farm cow milk, fresh butter & paneer.</p>
                                <span className="cat-link" onClick={handleGetStarted}>Browse Dairy &rarr;</span>
                            </div>
                        </div>

                        <div className="cat-card">
                            <div className="cat-img-wrapper">
                                <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80" alt="Grains & Pulses" />
                            </div>
                            <div className="cat-card-body">
                                <h3>🌾 Grains & Pulses</h3>
                                <p>Naturally grown wheat, organic rice & whole pulses.</p>
                                <span className="cat-link" onClick={handleGetStarted}>Browse Grains &rarr;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ⚡ FEATURES SECTION */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Why Choose GreenCart?</h2>
                        <p>A transparent agricultural marketplace built for farmers & buyers</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-box">
                            <div className="icon-wrapper green-icon"><FaTractor /></div>
                            <h3>Direct Farmer Earnings</h3>
                            <p>Eliminates middlemen fees so local farmers earn 100% of fair market value for their hard work.</p>
                        </div>

                        <div className="feature-box">
                            <div className="icon-wrapper emerald-icon"><FaShieldAlt /></div>
                            <h3>Traceable Produce</h3>
                            <p>Every product displays seller details, exact stock quantities, origin description, and price transparency.</p>
                        </div>

                        <div className="feature-box">
                            <div className="icon-wrapper teal-icon"><FaTruck /></div>
                            <h3>Direct Supply Chain</h3>
                            <p>Streamlined logistics ensure vegetables and fruits reach consumers within hours of harvesting.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 📊 STATS BANNER */}
            <section className="stats-banner">
                <div className="stats-container">
                    <div className="stat-card">
                        <h3>500+</h3>
                        <p>Verified Farmers</p>
                    </div>
                    <div className="stat-card">
                        <h3>10,000+</h3>
                        <p>Happy Households</p>
                    </div>
                    <div className="stat-card">
                        <h3>100%</h3>
                        <p>Fresh & Organic</p>
                    </div>
                    <div className="stat-card">
                        <h3>4.9 <FaStar style={{ color: '#ffb300', fontSize: '1.2rem', verticalAlign: 'middle' }} /></h3>
                        <p>Customer Rating</p>
                    </div>
                </div>
            </section>

            {/* 👥 ROLE CARDS SECTION */}
            <section className="role-cta-section">
                <div className="section-container">
                    <div className="role-grid">
                        <div className="role-card buyer-role">
                            <div className="role-badge">For Buyers</div>
                            <h2>Shop Fresh & Support Local Farmers</h2>
                            <p>Access organic vegetables, fruits, dairy, and grains at fair prices directly from producers.</p>
                            <button onClick={() => navigate("/login")} className="btn-role buyer-btn">
                                Start Shopping <FaArrowRight />
                            </button>
                        </div>

                        <div className="role-card farmer-role">
                            <div className="role-badge farmer-badge">For Farmers</div>
                            <h2>Sell Your Harvest Directly Online</h2>
                            <p>Create your farmer account, list your crop produce, set your own prices, and receive direct orders.</p>
                            <button onClick={() => navigate("/register")} className="btn-role farmer-btn">
                                Join as a Farmer <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* <footer> */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h3>🌱 GreenCart</h3>
                        <p>Empowering local farmers and bringing fresh, organic produce straight to your home.</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-col">
                            <h4>Quick Links</h4>
                            <Link to="/">Home</Link>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </div>

                        <div className="footer-col">
                            <h4>Portals</h4>
                            <Link to="/login">Buyer Portal</Link>
                            <Link to="/register">Farmer Portal</Link>
                            <Link to="/login">Admin Portal</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} GreenCart Marketplace. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
