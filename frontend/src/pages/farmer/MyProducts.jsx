import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getProducts, deleteProduct } from "../../services/farmerService";
import "./FarmerProducts.css";

function MyProducts({ onAddProductClick, onEditProduct }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        setLoading(true);
        getProducts()
            .then(res => {
                console.log("Products response:", res);
                // Ensure we always set an array - check multiple levels
                let productData = [];
                if (res && res.data) {
                    if (Array.isArray(res.data)) {
                        productData = res.data;
                    } else if (typeof res.data === 'object' && res.data.error) {
                        // Backend returned an error object
                        console.error("Backend error:", res.data);
                        productData = [];
                    }
                }
                setProducts(productData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading products:", err);
                setProducts([]);
                setLoading(false);
            });
    };

    const handleDelete = (productId) => {
        if (window.confirm("Are you sure you want to delete this product? This will permanently remove it.")) {
            deleteProduct(productId)
                .then(() => {
                    setProducts(products.filter(p => p.pid !== productId));
                    toast.success("Product deleted successfully");
                })
                .catch(err => {
                    console.error("Error deleting product:", err);
                    toast.error("Failed to delete product. " + (err.response?.data?.message || err.message));
                });
        }
    };

    return (
        <div className="farmer-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 className="page-title" style={{ margin: 0 }}>📦 My Products</h2>
                <button
                    onClick={onAddProductClick}
                    style={{
                        padding: '12px 24px',
                        background: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#1b5e20'}
                    onMouseOut={(e) => e.target.style.background = '#2e7d32'}
                >
                    ➕ Add New Product
                </button>
            </div>

            <div className="card">
                {loading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>Loading products...</p>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#666', marginBottom: '10px' }}>
                            No products yet
                        </p>
                        <p style={{ color: '#999' }}>
                            Click on "Add New Product" button above to create your first product listing
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="product-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Subcategory</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Description</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.pid}>
                                        <td>
                                            <img
                                                src={p.imagePath}
                                                alt={p.pname}
                                                className="table-img"
                                            />
                                        </td>
                                        <td><strong>{p.pname}</strong></td>
                                        <td>{p.categoryName}</td>
                                        <td>{p.subCategoryName}</td>
                                        <td>₹ {p.price.toFixed(2)}</td>
                                        <td>{p.quantity}</td>
                                        <td className="description-cell" title={p.description}>
                                            {p.description}
                                        </td>
                                        <td>
                                            {new Date(p.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => onEditProduct(p)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '20px'
                                                    }}
                                                    title="Edit Product"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.pid)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '20px'
                                                    }}
                                                    title="Delete Product"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyProducts;
