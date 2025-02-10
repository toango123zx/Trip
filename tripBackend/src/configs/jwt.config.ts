export const jwtConfig = {
	expiresIn: process.env.EXPIRES_IN_ACCESS_KEY,
	secret: process.env.JWT_SECRET_ACCESS_KEY,
};
