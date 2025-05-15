import { Dayjs } from 'dayjs';
import { Save, Trash2, X } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
	DateTimeField,
	Input,
	SelectBoxForm,
	Textarea,
	TSelectBoxOption,
} from '@/components';
import { discountThunk, ProductUpdate, SchedulesBoardInDicount } from '@/features';
import { discountApplicationScopeThunk } from '@/features/discountApplicationScope';
import { discountEligibilityThunk } from '@/features/discountEligibility';
import { discountTypeThunk } from '@/features/discountType/discountTypeThunk';
import { productThunk } from '@/features/product/productThunk';
import { ScheduleDetail } from '@/features/schedule/components/ScheduleDetail/ScheduleDetail';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import {
	EInfoDiscountStatus,
	TProductSumary,
	EProductStatus,
	TDiscountsNonDiscountable,
	TProductDetail,
	TDiscount,
} from '@/types';

import { TAddScheduleInDiscount, TRequestBodyCreateDiscount } from '../../discount.type';

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
	discountId?: string;
	isCreate?: boolean;
	disabled?: boolean;
	onSave?: (data: TRequestBodyCreateDiscount) => void;
	onRemove?: () => void;
	onCancel?: () => void;
};

export const DiscountForm = ({
	form,
	discountId,
	isCreate = false,
	disabled = false,
	onSave = (): void => {},
	onRemove = (): void => {},
	onCancel = (): void => {},
}: TDiscountFormProps): JSX.Element => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		watch,
	} = form;

	const [discountTime, setDiscountTime] = useState<DiscountTimeField>(
		{} as DiscountTimeField,
	);
	const dispatch = useDispatch<TReduxStoreDispatch>();

	// Selectors
	const products = useSelector<TReduxStoreState, TProductSumary[]>(
		(state) => state.product.products,
	);
	const productDetail = useSelector<TReduxStoreState, TProductDetail>(
		(state) => state.product.productDetail,
	);
	const discountsNonDiscountable = useSelector<
		TReduxStoreState,
		TDiscountsNonDiscountable[]
	>((state) => state.discount.discountsNonDiscountable);
	const discount = useSelector<TReduxStoreState, TDiscount>(
		(state) => state.discount.discountDetail,
	);
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

	// State
	const [productOption, setProductOption] = useState<TSelectBoxOption[]>([]);
	const [scheduleOption, setScheduleOption] = useState<TSelectBoxOption[]>([]);
	const [changeScheduleOption, setChangeScheduleOption] = useState<boolean>(true);
	const [addScheduleIds, setAddScheduleIds] = useState<string[]>([]);
	const [removeScheduleIds, setRemoveScheduleIds] = useState<string[]>([]);
	const [error, setError] = useState<TError>({} as TError);
	const [schedules, setSchedules] = useState<TAddScheduleInDiscount[]>([]);
	const [productId, setProductId] = useState<string>('');
	const [isOpenPopupProductDetail, setIsOpenPopupProductDetail] = useState(false);
	const [isOpenPopupScheduleDetail, setIsOpenPopupScheduleDetail] = useState(false);

	const LIMIT_PRODUCT = 1000;

	// Data fetching effects
	useEffect(() => {
		dispatch(discountTypeThunk.getDiscountTypes({}));
		dispatch(discountEligibilityThunk.getDiscountEligibilities({}));
		dispatch(discountApplicationScopeThunk.getDiscountApplicationScopes({}));
		dispatch(
			productThunk.getProductsManagement({
				limit: LIMIT_PRODUCT,
				statusSearch: EProductStatus.active,
			}),
		);
	}, [dispatch]);

	// Load schedules from discount
	useEffect(() => {
		if (!discountId) return;
		setSchedules(
			discount.infoDiscount?.map((info) => ({
				productId: info.productSchedule.productId,
				productName: info.productSchedule.productName,
				schedulesId: info.productSchedule.id,
				startTime: info.productSchedule.startTime,
				endTime: info.productSchedule.endTime,
				booked: info.productSchedule.booked,
				price: info.productSchedule.price,
				status: EInfoDiscountStatus.active,
			})) || [],
		);
	}, [discount.infoDiscount, discountId, discountsNonDiscountable]);

	// Transform products to options
	useEffect(() => {
		const options = products.map((p) => ({
			id: p.id,
			label: p.name,
			value: p.id,
		}));
		setProductOption(options);
	}, [products]);

	// Update schedule options
	useEffect(() => {
		const schedules = discountId
			? discountsNonDiscountable
			: productDetail?.productSchedule || [];
		setScheduleOption(
			schedules
				.filter((s) => !addScheduleIds.includes(s.id))
				.map((s) => ({
					id: s.id,
					label:
						s.startTime instanceof Date
							? s.startTime.toString()
							: String(s.startTime),
					value: s.id,
				})),
		);
	}, [discountsNonDiscountable, addScheduleIds, productDetail, discountId]);

	// Handlers
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

	const validateGreaterThanZero = (
		value: string | number | boolean,
	): string | boolean => {
		const numValue = Number(value);
		return isNaN(numValue) || numValue <= 0 ? 'Must be greater than 0' : true;
	};

	const changeProductId = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const newProductId = e.target.value;
		if (!newProductId) return;

		setProductId(newProductId);

		if (discountId) {
			dispatch(
				discountThunk.getNonDiscountableSchedules({
					discountId: discountId,
					productId: String(newProductId),
					query: { limit: LIMIT_PRODUCT },
				}),
			);
		} else {
			dispatch(productThunk.getProductDetail(newProductId));
		}
	};

	const handleOpenPopupProductDetail = (
		e: React.MouseEvent<HTMLButtonElement>,
	): void => {
		e.preventDefault();
		e.stopPropagation();
		if (!productId) return;
		setIsOpenPopupProductDetail(true);
	};

	const handleClosePopupProductDetail = (): void => {
		setIsOpenPopupProductDetail(false);
	};

	const handleOpenScheduleDetail = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		e.stopPropagation();
		if (!productId || !watch('scheduleIds')) return;
		setIsOpenPopupScheduleDetail(true);
	};

	const handleCloseScheduleDetail = (): void => {
		setIsOpenPopupScheduleDetail(false);
	};

	const handAddScheduleInDiscount = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();

		const schedules = discountId
			? discountsNonDiscountable
			: productDetail?.productSchedule || [];
		const scheduleId = String(watch('scheduleIds'));
		if (!productId || !scheduleId || addScheduleIds.includes(scheduleId)) return;
		const selectedProduct = products.find((p) => p.id === String(watch('productId')));
		const selectedSchedule = schedules.find((s) => s.id === scheduleId);
		if (!selectedProduct || !selectedSchedule) return;

		const newSchedule: TAddScheduleInDiscount = {
			productId: String(selectedProduct.id),
			schedulesId: String(selectedSchedule.id),
			booked: selectedSchedule.booked,
			price: selectedSchedule.price,
			startTime: selectedSchedule.startTime,
			endTime: selectedSchedule.endTime,
			productName: selectedProduct?.name,
			status: EInfoDiscountStatus.pendingAdd,
		};

		setAddScheduleIds((prev) => [...prev, newSchedule.schedulesId]);
		setSchedules((prev) => [newSchedule, ...prev]);
	};

	const handRemoveScheduleInDiscount = (scheduleId: string): void => {
		if (addScheduleIds.includes(scheduleId)) {
			setAddScheduleIds((prev) => prev.filter((id) => id !== scheduleId));
			setSchedules((prev) => prev.filter((s) => s.schedulesId !== scheduleId));
			return;
		}

		setRemoveScheduleIds((prev) => [...prev, scheduleId]);
		setSchedules((prev) =>
			prev.map((s) =>
				s.schedulesId === scheduleId
					? { ...s, status: EInfoDiscountStatus.inactive }
					: s,
			),
		);
	};

	const handleChangeInfoDiscount = (): void => {
		if (!isCreate && discountId) {
			if (addScheduleIds.length > 0) {
				dispatch(
					discountThunk.assignProductSchedulesToDiscount({
						discountId: discountId,
						schedules: { scheduleIds: addScheduleIds },
					}),
				);
			}

			if (removeScheduleIds.length > 0) {
				dispatch(
					discountThunk.deleteProductSchedulesToDiscount({
						discountId: discountId,
						schedules: { scheduleIds: removeScheduleIds },
					}),
				);
			}
		}
	};

	const handleSaveOnClick = (value: TRequestBodyCreateDiscount): void => {
		if (isCreate) {
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

			if (flag) return;
			if (addScheduleIds.length > 0) {
				value.scheduleIds = addScheduleIds;
			}

			onSave(value as TRequestBodyCreateDiscount);
			onCancel();
			return;
		}

		if (!isCreate && discountId) {
			handleChangeInfoDiscount();
			onCancel();
			return;
		}
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
								onClick={onRemove}
								className="flex items-center gap-1 rounded-md border border-red-500 bg-red-500 text-white px-4 py-2 hover:bg-red-700"
							>
								<Trash2 className="h-5 w-5" /> Remove
							</button>
						)}
						<button
							type="button"
							onClick={handleSubmit(handleSaveOnClick)}
							className="flex items-center gap-1 px-4 py-2 border bg-orange-500 text-white rounded-md hover:bg-orange-600"
						>
							<Save className="h-5 w-5" /> Save
						</button>
					</div>
				</header>

				<form
					onSubmit={handleSubmit(handleSaveOnClick)}
					className="p-6 space-y-8 pb-10"
				>
					<Input<TRequestBodyCreateDiscount>
						id="name"
						label="Name"
						required
						disabled={disabled}
						register={register}
						errors={errors}
					/>
					<Textarea<TRequestBodyCreateDiscount>
						id="description"
						label="Description"
						disabled={disabled}
						register={register}
						errors={errors}
						required
					/>
					<Input<TRequestBodyCreateDiscount>
						id="value"
						label="Value"
						disabled={disabled}
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
					/>
					<Input<TRequestBodyCreateDiscount>
						id="quantity"
						label="Quantity"
						disabled={disabled}
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
					/>
					<Input<TRequestBodyCreateDiscount>
						id="point"
						label="Point"
						disabled={disabled}
						register={register}
						errors={errors}
						type="number"
					/>
					<SelectBoxForm<TRequestBodyCreateDiscount>
						name="discountTypeId"
						label="Type"
						disabled={disabled}
						register={register}
						errors={errors}
						selectOption={discountTypesOption}
					/>
					<SelectBoxForm<TRequestBodyCreateDiscount>
						name="discountEligibilityId"
						label="Eligibility"
						disabled={disabled}
						register={register}
						errors={errors}
						selectOption={discountEligibilitiesOption}
					/>
					<SelectBoxForm<TRequestBodyCreateDiscount>
						name="discountApplicationScopeId"
						label="Application Scope"
						disabled={disabled}
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
								value={form.getValues(cfg.key)}
								disabled={disabled}
								onChangeDate={(d, f) => d && updateField(d, f, true)}
								onChangeTime={(t, f) => t && updateField(t, f, false)}
								error={error[cfg.key]}
							/>
						))}

						<div className="w-full flex items-start gap-2 ">
							<div className="flex-1">
								<SelectBoxForm<TRequestBodyCreateDiscount>
									name="productId"
									label="Product"
									register={register}
									errors={errors}
									selectOption={productOption}
									onChange={changeProductId}
								/>
							</div>
							<button
								type="button"
								onClick={handleOpenPopupProductDetail}
								className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Detail
							</button>
						</div>

						<div className="w-full flex items-start gap-2">
							<div className="flex-1">
								<SelectBoxForm<TRequestBodyCreateDiscount>
									name="scheduleIds"
									label="Schedules"
									onChange={() =>
										setChangeScheduleOption(!changeScheduleOption)
									}
									register={register}
									errors={errors}
									selectOption={scheduleOption}
								/>
							</div>
							<button
								type="button"
								onClick={handAddScheduleInDiscount}
								className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
							>
								+
							</button>
							<button
								type="button"
								onClick={handleOpenScheduleDetail}
								className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Detail
							</button>
						</div>
					</div>

					<div>
						<SchedulesBoardInDicount
							schedules={schedules}
							pageSize={5}
							onRemove={handRemoveScheduleInDiscount}
						/>
					</div>
				</form>
			</div>

			{/* Use React Portals for modals to avoid form nesting */}
			{isOpenPopupProductDetail && productId && (
				<ProductUpdate
					productId={String(productId)}
					disabled={true}
					onCancel={handleClosePopupProductDetail}
				/>
			)}

			{isOpenPopupScheduleDetail && productId && watch('scheduleIds') && (
				<ScheduleDetail
					productName={
						productOption.find((p) => p.id === productId)?.label || 'None'
					}
					scheduleId={String(watch('scheduleIds'))}
					disabled={true}
					isCreate={false}
					onCancel={handleCloseScheduleDetail}
				/>
			)}
		</div>
	);
};
