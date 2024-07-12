import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: {},
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        increaseProductQuantity: (state, action) => {
            const product = action.payload.product;

            if (state.products[product.productoId]) {
                state.products[product.productoId].quantity++;
            } else {
                state.products[product.productoId] = {
                    quantity: 1,
                    data: product,
                }
            }
        },
        decreaseProductQuantity: (state, action) => {
            const product = action.payload.product;

            if (state.products[product.productoId]) {
                if (state.products[product.productoId].quantity > 1) {
                    state.products[product.productoId].quantity--;
                } else {
                    delete state.products[product.productoId];
                }
            }
        },
        removeProductFromCart: (state, action) => {
            const productId = action.payload.productId;
            delete state.products[productId];
        },
        updateProductQuantity: (state, action) => {
            const { productId, newQuantity } = action.payload;

            if (state.products[productId]) {
                const currentQuantity = state.products[productId].quantity;
                state.products[productId].quantity = newQuantity;
            }
        },
    }
});

export const { 
    increaseProductQuantity, 
    decreaseProductQuantity, 
    removeProductFromCart,
    updateProductQuantity 
} = cartSlice.actions;

export default cartSlice.reducer;