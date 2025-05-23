import axios from 'axios';

interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requiredRoles?: string[];
}

export const AuthMiddleware = (options: AuthMiddlewareOptions = {}) => {
  const { requireAuth = true, requiredRoles = [] } = options;

  return async (req: any, res: any, next: () => void) => {
    try {
      // Lấy token từ cookie hoặc header
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

      if (requireAuth && !token) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
      }

      if (token) {
        // Xác thực token với backend
        const response = await axios.get('/api/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data.user;

        // Kiểm tra quyền truy cập
        if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
          return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        // Gắn thông tin người dùng vào request
        req.user = user;
      }

      next();
    } catch (error) {
      console.error('Lỗi xác thực:', error);
      return res.status(401).json({ message: 'Xác thực không thành công' });
    }
  };
};

// Hàm kiểm tra quyền truy cập
export const checkAccess = (requiredRoles: string[]) => {
  return authMiddleware({ requiredRoles });
}; 