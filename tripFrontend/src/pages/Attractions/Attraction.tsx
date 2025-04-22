import { JSX } from 'react';
import { useForm } from 'react-hook-form';

import { AttractionList, HeroAttractions } from '@/features/product';
import { TSearchAttraction } from '@/features/product/product.type';
import { MainLayout } from '@/layouts';

const Attractions = (): JSX.Element => {
	const form = useForm<TSearchAttraction>();

	return (
		<MainLayout>
			<HeroAttractions form={form} />
			<AttractionList form={form} />
		</MainLayout>
	);
};

export default Attractions;
