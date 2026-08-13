import api from "../utils/axiosConfig";

// All requests now go through API Gateway at http://localhost:8080
// Gateway route: /api/admin/** → Admin Service (5026)

const adminService = {
    getFarmers: async () => {
        const response = await api.get("/api/admin/farmers");
        return response.data;
    },

    getBuyers: async () => {
        const response = await api.get("/api/admin/buyers");
        return response.data;
    },

    approveFarmer: async (id) => {
        const response = await api.post(`/api/admin/farmers/${id}/approve`);
        return response.data;
    },

    suspendUser: async (id) => {
        const response = await api.post(`/api/admin/users/${id}/suspend`);
        return response.data;
    },

    getProducts: async () => {
        const response = await api.get("/api/admin/products");
        return response.data;
    },

    toggleStockVisibility: async (id) => {
        const response = await api.post(`/api/admin/products/stock/${id}/toggle-visibility`);
        return response.data;
    },

    deleteStockItem: async (id) => {
        await api.delete(`/api/admin/products/stock/${id}`);
    },

    getOrders: async () => {
        const response = await api.get("/api/admin/orders");
        return response.data;
    },

    // --- Category Management ---
    getCategories: async () => {
        const response = await api.get("/api/admin/categories");
        return response.data;
    },
    saveCategory: async (category) => {
        const response = await api.post("/api/admin/categories", category);
        return response.data;
    },
    deleteCategory: async (id) => {
        const response = await api.delete(`/api/admin/categories/${id}`);
        return response.data;
    },
    toggleCategoryStatus: async (id) => {
        const response = await api.post(`/api/admin/categories/${id}/toggle-status`);
        return response.data;
    },

    // --- SubCategory Management ---
    getSubCategories: async () => {
        const response = await api.get("/api/admin/subcategories");
        return response.data;
    },
    saveSubCategory: async (subcategory) => {
        const response = await api.post("/api/admin/subcategories", subcategory);
        return response.data;
    },
    deleteSubCategory: async (id) => {
        const response = await api.delete(`/api/admin/subcategories/${id}`);
        return response.data;
    },
    toggleSubCategoryStatus: async (id) => {
        const response = await api.post(`/api/admin/subcategories/${id}/toggle-status`);
        return response.data;
    },
};

export default adminService;
