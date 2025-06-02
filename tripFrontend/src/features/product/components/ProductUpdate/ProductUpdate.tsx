import { notification } from 'antd';
import { isCuid } from 'cuid';
import { isEqual, pick } from 'lodash';
import { JSX, useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { ProductForm, scheduleThunk, TRequestBodyCreateSchedule } from '@/features';
import { locationThunk } from '@/features/location';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TProductSchedule } from '@/types';

import { TRequestBodyCreateProduct, TRequestBodyUpdateProduct } from '../../product.type';
import { productThunk } from '../../productThunk';

type TProductUpdateProps = {
	productId: string;
	disabled?: boolean;
	onCancel?: () => void;
};

export const ProductUpdate = ({
	productId,
	disabled = false,
	onCancel = (): void => {},
}: TProductUpdateProps): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [hasSubmitted, setHasSubmitted] = useState(false);

	const productDetail = useSelector(
		(state: TReduxStoreState) => state.product.productDetail,
	);
	const { loading, error } = useSelector((state: TReduxStoreState) => state.product);

	// const discounts = useSelector((state: TReduxStoreState) => state.discount.discounts);

	const initialValuesRef = useRef<TRequestBodyUpdateProduct>(null);
	const [schedules, setSchedules] = useState<
		TRequestBodyCreateSchedule[] | TProductSchedule[]
	>([]);

	const form = useForm<TRequestBodyCreateProduct>({
	});

	useEffect(() => {
		dispatch(productThunk.getProductDetail(String(productId)));
		dispatch(locationThunk.getLocations());
		// dispatch(discountThunk.getDiscountsByProductId({ productId: String(productId) }));
	}, [dispatch, productId]);

	useEffect(() => {
		if (productDetail?.productSchedule) {
			setSchedules(productDetail.productSchedule);
		}
	}, [productDetail]);
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
				productImageUrls: productDetail.productImage?.map(img => img.url) || []
			};

			form.reset(initialValues);
			initialValuesRef.current = {
				name: productDetail.name,
				posterImageUrl: productDetail.posterImageUrl,
				time: productDetail.time,
				quantityAvailable: productDetail.quantityAvailable,
				age: productDetail.age,
				description: productDetail.description,
				productImageUrls: productDetail.productImage?.map(img => img.url) || []
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
			if (schedules.length === 0) {
				notification.error({
					message: 'Error',
					description: 'No changes detected.',
					duration: 3
				});
				return;
			}
			schedules.forEach((schedule) => {
				if (!isCuid(schedule.id)) {
					dispatch(
						scheduleThunk.createSchedule({
							productId: productDetail.id,
							schedule,
						}),
					);
				}
			});
			setSchedules([]);
			setHasSubmitted(true);

			return;
		}
		const formattedData = {
			...data,
			time: Number(data.time),
			quantityAvailable: Number(data.quantityAvailable),
			age: Number(data.age),
			productImageUrls: data.productImageUrls || []
		};
		
		dispatch(productThunk.updateProductByProductId({ productId, product: formattedData }));
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

	useEffect(() => {
		if (error === 'Product deleted.' || error === 'Resource not found productId') {
			onCancel();
		}
	}, [error, onCancel]);

	const onRemove = (): void => {
		dispatch(productThunk.deleteProductByProductId(productId));
		setHasSubmitted(true);
	};

	const handleScheduleDelete = () => {
		dispatch(productThunk.getProductDetail(String(productId)));
	};

	return (
		<ProductForm
			form={form}
			onRemove={onRemove}
			schedules={schedules}
			setSchedules={setSchedules}
			disabled={disabled}
			// discounts={discounts}
			onSubmit={onSubmit}
			onCancel={onCancel}
			onScheduleDelete={handleScheduleDelete}
		/>
	);
};
