import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalAmount: 0,
    itemCount: 0,
    loading: false,
    error: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items || [];
            state.totalAmount = action.payload.totalAmount || 0;
            state.itemCount = action.payload.itemCount || 0;
            state.loading = false;
            state.error = null;
        },
        addToCartSuccess: (state, action) => {
            state.items = action.payload.items || [];
            state.totalAmount = action.payload.totalAmount || 0;
            state.itemCount = action.payload.itemCount || 0;
            state.loading = false;
            state.error = null;
        },
        updateCartItemSuccess: (state, action) => {
            const updatedItem = action.payload;
            const index = state.items.findIndex(item => item.cartItemId === updatedItem.cartItemId);
            if (index !== -1) {
                state.items[index] = updatedItem;
                state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
            }
            state.loading = false;
        },
        removeCartItemSuccess: (state, action) => {
            const cartItemId = action.payload;
            state.items = state.items.filter(item => item.cartItemId !== cartItemId);
            state.itemCount = state.items.length;
            state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
            state.loading = false;
        },
        clearCartSuccess: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.itemCount = 0;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {
    setCart,
    addToCartSuccess,
    updateCartItemSuccess,
    removeCartItemSuccess,
    clearCartSuccess,
    setLoading,
    setError
} = cartSlice.actions;

export default cartSlice.reducer;
