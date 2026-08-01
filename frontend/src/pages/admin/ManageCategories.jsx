import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import adminService from "../../services/adminService";

function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("categories");
    const [newCategory, setNewCategory] = useState("");
    const [newSubCategory, setNewSubCategory] = useState({ name: "", categoryId: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catData, subCatData] = await Promise.all([
                adminService.getCategories(),
                adminService.getSubCategories()
            ]);
            setCategories(catData);
            setSubcategories(subCatData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        try {
            await adminService.saveCategory({ categoryName: newCategory });
            setNewCategory("");
            fetchData();
        } catch (error) {
            toast.error("Failed to add category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                const result = await adminService.deleteCategory(id);
                if (result.status === 'INACTIVE') {
                    toast.success(result.message || "Category deactivated");
                } else {
                    toast.success(result.message || "Category deleted");
                }
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete category");
            }
        }
    };

    const handleToggleCategoryStatus = async (id) => {
        try {
            await adminService.toggleCategoryStatus(id);
            toast.success("Category status updated");
            fetchData();
        } catch (error) {
            toast.error("Failed to update category status");
        }
    };

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        if (!newSubCategory.name.trim() || !newSubCategory.categoryId) return;
        try {
            await adminService.saveSubCategory({
                subCategoryName: newSubCategory.name,
                category: { categoryId: parseInt(newSubCategory.categoryId) },
                status: "ACTIVE"
            });
            setNewSubCategory({ name: "", categoryId: "" });
            fetchData();
        } catch (error) {
            toast.error("Failed to add subcategory");
        }
    };

    const handleDeleteSubCategory = async (id) => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            try {
                const result = await adminService.deleteSubCategory(id);
                if (result.status === 'INACTIVE') {
                    toast.success(result.message || "Subcategory deactivated");
                } else {
                    toast.success(result.message || "Subcategory deleted");
                }
                fetchData();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete subcategory");
            }
        }
    };

    const handleToggleSubCategoryStatus = async (id) => {
        try {
            await adminService.toggleSubCategoryStatus(id);
            toast.success("Subcategory status updated");
            fetchData();
        } catch (error) {
            toast.error("Failed to update subcategory status");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-categories-section">
            <div className="section-header">
                <h2>🛠️ Manage Catalog</h2>
                <div className="tab-navigation" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                        className={`admin-btn ${activeTab === "categories" ? "admin-btn-primary" : "admin-btn-outline"}`}
                        onClick={() => setActiveTab("categories")}
                    >
                        Categories
                    </button>
                    <button
                        className={`admin-btn ${activeTab === "subcategories" ? "admin-btn-primary" : "admin-btn-outline"}`}
                        onClick={() => setActiveTab("subcategories")}
                    >
                        Subcategories
                    </button>
                </div>
            </div>

            <div className="admin-content-card" style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", marginTop: "1.5rem" }}>
                {activeTab === "categories" ? (
                    <div>
                        <h3>Categories List</h3>
                        <form onSubmit={handleAddCategory} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            <input
                                type="text"
                                placeholder="New Category Name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }}
                            />
                            <button type="submit" className="admin-btn admin-btn-primary">Add</button>
                        </form>

                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.categoryId}>
                                        <td>{cat.categoryId}</td>
                                        <td>{cat.categoryName}</td>
                                        <td>
                                            <span className={`status-badge ${cat.status === 'INACTIVE' ? 'suspended' : 'approved'}`}>
                                                {cat.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className={`admin-btn ${cat.status === 'INACTIVE' ? 'admin-btn-success' : 'admin-btn-warning'}`}
                                                onClick={() => handleToggleCategoryStatus(cat.categoryId)}
                                            >
                                                {cat.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-danger"
                                                onClick={() => handleDeleteCategory(cat.categoryId)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div>
                        <h3>Subcategories List</h3>
                        <form onSubmit={handleAddSubCategory} style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
                            <input
                                type="text"
                                placeholder="New Subcategory Name"
                                value={newSubCategory.name}
                                onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })}
                                style={{ flex: 2, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }}
                            />
                            <select
                                value={newSubCategory.categoryId}
                                onChange={(e) => setNewSubCategory({ ...newSubCategory, categoryId: e.target.value })}
                                style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                ))}
                            </select>
                            <button type="submit" className="admin-btn admin-btn-primary">Add</button>
                        </form>

                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Parent Category</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map(sub => (
                                    <tr key={sub.subCategoryId}>
                                        <td>{sub.subCategoryId}</td>
                                        <td>{sub.subCategoryName}</td>
                                        <td>{sub.category?.categoryName || "N/A"}</td>
                                        <td><span className="status-badge approved">{sub.status || 'ACTIVE'}</span></td>
                                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className={`admin-btn ${sub.status === 'INACTIVE' ? 'admin-btn-success' : 'admin-btn-warning'}`}
                                                onClick={() => handleToggleSubCategoryStatus(sub.subCategoryId)}
                                            >
                                                {sub.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-danger"
                                                onClick={() => handleDeleteSubCategory(sub.subCategoryId)}
                                            >
                                                Delete
                                            </button>
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

export default ManageCategories;
