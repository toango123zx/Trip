import { JSX } from 'react';

import { AttractionList, HeroAttractions } from '@/features/product';
import { MainLayout } from '@/layouts';

const Attractions = (): JSX.Element => {
	return (
		<MainLayout>
			<HeroAttractions />
			<AttractionList />
		</MainLayout>
	);
};

export default Attractions;
