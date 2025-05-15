import React, { JSX, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { TRequestBodyCreateDiscount } from '../../discount.type';
import { discountThunk } from '../../discountThunk';
import { DiscountForm } from '../DiscountForm';

type TUpdateDiscountProps = {
	discountId: string;
	onCancel?: () => void;
};

export const UpdateDiscount = ({
	discountId,
	onCancel = (): void => {},
}: TUpdateDiscountProps): JSX.Element => {
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const discountDetail = useSelector(
		(s: TReduxStoreState) => s.discount.discountDetail,
	);
	const loadingApi = useSelector((state: TReduxStoreState) => state.discount.loading);
	const errorApi = useSelector((state: TReduxStoreState) => state.discount.error);
	const [hasSubmitted, setHasSubmitted] = React.useState(false);

	const form = useForm<TRequestBodyCreateDiscount>({});

	useEffect(() => {
		dispatch(discountThunk.getDiscountByDiscountId(String(discountId)));
	}, [dispatch, discountId]);

	useEffect(() => {
		if (discountDetail && Object.keys(discountDetail).length !== 0) {
			const initialValues: TRequestBodyCreateDiscount = {
				name: discountDetail.name,
				description: discountDetail.description,
				startTime: new Date(discountDetail.startTime),
				endTime: new Date(discountDetail.endTime),
				value: discountDetail.value,
				quantity: discountDetail.quantity,
				point: discountDetail.point,
				discountTypeId: discountDetail.discountType.id,
				discountEligibilityId: discountDetail.discountEligibility.id,
				discountApplicationScopeId: discountDetail.discountApplicationScope.id,
				stackable: discountDetail.stackable,
			};
			form.reset(initialValues);
		}
	}, [discountDetail, form]);

	const onRemove = (): void => {
		dispatch(discountThunk.deleteDiscount(discountId));
		setHasSubmitted(true);
	};

	useEffect(() => {
		if (hasSubmitted && !loadingApi && errorApi == null) {
			onCancel();
		}
	}, [hasSubmitted, loadingApi, errorApi, onCancel]);

	return (
		<div>
			<DiscountForm
				discountId={discountId}
				form={form}
				disabled={true}
				isCreate={false}
				onCancel={onCancel}
				onRemove={onRemove}
			/>
		</div>
	);
};
