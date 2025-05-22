import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { TUser, TRequestQueryGetUsers, TPagination } from '@/types';
import { notificationUtils } from '@/utils/notificationUtils';

// Hàm xử lý lỗi chung
const handleApiError = (error: any) => {
	console.error('API Error Details:', {
		response: error.response,
		request: error.request,
		message: error.message,
		config: error.config,
		headers: error.response?.headers,
		status: error.response?.status
	});
	
	// Thông báo lỗi chi tiết
	if (error.response) {
		// Lỗi từ phía server
		notificationUtils.error();
	} 
	
	throw error;
};

export const userThunk = {
	getMe: createAsyncThunk<TUser, void>(
		'user/getMe',
		async (_, { rejectWithValue }) => {
			try {
				const response = await axiosInstance.get('/user/me', {
					timeout: 10000 // 10 giây timeout
				});
				return response.data.data;
			} catch (error) {
				console.error('Error in getMe:', error);
				handleApiError(error);
				return rejectWithValue(error);
			}
		}
	),

	getUsers: createAsyncThunk<
		[TUser[], TPagination | undefined], 
		TRequestQueryGetUsers | undefined
	>(
		'user/getUsers',
		async (query, { rejectWithValue }) => {
			try {
				const response = await axiosInstance.get('/user', { 
					params: query,
					timeout: 10000 // 10 giây timeout
				});
				return [response.data.data, response.data.pagination];
			} catch (error) {
				console.error('Error in getUsers:', error);
				handleApiError(error);
				return rejectWithValue(error);
			}
		}
	),

	createUser: createAsyncThunk<
		TUser, 
		{
			username: string;
			password: string;
			email: string;
			name: string;
			roleName: 'tourist' | 'supplier' | 'admin';
		}
	>(
		'user/createUser',
		async (userData, { rejectWithValue }) => {
			try {
				const response = await axiosInstance.post('/user', userData, {
					timeout: 10000 // 10 giây timeout
				});
				notificationUtils.success();
				return response.data.data;
			} catch (error) {
				console.error('Error in createUser:', error);
				handleApiError(error);
				return rejectWithValue(error);
			}
		}
	),

	updateUser: createAsyncThunk<
		TUser, 
		{
			userId: string;
			email?: string;
			name?: string;
			phoneNumber?: string | null;
			address?: string | null;
			dateOfBirth?: Date | null;
			gender?: 'male' | 'female' | 'other' | null;
			roleName?: 'tourist' | 'supplier' | 'admin';
		}
	>(
		'user/updateUser',
		async ({ userId, ...userData }, { rejectWithValue }) => {
			try {
				const response = await axiosInstance.put(`/user/${userId}`, userData, {
					timeout: 10000 // 10 giây timeout
				});
				notificationUtils.success();
				return response.data.data;
			} catch (error) {
				console.error('Error in updateUser:', error);
				handleApiError(error);
				return rejectWithValue(error);
			}
		}
	),

	lockUser: createAsyncThunk<
		TUser, 
		string
	>(
		'user/lockUser',
		async (userId, { rejectWithValue }) => {
			try {
				const response = await axiosInstance.put(`/user/${userId}/lock`, {}, {
					timeout: 10000 // 10 giây timeout
				});
				notificationUtils.success();
				return response.data.data;
			} catch (error) {
				console.error('Error in lockUser:', error);
				handleApiError(error);
				return rejectWithValue(error);
			}
		}
	),

	unlockUser: createAsyncThunk<
		TUser, 
		string
	>(
		'user/unlockUser',
		async (userId, { rejectWithValue }) => {
			try {
				const response = await axiosInstance.patch(`/user/${userId}/unlock`, {}, {
					timeout: 10000 // 10 giây timeout
				});
				notificationUtils.success();
				return response.data.data;
			} catch (error) {
				console.error('Error in unlockUser:', error);
				handleApiError(error);
				return rejectWithValue(error);
			}
		}
	),
};
