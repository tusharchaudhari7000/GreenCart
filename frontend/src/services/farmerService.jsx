import farmerApi, { farmerOrderApi } from "../api/farmerApi";

/* -----------------------------
   CATEGORY APIs
------------------------------ */

export const getCategories = () =>
  farmerApi.get("/api/categories").then(res => ({
    data: res.data.map(cat => ({
      id: cat.categoryId,
      name: cat.categoryName
    }))
  }));

export const getSubcategories = (categoryId) =>
  farmerApi.get(`/api/subcategories/category/${categoryId}`).then(res => ({
    data: res.data.map(sub => ({
      id: sub.subCategoryId,
      name: sub.subCategoryName
    }))
  }));

/* -----------------------------
   PRODUCT APIs
------------------------------ */

export const getProducts = () =>
  farmerApi.get("/api/products/seller")
    .then(res => {
      // Check if backend returned an error object (Spring Boot error response)
      if (res.data && typeof res.data === 'object' && res.data.error) {
        console.error("Backend returned error object:", res.data);
        return { data: [] };
      }
      // Ensure we always return an array
      return { data: Array.isArray(res.data) ? res.data : [] };
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      // Return empty array if no products found (404) or unauthorized (401)
      if (err.response?.status === 404 || err.response?.status === 401) {
        return { data: [] };
      }
      throw err;
    });

export const addProduct = (productData) =>
  farmerApi.post("/api/products/create", {
    subCategoryId: productData.subCategoryId,
    description: productData.description,
    price: parseFloat(productData.price),
    quantity: parseInt(productData.quantity),
    imageUrl: productData.imageUrl
  });

export const updateProduct = (productId, productData) =>
  farmerApi.put(`/api/products/update/${productId}`, {
    subCategoryId: productData.subCategoryId,
    description: productData.description,
    price: parseFloat(productData.price),
    quantity: parseInt(productData.quantity),
    imageUrl: productData.imageUrl
  });

export const deleteProduct = (id) =>
  farmerApi.delete(`/api/products/${id}`);

/* -----------------------------
   ORDER APIs
------------------------------ */

export const getFarmerOrders = (sellerId) =>
  farmerOrderApi.get(`/api/farmer/orders/seller/${sellerId}`)
    .then(res => ({ data: res.data }))
    .catch(err => {
      console.error("Error fetching farmer orders:", err);
      // Return empty array if endpoint not implemented yet
      if (err.response?.status === 404 || err.response?.status === 401) {
        return { data: [] };
      }
      throw err;
    });

export const updatePaymentStatus = (paymentId, status) =>
  farmerOrderApi.patch(`/api/farmer/orders/payment/${paymentId}/status`, {
    paymentStatus: status
  });
