import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from './slices/vendorSlice';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        vendors: vendorReducer,
        products: productReducer,
        auth: authReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {vendors: VendorState, products: ProductState, auth: AuthState}
export type AppDispatch = typeof store.dispatch;
