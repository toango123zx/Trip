import { lazy } from 'react';

const StatisticPage = lazy(() => import('@/pages/Statistic'));

export const statisticRoutes = [
    {
        path: '/statistics',
        element: <StatisticPage />,
    },
];
