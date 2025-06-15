import axios from 'axios';
const BASE_URL = import.meta.env.VITE_DOMAIN_BACKEND || 'http://localhost:3000/api';

// Cấu hình axios để gửi cookie
axios.defaults.withCredentials = true;

interface UserProfile {
	id: string;
	name: string;
	roleName: string;
	image: string;
	gender: string | null;
	email: string;
	dateOfBirth: string | null;
	phoneNumber: string | null;
	address: string | null;
	balance: number;
	point: number;
	status: string;
}

export const userService = {
	async getUserProfile() {
		try {
			const response = await axios.get<{ success: boolean; data: UserProfile }>(
				`${BASE_URL}/user/me`,
			);
			return response.data.data;
		} catch (error) {
			console.error('Lỗi khi lấy thông tin người dùng:', error);
			throw error;
		}
	},

	async updateProfile(updateData: Partial<UserProfile>) {
		try {
			const response = await axios.put<{ success: boolean; data: UserProfile }>(
				`${BASE_URL}/user`,
				updateData,
			);
			return response.data.data;
		} catch (error) {
			console.error('Lỗi khi cập nhật thông tin:', error);
			throw error;
		}
	},

	async changePassword(currentPassword: string, newPassword: string) {
		try {
			const response = await axios.patch(`${BASE_URL}/user/change-password`, {
				currentPassword,
				newPassword,
			});
			return response.data;
		} catch (error) {
			console.error('Lỗi khi đổi mật khẩu:', error);
			throw error;
		}
	},
};
