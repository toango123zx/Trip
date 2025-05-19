import axios from 'axios';
import { notificationUtils } from '@/utils/notificationUtils';

export const cloudinaryService = {
  uploadImage: async (file: File) => {
    try {
      // Tạo FormData để upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

      // URL upload của Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

      // Thực hiện upload
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Trả về đường dẫn ảnh
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      notificationUtils.error({
        message: 'Lỗi Upload',
        description: 'Không thể tải ảnh lên. Vui lòng thử lại.'
      });
      throw error;
    }
  }
}; 