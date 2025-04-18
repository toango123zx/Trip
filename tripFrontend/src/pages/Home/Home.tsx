import type React from 'react';

import { Hero, Services } from '@/features/product';
import Stats from '@/features/product/components/Stats/Stats';
import { TopDestinations } from '@/features/product/components/TopDestinations/TopDestinations';
import { MainLayout } from '@/layouts';
import { destinations, stats } from '@/utils';

const Home: React.FC = () => {
	return (
		<MainLayout>
			<Hero />
			<Services />
			<TopDestinations destinations={destinations} />
			<Stats stats={stats} />
		</MainLayout>
	);
};

export default Home;
