import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Sale {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  discountValue: number;
  remainingQuantity: number;
  creator: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}

interface FetchSalesParams {
  page?: number;
  limit?: number;
}

interface SalesResponse {
  sales: Sale[];
  page: number;
  totalPages: number;
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1
};

export const fetchSales = createAsyncThunk<
  SalesResponse, 
  FetchSalesParams, 
  { rejectValue: string }
>(
  'sales/fetchSales',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get<SalesResponse>('/api/sales', {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Lỗi không xác định');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.sales = action.meta.arg.page === 1 
          ? action.payload.sales 
          : [...state.sales, ...action.payload.sales];
        
        state.loading = false;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi không xác định';
      });
  }
});

export default salesSlice.reducer; 