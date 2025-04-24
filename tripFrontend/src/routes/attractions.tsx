import { lazy } from 'react';

const AttractionPage = lazy(() => import('@/pages/Attractions'));
const AttractionsDetailPage = lazy(() => import('@/pages/AttractionDetail'));

export const attractionRoutes = [
	{
		path: '/attractions',
		element: <AttractionPage />,
	},
	{
		path: '/attractions/:attractionId',
		element: <AttractionsDetailPage />,
	},
];
