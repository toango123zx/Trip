export const commonAppConfig = {
	port: process.env.PORT || 3000,
	cookieSecret:
		process.env.COOKIE_SECRET ||
		((): string => {
			if (process.env.NODE_ENV === 'production') {
				throw new Error('COOKIE_SECRET must be set in production');
			}
			return 'dev-secret';
		})(),
	corsOrigin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : '*',
};
