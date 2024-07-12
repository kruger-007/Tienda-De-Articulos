import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from './AuthSlice';
import cartSlice from './cartSlice';

export const store = configureStore(
    {
        reducer: {
            auth: AuthReducer,
            cart: cartSlice,
        },
    }
);