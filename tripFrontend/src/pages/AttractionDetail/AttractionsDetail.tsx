import React, { JSX } from 'react';

import { AttractionsInformation, HeroAttractionsDetail } from '@/features/product';
import { MainLayout } from '@/layouts';

const AttractionsDetail = (): JSX.Element => {
	return (
		<MainLayout>
			<HeroAttractionsDetail />
			<AttractionsInformation />
		</MainLayout>
	);
};

export default AttractionsDetail;
