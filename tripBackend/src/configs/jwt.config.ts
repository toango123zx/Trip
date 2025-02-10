export const jwtConfig = {
	expiresIn: process.env.EXPIRES_IN_ACCESS_KEY || '1h',
	secret:
		process.env.JWT_SECRET_ACCESS_KEY ||
		((): string => {
			if (process.env.NODE_ENV === 'production') {
				throw new Error('JWT_SECRET_ACCESS_KEY must be set in production');
			}
			return 'dev-secret';
		})(),
};
