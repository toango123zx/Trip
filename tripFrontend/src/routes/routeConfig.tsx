import { authRoutes } from './authRoutes';
import { userRoutes } from './useRoutes';

const AppRoutes = [
	{
		path: '/',
		element: null,
	},
	...authRoutes,
	...userRoutes,
];

export default AppRoutes;
