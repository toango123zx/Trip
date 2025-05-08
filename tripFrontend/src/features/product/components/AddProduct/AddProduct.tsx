'use client';

import { JSX, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { ProductForm } from '@/features';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { TRequestBodyCreateProduct } from '../../product.type';
import { productThunk } from '../../productThunk';

type TAddProductProps = {
	onCancel?: () => void;
};

export const AddProduct = ({
	onCancel = (): void => {},
}: TAddProductProps): JSX.Element => {
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const form = useForm<TRequestBodyCreateProduct>({
		defaultValues: {
			productCategoryId: 'clv2my35m0000t8z5h4xetnxu',
			posterImageUrl:
				'https://i.pinimg.com/474x/8b/29/2a/8b292a733fdfa13083d6b20cd2684fca.jpg',
		},
	});

	const dispatch = useDispatch<TReduxStoreDispatch>();

	const loadingApi = useSelector((s: TReduxStoreState) => s.product.loading);
	const errorApi = useSelector((s: TReduxStoreState) => s.product.error);

	const onSubmit: SubmitHandler<TRequestBodyCreateProduct> = (data) => {
		setHasSubmitted(true);
		dispatch(productThunk.createProduct(data));
	};

	useEffect(() => {
		if (hasSubmitted && !loadingApi && !errorApi) {
			onCancel();
		}
	}, [hasSubmitted, loadingApi, errorApi, onCancel]);

	return (
		<div>
			<ProductForm
				form={form}
				remove={false}
				onSubmit={onSubmit}
				onCancel={onCancel}
			/>
		</div>
	);
};
