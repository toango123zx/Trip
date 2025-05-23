import { JSX, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { TRequestBodyCreateDiscount } from '../../discount.type';
import { discountThunk } from '../../discountThunk';
import { DiscountForm } from '../DiscountForm';

type TAddDiscountProps = {
	open: boolean;
	onCancel?: () => void;
};

export const AddDiscount = ({
	open,
	onCancel = (): void => {},
}: TAddDiscountProps): JSX.Element => {
	const form = useForm<TRequestBodyCreateDiscount>({
		defaultValues: {
			name: '',
			description: '',
			value: 0,
			quantity: 0,
			point: 0,
			startTime: new Date(),
			endTime: new Date(),
			stackable: false,
			discountTypeId: 'cm9m9tn960005e56c8tmr6go9',
			discountEligibilityId: 'cm9m9tn960005e56c8tmr6go9',
			discountApplicationScopeId: 'cm9m9tn960005e56c8tmr6go9',
		},
	});
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const loadingApi = useSelector((s: TReduxStoreState) => s.discount.loading);
	const errorApi = useSelector((s: TReduxStoreState) => s.discount.error);

	const onSubmit: SubmitHandler<TRequestBodyCreateDiscount> = (
		data: TRequestBodyCreateDiscount,
	) => {
		dispatch(discountThunk.createDiscount({ discount: data }));
		setHasSubmitted(true);
	};

	useEffect(() => {
		if (hasSubmitted && !loadingApi && errorApi === null) {
			onCancel();
		}
	}, [dispatch, hasSubmitted, loadingApi, errorApi, onCancel]);

	return (
		<DiscountForm
			form={form}
			isCreate={true}
			onSave={onSubmit}
			onCancel={onCancel}
			open={open}
		/>
	);
};
