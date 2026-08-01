import api from "./api";

/**
 * Get all available products from Order Service
 * Endpoint: GET /api/products/available (via API Gateway)
 */
export const getAllAvailableProducts = async () => {
    try {
        const response = await api.get("/api/products/available");
        return response.data;
    } catch (error) {
        console.error("Error fetching available products:", error);
        throw error;
    }
};

/**
 * Add item to cart
 * POST /api/cart/add
 */
export const addToCart = async (buyerId, stockId, quantity) => {
    try {
        const response = await api.post("/api/cart/add", {
            buyerId,
            stockId,
            quantity
        });
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
};

/**
 * Get buyer's cart
 * GET /api/cart/{buyerId}
 */
export const getCart = async (buyerId) => {
    try {
        const response = await api.get(`/api/cart/${buyerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
    }
};

/**
 * Update cart item quantity
 * PUT /api/cart/item/{cartItemId}
 */
export const updateCartItem = async (cartItemId, quantity) => {
    try {
        const response = await api.put(`/api/cart/item/${cartItemId}`, {
            quantity
        });
        return response.data;
    } catch (error) {
        console.error("Error updating cart item:", error);
        throw error;
    }
};

/**
 * Remove item from cart
 * DELETE /api/cart/item/{cartItemId}
 */
export const removeCartItem = async (cartItemId) => {
    try {
        const response = await api.delete(`/api/cart/item/${cartItemId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing cart item:", error);
        throw error;
    }
};

/**
 * Clear cart
 * DELETE /api/cart/{buyerId}/clear
 */
export const clearCart = async (buyerId) => {
    try {
        const response = await api.delete(`/api/cart/${buyerId}/clear`);
        return response.data;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
};

/**
 * Checkout - Create order from cart
 * POST /api/cart/{buyerId}/checkout
 */
export const checkoutCart = async (buyerId) => {
    try {
        const response = await api.post(`/api/cart/${buyerId}/checkout`);
        return response.data;
    } catch (error) {
        console.error("Error during checkout:", error);
        throw error;
    }
};

/**
 * Place order from cart
 * POST /api/orders/place
 */
export const placeOrder = async (buyerId, paymentMethod) => {
    try {
        const response = await api.post("/api/orders/place", {
            buyerId,
            paymentMethod
        });
        return response.data;
    } catch (error) {
        console.error("Error placing order:", error);
        throw error;
    }
};

/**
 * Get all orders for a buyer
 * GET /api/orders/buyer/{buyerId}
 */
export const getOrders = async (buyerId) => {
    try {
        const response = await api.get(`/api/orders/buyer/${buyerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

/**
 * Get order details by ID
 * GET /api/orders/{orderId}
 */
export const getOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/api/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
};

