import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    addProduct,
    updateProduct,
    getCategories,
    getSubcategories
} from "../../services/farmerService";
import "./FarmerProducts.css";

function AddProduct({ productToEdit, onBackToProducts }) {
    const isEditMode = !!productToEdit;

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
        loadCategories();

        // If editing, populate form with existing data
        if (productToEdit) {
            setDescription(productToEdit.description);
            setPrice(productToEdit.price.toString());
            setQuantity(productToEdit.quantity.toString());
            setSubcategoryId(productToEdit.subCategoryId.toString());
            setCategoryId(productToEdit.categoryId.toString());
            setImageUrls([productToEdit.imagePath]);

            // Load subcategories for the category
            getSubcategories(productToEdit.categoryId).then(res => setSubcategories(res.data));
        }
    }, [productToEdit]);

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

        try {
            for (const image of images) {
                console.log("Uploading image:", image.name);

                const formData = new FormData();
                formData.append("file", image);
                formData.append("upload_preset", "greencart_products"); // Using default unsigned preset

                const res = await fetch(
                    "https://api.cloudinary.com/v1_1/dsazooxny/image/upload",
                    { method: "POST", body: formData }
                );

                const data = await res.json();

                if (!res.ok) {
                    console.error("Cloudinary error:", data);
                    throw new Error(data.error?.message || "Upload failed");
                }

                console.log("Upload successful:", data.secure_url);
                uploaded.push(data.secure_url);
            }

            setImageUrls(uploaded);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Image upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
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

        const imageToUse = (imageUrls && imageUrls.length > 0 && imageUrls[0])
            ? imageUrls[0]
            : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80";

        const payload = {
            subCategoryId: parseInt(subcategoryId),
            description: description.trim(),
            price: parseFloat(price),
            quantity: parseInt(quantity),
            imageUrl: imageToUse
        };

        console.log("Sending payload:", payload);

        const apiCall = isEditMode
            ? updateProduct(productToEdit.pid, payload)
            : addProduct(payload);

        apiCall.then(() => {
            toast.success(isEditMode ? "Product updated successfully!" : "Product added successfully!");
            onBackToProducts();
        }).catch(err => {
            console.error("Error saving product:", err);
            console.error("Error response:", err.response?.data);

            const errorMessage = err.response?.data?.message || err.response?.data || "Failed to save product. Please try again.";
            toast.error(errorMessage);
        });
    };

    return (
        <div className="farmer-container">
            <h2 className="page-title">{isEditMode ? "✏️ Edit Product" : "➕ Add New Product"}</h2>

            <div className="card">
                <form className="product-form" onSubmit={handleSubmit}>
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

                    <div className="form-row">
                        <button type="submit" className="btn primary">
                            {isEditMode ? "Update Product" : "Add Product"}
                        </button>
                        <button
                            type="button"
                            className="btn secondary"
                            onClick={onBackToProducts}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
