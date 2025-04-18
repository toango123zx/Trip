import type React from 'react';

import { Hero, Services, Stats, TopDestinations } from '@/features/product';
import { MainLayout } from '@/layouts';
import { stat } from '@/utils/fakeData';

const Home: React.FC = () => {
	return (
		<MainLayout>
			<Hero />
			<Services />
			<TopDestinations />
			<Stats stats={stat} />
		</MainLayout>
	);
};

export default Home;
