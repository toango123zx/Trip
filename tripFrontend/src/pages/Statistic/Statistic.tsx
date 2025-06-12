'use client';

import { JSX } from 'react';

import { StatisticsChart } from '@/features/statistic';
import { MainLayout } from '@/layouts';

const StatisticPage = (): JSX.Element => {
    return (
        <MainLayout>
            <StatisticsChart />
        </MainLayout>
    );
};

export default StatisticPage;
