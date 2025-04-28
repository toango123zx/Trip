import { notification } from 'antd';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import {
	DOMAIN_BACKEND,
	DOMAIN_AI,
	DOMAIN_BACKEND_TIMEOUT,
	DOMAIN_AI_TIMEOUT,
} from '@/constants';

// Define interfaces for API responses
export interface IApiResponse<T = unknown> {
	success: boolean;
	data: T;
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
	notification.error({
		message: 'Error',
		description: errorMessage,
		duration: 5,
	});
};

// Factory function to create an API client with custom configurations
const createApiClient = (baseURL: string, timeout: number): AxiosInstance => {
	const client = axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json',
		},
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
			return response;
		},
		async (error: AxiosError<IApiError>) => {
			const originalRequest = error.config as AxiosRequestConfig & {
				_retry?: boolean;
			};

			// If error is 401 (Unauthorized) and the request has not been retried yet
			if (
				error.response?.status === 401 &&
				!originalRequest._retry &&
				localStorage.getItem('refreshToken')
			) {
				originalRequest._retry = true;

				try {
					const refreshToken = localStorage.getItem('refreshToken');
					const response = await apiClients.backend.post<{
						accessToken: string;
					}>('/auth/refresh', {
						refreshToken,
					});
					const { accessToken } = response.data;

					localStorage.setItem('accessToken', accessToken);

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					}

					return axios(originalRequest);
				} catch (refreshError) {
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');

					// Display error before redirecting

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
	): Promise<T> => {
		return getApiClient(service)
			.get<IApiResponse<T>>(url, {
				...config,
				withCredentials: true,
				params: query,
			})
			.then((response) => response.data.data)
			.catch((error) => {
				// Error is already handled in interceptor, just rethrow
				throw error;
			});
	},

	post: <T, D, Q = unknown>(
		url: string,
		data?: D,
		query?: Q,
		service: keyof IApiClients = 'backend',
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return getApiClient(service)
			.post<IApiResponse<T>>(url, data, {
				...config,
				withCredentials: true,
				params: query,
			})
			.then((response) => response.data.data)
			.catch((error) => {
				// Error is already handled in interceptor, just rethrow
				throw error;
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
			.put<IApiResponse<T>>(url, data, {
				...config,
				withCredentials: true,
				params: query,
			})
			.then((response) => response.data.data)
			.catch((error) => {
				// Error is already handled in interceptor, just rethrow
				throw error;
			});
	},

	delete: <T, Q = unknown>(
		url: string,
		query?: Q,
		service: keyof IApiClients = 'backend',
		config?: AxiosRequestConfig,
	): Promise<T> => {
		return getApiClient(service)
			.delete<IApiResponse<T>>(url, {
				...config,
				withCredentials: true,
				params: query,
			})
			.then((response) => response.data.data)
			.catch((error) => {
				// Error is already handled in interceptor, just rethrow
				throw error;
			});
	},

	// Allow adding new clients in the future
	addClient: (name: string, baseURL: string, timeout: number): void => {
		apiClients[name] = createApiClient(baseURL, timeout);
	},
};
