import type React from 'react';

import { HeroHome, Services, Stats, TopDestinations } from '@/features/product';
import { MainLayout } from '@/layouts';
import { stat } from '@/utils/fakeData/stat';

const Home: React.FC = () => {
	return (
		<MainLayout>
			<HeroHome />
			<Services />
			<TopDestinations />
			<Stats stats={stat} />
		</MainLayout>
	);
};

export default Home;
