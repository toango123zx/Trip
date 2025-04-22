import { lazy } from 'react';

const AttractionPage = lazy(() => import('@/pages/Attractions'));

export const attractionRoutes = [
	{
		path: '/attractions',
		element: <AttractionPage />,
	},
];
