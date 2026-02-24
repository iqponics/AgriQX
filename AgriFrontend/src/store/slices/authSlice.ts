import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null; // Ideally, define a User interface
    token: string | null;
    isAuthenticated: boolean;
    role: string | null;
}

const initialState: AuthState = {
    user: null, // We might hydrate this from localStorage initially if needed, but for now user login logic is handled separately.
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'), // Simple check
    role: null, // Decode from token if needed
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; token: string; role?: string }>) => {
            const { user, token, role } = action.payload;
            state.user = user;
            state.token = token;
            state.role = role || null;
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
        updateUser: (state, action: PayloadAction<any>) => {
            state.user = { ...state.user, ...action.payload };
        }
    },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;
