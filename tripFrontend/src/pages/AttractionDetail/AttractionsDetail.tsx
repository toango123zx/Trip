import { JSX, useState } from 'react';

import {
	AttractionRate,
	AttractionsInformation,
	AttracttionsSupplier,
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
			case 'supplier':
				return <AttracttionsSupplier />;
			default:
				return <AttractionsInformation />;
		}
	};

	return (
		<MainLayout>
			<HeroAttractionsDetail value={componentName} tabOnChange={setComponentName} />
			<div className=" bg-gray-100">{renderTabContent()}</div>
		</MainLayout>
	);
};

export default AttractionsDetail;
