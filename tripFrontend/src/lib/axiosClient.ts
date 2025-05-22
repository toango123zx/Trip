import { notificationUtils } from '@/utils/notificationUtils';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import {
	DOMAIN_BACKEND,
	DOMAIN_AI,
	DOMAIN_BACKEND_TIMEOUT,
	DOMAIN_AI_TIMEOUT,
} from '@/constants';
import { TPagination } from '@/types';

// Define interfaces for API responses
export interface IApiResponse<T = unknown> {
	success: boolean;
	data: T;
	pagination?: TPagination;
}

export interface IApiError {
	success: boolean;
	message: string;
}

export enum EServer {
	Backend = 'backend',
	AI = 'ai',
}

// Interface describing the structure of API clients
interface IApiClients {
	backend: AxiosInstance;
	ai: AxiosInstance;
	[key: string]: AxiosInstance;
}

// Helper function to handle and display errors
const handleApiError = (error: AxiosError<IApiError>): void => {
	let errorMessage = 'An error occurred';

	if (axios.isAxiosError(error)) {
		// Get message from the response if available
		const serverMessage = error.response?.data?.message;

		if (serverMessage) {
			errorMessage = serverMessage;
		}
	}

	// Display error message
	notificationUtils.error();
};

// Factory function to create an API client with custom configurations
const createApiClient = (baseURL: string, timeout: number): AxiosInstance => {
	const client = axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json',
		},
		withCredentials: true,
		timeout,
	});

	// Request interceptor
	client.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem('accessToken');
			if (token && config.headers) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error) => {
			handleApiError(error);
			return Promise.reject(error);
		},
	);

	// Response interceptor
	client.interceptors.response.use(
		(response) => {
			if (response.status === 201) {
				notificationUtils.success();
			}
			return response;
		},
		async (error: AxiosError<IApiError>) => {
			const originalRequest = error.config as AxiosRequestConfig & {
				_retry?: boolean;
			};

			if (error.response?.status === 401) {
				localStorage.removeItem('logged');
				localStorage.removeItem('role');
				window.location.href = '/auth/login';
			}

			if (
				error.response?.status === 401 &&
				!originalRequest._retry &&
				localStorage.getItem('refreshToken')
			) {
				originalRequest._retry = true;

				try {
					window.location.href = '/auth/login';
				} catch (refreshError) {
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');

					window.location.href = '/auth/login';
					return Promise.reject(refreshError);
				}
			}

			handleApiError(error);

			return Promise.reject(error);
		},
	);

	return client;
};

// Create API clients
export const apiClients: IApiClients = {
	backend: createApiClient(DOMAIN_BACKEND, DOMAIN_BACKEND_TIMEOUT),
	ai: createApiClient(DOMAIN_AI, DOMAIN_AI_TIMEOUT),
};

// Helper function to get the appropriate client
export const getApiClient = (service: keyof IApiClients = 'backend'): AxiosInstance => {
	return apiClients[service];
};

// Helper functions to make axios usage easier with error handling
export const api = {
	get: <T, Q = unknown>(
		url: string,
		query?: Q,
		service: keyof IApiClients = 'backend',
		config?: AxiosRequestConfig,
	): Promise<IApiResponse<T>> => {
		return getApiClient(service)
			.get<any>(url, {
				...config,
				withCredentials: true,
				params: query,
			})
			.then((response) => {
				if (response.data) {
					if (response.data.success !== undefined) {
						return {
							success: response.data.success,
							data: response.data.data,
							pagination: response.data.pagination
						};
					}
					
					return {
						success: true,
						data: response.data,
						pagination: response.headers['x-pagination'] ? 
							JSON.parse(response.headers['x-pagination']) : 
							undefined
					};
				}
				
				throw new Error('No data in response');
			})
			.catch((error) => {
				console.error('API get error:', error);
				
				// Nếu là lỗi từ response
				if (error.response) {
					throw error.response.data || { 
						success: false, 
						message: error.message || 'Network error' 
					};
				}
				
				// Lỗi khác
				throw { 
					success: false, 
					message: error.message || 'Network error' 
				};
			});
	},

	post: <T, D = unknown, Q = unknown>(
		url: string,
		data?: D,
		query?: Q,
		service: keyof IApiClients = 'backend',
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return getApiClient(service)
			.post<any>(url, data, {
				...config,
				withCredentials: true,
				params: query,
			})
			.then((response) => {
				if (response.data) {
					if (response.data.success !== undefined) {
						return response.data.data;
					}
					return response.data;
				}
				
				throw new Error('No data in response');
			})
			.catch((error) => {
				console.error('API post error:', error);
				
				if (error.response) {
					throw error.response.data || { 
						success: false, 
						message: error.message || 'Network error' 
					};
				}
				
				throw { 
					success: false, 
					message: error.message || 'Network error' 
				};
			});
	},

	put: <T, D, Q = unknown>(
		url: string,
		data?: D,
		query?: Q,
		service: keyof IApiClients = 'backend',
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return getApiClient(service)
			.put<any>(url, data, {
				...config,
				withCredentials: true,
				params: query,
			})
			.then((response) => {
				if (response.data) {
					if (response.data.success !== undefined) {
						return response.data.data;
					}
					return response.data;
				}
				
				throw new Error('No data in response');
			})
			.catch((error) => {
				console.error('API put error:', error);
				
				if (error.response) {
					throw error.response.data || { 
						success: false, 
						message: error.message || 'Network error' 
					};
				}
				
				throw { 
					success: false, 
					message: error.message || 'Network error' 
				};
			});
	},

	delete: <T, D = unknown, Q = unknown>(
		url: string,
		data?: D,
		query?: Q,
		service: keyof IApiClients = 'backend',
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return getApiClient(service)
			.delete<any>(url, {
				...config,
				withCredentials: true,
				params: query,
				data: data,
			})
			.then((response) => {
				if (response.data) {
					if (response.data.success !== undefined) {
						return response.data.data;
					}
					return response.data;
				}
				
				throw new Error('No data in response');
			})
			.catch((error) => {
				console.error('API delete error:', error);
				
				if (error.response) {
					throw error.response.data || { 
						success: false, 
						message: error.message || 'Network error' 
					};
				}
				
				throw { 
					success: false, 
					message: error.message || 'Network error' 
				};
			});
	},

	// Allow adding new clients in the future
	addClient: (name: string, baseURL: string, timeout: number): void => {
		apiClients[name] = createApiClient(baseURL, timeout);
	},
};
