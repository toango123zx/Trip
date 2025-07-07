import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const baseURL = import.meta.env.VITE_DOMAIN_BACKEND || 'http://localhost:3000/api';
console.log(`🚀 ~ salesSlice.ts:4 ~ baseURL:`, baseURL)

export interface Sale {
  id: string;
  name: string;
  code: string;
  description: string;
  startTime: Date;
  endTime: Date;
  value: number;
  quantity: number;
  applited: number;
  stackable: boolean;
  status: 'active' | 'canceled';
  user: {
    id: string;
    name: string;
  };
}

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

const initialState: SalesState = {
  sales: [],
  loading: false,
  error: null,
  pagination: {
    totalItems: 0,
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 0,
  },
};

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/discount`, {
        withCredentials: true,
        params: { 
          page,
          statusSearch: 'active' // Chỉ lấy các khuyến mãi active
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách khuyến mãi');
      }
      return rejectWithValue('Lỗi không xác định khi tải danh sách khuyến mãi');
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
        state.loading = false;
        state.sales = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default salesSlice.reducer; 