import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://trip-backend-v0.onrender.com',
    withCredentials: true, // Quan trọng để gửi cookies cross-origin
});

// Thêm interceptor để xử lý request và response
axiosInstance.interceptors.request.use(
    (config) => {
        // Không cần thêm token thủ công vì cookies sẽ được gửi tự động
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý response
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Xử lý lỗi token hết hạn
        if (error.response && error.response.status === 401) {
            // Chuyển hướng đến trang đăng nhập
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 