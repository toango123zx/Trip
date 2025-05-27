import React from 'react';

import { HeroHome, Services, Stats, TopDestinations, TourBookingFeatures } from '@/features/product';
import { MainLayout } from '@/layouts';
import { stat } from '@/utils/fakeData/stat';

const Home: React.FC = () => {
	return (
		<MainLayout>
			<HeroHome />
			<Services />
			<TopDestinations />
			<TourBookingFeatures />
			<Stats stats={stat} />
		</MainLayout>
	);
};

export default Home;
