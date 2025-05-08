import { notification } from 'antd';
import { isEqual, pick } from 'lodash';
import { JSX, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { ProductForm } from '@/features';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { TRequestBodyCreateProduct, TRequestBodyUpdateProduct } from '../../product.type';
import { productThunk } from '../../productThunk';

type TProductUpdateProps = {
	productId: string;
	onCancel?: () => void;
};

export const ProductUpdate = ({
	productId,
	onCancel = (): void => {},
}: TProductUpdateProps): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [hasSubmitted, setHasSubmitted] = useState(false);

	const productDetail = useSelector(
		(state: TReduxStoreState) => state.product.productDetail,
	);
	const { loading, error } = useSelector((state: TReduxStoreState) => state.product);

	const initialValuesRef = useRef<TRequestBodyUpdateProduct>(null);

	const form = useForm<TRequestBodyCreateProduct>({
		defaultValues: {
			productCategoryId: 'clv2my35m0000t8z5h4xetnxu',
			posterImageUrl:
				'https://i.pinimg.com/474x/8b/29/2a/8b292a733fdfa13083d6b20cd2684fca.jpg',
		},
	});

	useEffect(() => {
		dispatch(productThunk.getProductDetail(String(productId)));
	}, [dispatch, productId]);

	useEffect(() => {
		if (productDetail) {
			const initialValues = {
				name: productDetail.name,
				posterImageUrl: productDetail.posterImageUrl,
				time: productDetail.time,
				quantityAvailable: productDetail.quantityAvailable,
				age: productDetail.age,
				description: productDetail.description,
				locationId: productDetail.locationName,
				cityName: productDetail.city,
				productCategoryId: productDetail.productCategoryName,
				locationOnMap: '',
			};

			form.reset(initialValues);
			initialValuesRef.current = {
				name: productDetail.name,
				posterImageUrl: productDetail.posterImageUrl,
				time: productDetail.time,
				quantityAvailable: productDetail.quantityAvailable,
				age: productDetail.age,
				description: productDetail.description,
			};
		}
	}, [productDetail, form]);

	const onSubmit: SubmitHandler<TRequestBodyCreateProduct> = (data) => {
		if (
			initialValuesRef.current &&
			isEqual(
				initialValuesRef.current,
				pick(data, Object.keys(initialValuesRef.current)),
			)
		) {
			notification.error({
				message: 'Error',
				description: 'No changes detected.',
			});
			return;
		}
		dispatch(productThunk.updateProductByProductId({ productId, product: data }));
		setHasSubmitted(true);
	};

	useEffect(() => {
		if (hasSubmitted && !loading && !error) {
			onCancel();
		}
		if (error === 'Product deleted.') {
			onCancel();
		}
	}, [hasSubmitted, loading, error, onCancel]);

	const onRemove = (): void => {
		dispatch(productThunk.deleteProductByProductId(productId));
		setHasSubmitted(true);
	};
	return (
		<ProductForm
			form={form}
			onRemove={onRemove}
			schedule={productDetail.productSchedule}
			onSubmit={onSubmit}
			onCancel={onCancel}
		/>
	);
};
