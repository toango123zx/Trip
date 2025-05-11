import { Dayjs } from 'dayjs';
import { Save, Trash2, X } from 'lucide-react';
import React, { JSX, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { DateTimeField, Input, SelectBoxForm, Textarea } from '@/components';
import { discountApplicationScopeThunk } from '@/features/discountApplicationScope';
import { discountEligibilityThunk } from '@/features/discountEligibility';
import { discountTypeThunk } from '@/features/discountType/discountTypeThunk';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { TRequestBodyCreateDiscount } from '../../discount.type';

type FieldKey = keyof Pick<TRequestBodyCreateDiscount, 'startTime' | 'endTime'>;

const pickerConfigs: {
	key: FieldKey;
	label: string;
}[] = [
	{ key: 'startTime', label: 'Start' },
	{ key: 'endTime', label: 'End' },
];

type TError = {
	startTime: boolean;
	endTime: boolean;
};

type DiscountTimeField = {
	startTime: Date;
	endTime: Date;
};

type TDiscountFormProps = {
	form: UseFormReturn<TRequestBodyCreateDiscount>;
	isCreate?: boolean;
	onSave?: (data: TRequestBodyCreateDiscount) => void;
	onRemove?: () => void;
	onCancel?: () => void;
};

export const DiscountForm = ({
	form,
	isCreate = false,
	onSave = (): void => {},
	onRemove = (): void => {},
	onCancel = (): void => {},
}: TDiscountFormProps): JSX.Element => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = form;
	const [discountTime, setDiscountTime] = useState<DiscountTimeField>(
		{} as DiscountTimeField,
	);

	const dispatch = useDispatch<TReduxStoreDispatch>();
	const discountTypesOption = useSelector(
		(s: TReduxStoreState) => s.discountType.discountTypes,
	)?.map((d) => ({
		id: d.id,
		label: d.name,
		value: d.id,
	}));
	const discountEligibilitiesOption = useSelector(
		(s: TReduxStoreState) => s.discountEligibility.discountEligibilities,
	)?.map((d) => ({
		id: d.id,
		label: d.name,
		value: d.id,
	}));
	const discountApplicationScopesOption = useSelector(
		(s: TReduxStoreState) => s.discountApplicationScope.discountApplicationScopes,
	)?.map((d) => ({
		id: d.id,
		label: d.name,
		value: d.id,
	}));

	useEffect(() => {
		dispatch(discountTypeThunk.getDiscountTypes({}));
		dispatch(discountEligibilityThunk.getDiscountEligibilities({}));
		dispatch(discountApplicationScopeThunk.getDiscountApplicationScopes({}));
	}, [dispatch]);

	const updateField = (dateOrTime: Dayjs, field: FieldKey, isDate: boolean): void => {
		setDiscountTime((prev) => {
			const d = new Date(prev[field]);
			if (isDate) {
				d.setFullYear(dateOrTime.year(), dateOrTime.month(), dateOrTime.date());
			} else {
				d.setHours(dateOrTime.hour(), dateOrTime.minute());
			}
			setValue(field, d);
			return { ...prev, [field]: d };
		});
	};
	const handleRemoveOnClick = (): void => {
		onRemove();
	};
	const validateGreaterThanZero = (
		value: string | number | boolean,
	): string | boolean => {
		const numValue = Number(value);
		if (isNaN(numValue) || numValue <= 0) {
			return 'Must be greater than 0';
		}
		return true;
	};
	// const options = useMemo(
	//     () =>
	//         locations.map((l) => ({
	//             id: l.id,
	//             value: l.id,
	//             label: l.displayName,
	//             city: l.city,
	//         })),
	//     [locations],
	// );

	const [error, setError] = useState<TError>({} as TError);

	const handleSaveOnClick = (value: TRequestBodyCreateDiscount): void => {
		setError({} as TError);
		let flag = false;
		if (discountTime.startTime <= new Date()) {
			setError((prev) => ({ ...prev, startTime: true }));
			flag = true;
		}
		if (
			discountTime.endTime <= new Date() ||
			discountTime.endTime <= discountTime.startTime
		) {
			setError((prev) => ({ ...prev, endTime: true }));
			flag = true;
		}

		if (value.point <= 0) {
			setValue('quantity', 0);
		}

		if (flag) {
			return;
		}

		onSave(value);
		onCancel();
	};
	return (
		<div
			className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4 sm:px-20"
			onClick={onCancel}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-7xl max-h-11/12 overflow-y-auto bg-white rounded-lg overflow-hidden"
			>
				<header className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b">
					<h1 className="text-2xl font-bold">New Discount</h1>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={onCancel}
							className="flex items-center gap-1 px-4 py-2 border rounded-md bg-gray-50 hover:bg-gray-100"
						>
							<X className="h-5 w-5" /> Cancel
						</button>
						{!isCreate && (
							<button
								type="button"
								onClick={handleRemoveOnClick}
								className="flex items-center gap-1 rounded-md border border-red-500 bg-red-500 text-white px-4 py-2 hover:bg-red-700"
							>
								<Trash2 className="h-5 w-5" /> Remove
							</button>
						)}
						{isCreate && (
							<button
								type="button"
								onClick={handleSubmit(handleSaveOnClick)}
								className="flex items-center gap-1 px-4 py-2 border bg-orange-500 text-white rounded-md hover:bg-orange-600"
							>
								<Save className="h-5 w-5" /> Save
							</button>
						)}
					</div>
				</header>

				<form
					onSubmit={handleSaveOnClick && handleSubmit(handleSaveOnClick)}
					className="p-6 space-y-8 pb-10"
				>
					<Input<TRequestBodyCreateDiscount>
						id="name"
						label="Name"
						required
						register={register}
						errors={errors}
					/>
					<Textarea<TRequestBodyCreateDiscount>
						id="description"
						label="Description"
						register={register}
						errors={errors}
						required
					/>
					<Input<TRequestBodyCreateDiscount>
						id="value"
						label="Value"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
					/>
					<Input<TRequestBodyCreateDiscount>
						id="quantity"
						label="Quantity"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
					/>
					<Input<TRequestBodyCreateDiscount>
						id="point"
						label="Point"
						register={register}
						errors={errors}
						type="number"
						// validate={validateGreaterThanZero}
					/>
					<SelectBoxForm<TRequestBodyCreateDiscount>
						name="discountTypeId"
						label="Type"
						register={register}
						errors={errors}
						selectOption={discountTypesOption}
					/>
					<SelectBoxForm<TRequestBodyCreateDiscount>
						name="discountEligibilityId"
						label="Eligibility"
						register={register}
						errors={errors}
						selectOption={discountEligibilitiesOption}
					/>
					<SelectBoxForm<TRequestBodyCreateDiscount>
						name="discountApplicationScopeId"
						label="Application Scope"
						register={register}
						errors={errors}
						selectOption={discountApplicationScopesOption}
					/>

					<div className="space-y-8">
						{pickerConfigs.map((cfg) => (
							<DateTimeField<TRequestBodyCreateDiscount, FieldKey>
								key={cfg.key}
								label={cfg.label}
								field={cfg.key}
								value={discountTime[cfg.key]}
								onChangeDate={(d, f) => d && updateField(d, f, true)}
								onChangeTime={(t, f) => t && updateField(t, f, false)}
								error={error[cfg.key]}
							/>
						))}
					</div>
				</form>
			</div>
		</div>
	);
};
