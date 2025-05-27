import axios from 'axios';
import { notificationUtils } from '@/utils/notificationUtils';

export const cloudinaryService = {
	uploadImage: async (file: File): Promise<string> => {
		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append(
				'upload_preset',
				import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
			);

			const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

			const response = await axios.post(cloudinaryUrl, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'X-Requested-With': 'XMLHttpRequest',
				},
				withCredentials: false,
			});

			return response.data.secure_url;
		} catch (error) {
			console.error('Cloudinary upload error:', error);
			notificationUtils.error({
				message: 'Lỗi Upload',
				description: 'Không thể tải ảnh lên. Vui lòng thử lại.',
			});
			throw error;
		}
	},

	uploadImages: async (files: FileList): Promise<string[]> => {
		try {
			const uploadPromises = Array.from(files).map(async (file) => {
				const formData = new FormData();
				formData.append('file', file);
				formData.append(
					'upload_preset',
					import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
				);

				const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

				const response = await axios.post(cloudinaryUrl, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						'X-Requested-With': 'XMLHttpRequest',
					},
					withCredentials: false,
				});

				return response.data.secure_url;
			});

			return await Promise.all(uploadPromises);
		} catch (error) {
			console.error('Cloudinary upload error:', error);
			notificationUtils.error({
				message: 'Lỗi Upload',
				description: 'Không thể tải ảnh lên. Vui lòng thử lại.',
			});
			throw error;
		}
	},
};
