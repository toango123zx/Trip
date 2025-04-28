import { JSX, useState } from 'react';

import {
	AttractionRate,
	AttractionsInformation,
	HeroAttractionsDetail,
} from '@/features/product';
import { MainLayout } from '@/layouts';

const AttractionsDetail = (): JSX.Element => {
	const [componentName, setComponentName] = useState<string>('information');

	const renderTabContent = (): JSX.Element => {
		switch (componentName) {
			case 'information':
				return <AttractionsInformation />;
			case 'rate':
				return <AttractionRate />;
			default:
				return <AttractionsInformation />;
		}
	};

	return (
		<MainLayout>
			<HeroAttractionsDetail value={componentName} tabOnChange={setComponentName} />
			<div className="pb-28 md:p-8 bg-gray-100">{renderTabContent()}</div>
		</MainLayout>
	);
};

export default AttractionsDetail;
