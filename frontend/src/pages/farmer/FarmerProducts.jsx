import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  addProduct,
  getProducts,
  deleteProduct,
  getCategories,
  getSubcategories
} from "../../services/farmerService";
import "./FarmerProducts.css";

function FarmerProducts() {
  const [products, setProducts] = useState([]);

  // Category
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  // Product fields
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  // Image
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    getProducts().then(res => setProducts(res.data));
  };

  const loadCategories = () => {
    getCategories().then(res => setCategories(res.data));
  };

  const handleCategoryChange = (e) => {
    const id = e.target.value;
    setCategoryId(id);
    setSubcategoryId("");
    setSubcategories([]);

    if (id) {
      getSubcategories(id).then(res => setSubcategories(res.data));
    }
  };

  const getSubcategoryName = () =>
    subcategories.find(sc => sc.id === Number(subcategoryId))?.name || "";

  /* ---------------- Image Upload (Cloudinary) ---------------- */
  const uploadImages = async () => {
    if (!images.length) {
      toast.error("Please select images");
      return;
    }

    setUploading(true);
    const uploaded = [];

    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "greencart_products");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dsazooxny/image/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    setImageUrls(uploaded);
    setUploading(false);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    // Validations
    if (!subcategoryId) return toast.error("Select subcategory");

    if (!description.trim()) {
      return toast.error("Enter product description");
    }

    if (description.trim().length < 10) {
      return toast.error("Description must be at least 10 characters long");
    }

    if (description.trim().length > 500) {
      return toast.error("Description must not exceed 500 characters");
    }

    if (!price || parseFloat(price) <= 0) {
      return toast.error("Enter a valid price greater than 0");
    }

    if (!quantity || parseInt(quantity) < 0) {
      return toast.error("Enter a valid quantity (0 or more)");
    }

    if (!imageUrls.length) {
      return toast.error("Upload product image");
    }

    const payload = {
      subCategoryId: parseInt(subcategoryId),
      description: description.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imageUrl: imageUrls[0] // Send first image URL
    };

    console.log("Sending payload:", payload);

    addProduct(payload).then(() => {
      setPrice("");
      setQuantity("");
      setDescription("");
      setCategoryId("");
      setSubcategoryId("");
      setSubcategories([]);
      setImages([]);
      setImageUrls([]);
      loadProducts();
      alert("Product added successfully!");
    }).catch(err => {
      console.error("Error adding product:", err);
      console.error("Error response:", err.response?.data);

      // Show specific error message from backend
      const errorMessage = err.response?.data?.message || err.response?.data || "Failed to add product. Please try again.";
      toast.error(errorMessage);
    });
  };

  return (
    <div className="farmer-container">
      <h2 className="page-title">My Products</h2>

      {/* ---------- Add Product ---------- */}
      <div className="card">
        <h3>Add Product</h3>

        <form className="product-form" onSubmit={handleAdd}>
          <div className="form-row">
            <select value={categoryId} onChange={handleCategoryChange} required>
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={subcategoryId}
              onChange={e => setSubcategoryId(e.target.value)}
              disabled={!subcategories.length}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map(sc => (
                <option key={sc.id} value={sc.id}>{sc.name}</option>
              ))}
            </select>
          </div>

          {subcategoryId && (
            <div className="auto-name">
              Product Name: <span>{getSubcategoryName()}</span>
            </div>
          )}

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              📝 Product Description
            </label>
            <textarea
              id="description"
              className="description-input"
              placeholder="Describe your product quality, origin, farming method, etc..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="4"
              required
              minLength="10"
              maxLength="500"
            />
            <small className="helper-text">
              Provide details that help buyers understand your product better (10-500 characters)
            </small>
          </div>

          <div className="form-row">
            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={e => setPrice(e.target.value)}
              step="0.01"
              min="0.01"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min="0"
              required
            />
          </div>

          <div className="form-row">
            <input
              type="file"
              accept="image/*"
              onChange={e => setImages([...e.target.files])}
            />

            <button
              type="button"
              className="btn secondary"
              onClick={uploadImages}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {imageUrls.length > 0 && (
            <div className="image-preview">
              {imageUrls.map((url, i) => (
                <img key={i} src={url} alt="preview" />
              ))}
            </div>
          )}

          <button className="btn primary">Add Product</button>
        </form>
      </div>

      {/* ---------- Product List ---------- */}
      <div className="card">
        <h3>My Products</h3>

        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Description</th>
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
                  <td>{p.pname}</td>
                  <td>{p.categoryName}</td>
                  <td>₹ {p.price}</td>
                  <td>{p.quantity}</td>
                  <td className="description-cell">{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FarmerProducts;
