import { JSX, useState } from 'react';

import { AttractionList, HeroAttractions } from '@/features/product';
import { MainLayout } from '@/layouts';
import { TRequestQueryGetProducts, TSearchAttraction } from '@/features/product/product.type';
import { useForm } from 'react-hook-form';
import { T } from 'node_modules/framer-motion/dist/types.d-B50aGbjN';

const Attractions = (): JSX.Element => {
	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm<TSearchAttraction>();

	const [valueSort, setValueSort] = useState<TRequestQueryGetProducts>({});

	return (
		<MainLayout>
			<HeroAttractions register={register} handleSubmit={handleSubmit} />
			<AttractionList setValue={setValue} />
		</MainLayout>
	);
};

export default Attractions;
