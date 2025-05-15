import { JSX, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { TRequestBodyCreateDiscount } from '../../discount.type';
import { discountThunk } from '../../discountThunk';
import { DiscountForm } from '../DiscountForm';

type TAddDiscountProps = {
	onCancel?: () => void;
};

export const AddDiscount = ({
	onCancel = (): void => {},
}: TAddDiscountProps): JSX.Element => {
	const form = useForm<TRequestBodyCreateDiscount>({
		defaultValues: {
			discountTypeId: 'cm9m9tn960005e56c8tmr6go9',
			discountEligibilityId: 'cm9m9tn960005e56c8tmr6go9',
			discountApplicationScopeId: 'cm9m9tn960005e56c8tmr6go9',
		},
	});
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const loadingApi = useSelector((s: TReduxStoreState) => s.product.loading);
	const errorApi = useSelector((s: TReduxStoreState) => s.product.error);
	const onSubmit: SubmitHandler<TRequestBodyCreateDiscount> = (
		data: TRequestBodyCreateDiscount,
	) => {
		setHasSubmitted(true);
		dispatch(discountThunk.createDiscount({ discount: data }));
	};

	useEffect(() => {
		if (hasSubmitted && !loadingApi && !errorApi) {
			onCancel();
		}
	}, [dispatch, hasSubmitted, loadingApi, errorApi, onCancel]);

	return (
		<div>
			<DiscountForm
				form={form}
				isCreate={true}
				onSave={onSubmit}
				onCancel={onCancel}
			/>
		</div>
	);
};
