import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

interface Vendor {
    _id: string;
    firstname: string;
    lastname: string;
    lawyerType: string; // 'Farmer' or 'Vendor'
    profilePic: string;
    rating: { userId: string, rating: number }[];
    noOfCases: number;
    yearsOfExperience: number;
    summary: string;
    geoLocation: {
        city: string;
        state: string;
        country: string;
    };
    role: string;
}

interface VendorState {
    vendors: Vendor[];
    loading: boolean;
    error: string | null;
}

const initialState: VendorState = {
    vendors: [],
    loading: false,
    error: null,
};

export const fetchVendors = createAsyncThunk(
    'vendors/fetchVendors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/search?name=&city=`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
        }
    }
);

const vendorSlice = createSlice({
    name: 'vendors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVendors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVendors.fulfilled, (state, action: PayloadAction<Vendor[]>) => {
                state.loading = false;
                state.vendors = action.payload;
            })
            .addCase(fetchVendors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default vendorSlice.reducer;
