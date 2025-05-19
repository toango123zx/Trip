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
				console.log('Attempting to fetch user me...');
				
				// Log thông tin cookies trước khi request
				console.log('Cookies before request:', document.cookie);
				
				const response = await axiosInstance.get('/user/me', {
					timeout: 10000 // 10 giây timeout
				});
				
				// Log thông tin response
				console.log('User me response:', {
					data: response.data,
					headers: response.headers,
					status: response.status
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
				console.log('Fetching users with query:', query);
				
				// Log thông tin cookies trước khi request
				console.log('Cookies before request:', document.cookie);
				
				const response = await axiosInstance.get('/user', { 
					params: query,
					timeout: 10000 // 10 giây timeout
				});
				
				// Log thông tin response
				console.log('Users response:', {
					data: response.data,
					headers: response.headers,
					status: response.status
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
				console.log('Creating user:', userData);
				const response = await axiosInstance.post('/user', userData, {
					timeout: 10000 // 10 giây timeout
				});
				console.log('Create user response:', response.data);
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
				console.log(`Updating user ${userId}:`, userData);
				const response = await axiosInstance.put(`/user/${userId}`, userData, {
					timeout: 10000 // 10 giây timeout
				});
				console.log('Update user response:', response.data);
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
				console.log(`Locking user ${userId}`);
				const response = await axiosInstance.put(`/user/${userId}/lock`, {}, {
					timeout: 10000 // 10 giây timeout
				});
				console.log('Lock user response:', response.data);
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
				console.log(`Unlocking user ${userId}`);
				const response = await axiosInstance.patch(`/user/${userId}/unlock`, {}, {
					timeout: 10000 // 10 giây timeout
				});
				console.log('Unlock user response:', response.data);
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
