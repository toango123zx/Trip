import { Button } from 'antd';
import { Dayjs } from 'dayjs';
import { JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UseFormReturn } from 'react-hook-form';

import { BaseForm } from '@/components/Form/BaseForm';
import { FormInput } from '@/components/Form/FormInput';
import { FormSelect } from '@/components/Form/FormSelect';
import { DateTimeField, CheckboxForm } from '@/components';
import { discountThunk, ProductUpdate, SchedulesBoardInDiscount } from '@/features';
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

type TSelectBoxOption = {
	id: string;
	label: string;
	value: string;
};

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
	open?: boolean;
	onSave?: (data: TRequestBodyCreateDiscount) => void;
	onRemove?: () => void;
	onCancel?: () => void;
};

export const DiscountForm = ({
	form,
	discountId,
	isCreate = false,
	disabled = false,
	open = false,
	onSave = () => {},
	onRemove = () => {},
	onCancel = () => {},
}: TDiscountFormProps): JSX.Element => {
	const { control, watch, setValue } = form;

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

			// Validate start time
			const now = new Date();
			now.setSeconds(0, 0); // Reset seconds and milliseconds for fair comparison

			const startTime = value.startTime;
			if (!startTime) {
				setError((prev) => ({ ...prev, startTime: true }));
				flag = true;
			}

			// Validate end time
			const endTime = value.endTime;
			if (!endTime || (startTime && endTime <= startTime)) {
				setError((prev) => ({ ...prev, endTime: true }));
				flag = true;
			}

			if (value.point <= 0) {
				setValue('quantity', 0);
			}

			if (flag) {
				console.error('Validation failed:', { startTime, endTime });
				return;
			}

			// Add schedule IDs if available
			value.scheduleIds = addScheduleIds.length > 0 ? addScheduleIds : undefined;

			try {
				onSave(value as TRequestBodyCreateDiscount);
			} catch (error) {
				console.error('Error saving discount:', error);
			}
			return;
		}

		// Handle update case
		if (!isCreate && discountId) {
			try {
				handleChangeInfoDiscount();
				onCancel();
			} catch (error) {
				console.error('Error updating discount:', error);
			}
			return;
		}
	};

	return (
		<>
			<BaseForm
				title={isCreate ? 'Thêm khuyến mãi' : 'Chi tiết khuyến mãi'}
				form={form}
				isCreate={isCreate}
				disabled={isCreate ? disabled : false}
				open={open}
				onSave={isCreate ? handleSaveOnClick : undefined}
				onRemove={onRemove}
				onCancel={onCancel}
			>
				{/* --- Basic Information --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 grid gap-2 sm:gap-3">
					<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
						<svg
							className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span className="text-sm sm:text-base font-medium text-gray-800">
							Thông tin cơ bản
						</span>
					</div>

					<FormInput
						control={control}
						name="name"
						label="Tên khuyến mãi"
						disabled={!isCreate && disabled}
						rules={{ required: 'Tên khuyến mãi là bắt buộc' }}
					/>

					<FormInput
						control={control}
						name="description"
						label="Mô tả"
						disabled={!isCreate && disabled}
						rules={{ required: 'Mô tả là bắt buộc' }}
					/>
				</div>

				{/* --- Value Information --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 grid gap-2 sm:gap-3">
					<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
						<svg
							className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
							/>
						</svg>
						<span className="text-sm sm:text-base font-medium text-gray-800">
							Thông tin giá trị
						</span>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
						<FormInput
							control={control}
							name="value"
							label="Giá trị"
							type="number"
							disabled={!isCreate && disabled}
							rules={{
								required: 'Giá trị là bắt buộc',
								validate: validateGreaterThanZero,
							}}
						/>
						
						<FormInput
							control={control}
							name="quantity"
							label="Số lượng"
							type="number"
							disabled={!isCreate && disabled}
							rules={{
								required: 'Số lượng là bắt buộc',
								validate: validateGreaterThanZero,
							}}
						/>
						
						<FormInput
							control={control}
							name="point"
							label="Điểm"
							type="number"
							disabled={!isCreate && disabled}
						/>
					</div>
				</div>

				{/* --- Rules & Options --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 grid gap-2 sm:gap-3">
					<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
						<svg
							className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
						<span className="text-sm sm:text-base font-medium text-gray-800">
							Điều kiện áp dụng
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
						<FormSelect
							control={control}
							name="discountTypeId"
							label="Loại khuyến mãi"
							options={discountTypesOption || []}
							disabled={!isCreate && disabled}
						/>
						<FormSelect
							control={control}
							name="discountEligibilityId"
							label="Điều kiện áp dụng"
							options={discountEligibilitiesOption || []}
							disabled={!isCreate && disabled}
						/>
						<FormSelect
							control={control}
							name="discountApplicationScopeId"
							label="Phạm vi áp dụng"
							options={discountApplicationScopesOption || []}
							disabled={!isCreate && disabled}
						/>
					</div>

					<div className="mt-2">
						<CheckboxForm
							name="stackable"
							label="Có thể áp dụng cùng lúc"
							disabled={!isCreate && disabled}
							defaultValue={watch('stackable')}
							register={form.register}
							errors={form.formState.errors}
							validate={(value) => value === true || value === false}
						/>
					</div>
				</div>

				{/* --- Time Period --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 grid gap-2 sm:gap-3">
					<div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
						<svg
							className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="text-sm sm:text-base font-medium text-gray-800">
							Thời gian áp dụng
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
						{pickerConfigs.map((cfg) => (
							<DateTimeField<TRequestBodyCreateDiscount, FieldKey>
								key={cfg.key}
								label={cfg.label}
								field={cfg.key}
								value={form.getValues(cfg.key)}
								disabled={!isCreate && disabled}
								onChangeDate={(d, f) => d && updateField(d, f, true)}
								onChangeTime={(t, f) => t && updateField(t, f, false)}
								error={error[cfg.key]}
							/>
						))}
					</div>
				</div>

				{/* --- Product Selection --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 grid gap-2 sm:gap-3">
					<div className="flex items-center justify-between mb-1 sm:mb-2">
						<div className="flex items-center gap-2 sm:gap-3">
							<svg
								className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
								/>
							</svg>
							<span className="text-sm sm:text-base font-medium text-gray-800">
								Sản phẩm áp dụng
							</span>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-end gap-3">
						<div className="flex-1">
							<FormSelect
								control={control}
								name="productId"
								label="Chọn sản phẩm"
								options={productOption}
								onChange={changeProductId}
								disabled={!isCreate && disabled}
							/>
						</div>
						<Button
							color="primary"
							variant="outlined"
							className="w-full sm:w-auto"
							onClick={handleOpenPopupProductDetail}
						>
							Chi tiết
						</Button>
					</div>
				</div>

				{/* --- Schedule Selection --- */}
				<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 grid gap-2 sm:gap-3">
					<div className="flex items-center justify-between mb-1 sm:mb-2">
						<div className="flex items-center gap-2 sm:gap-3">
							<svg
								className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span className="text-sm sm:text-base font-medium text-gray-800">
								Lịch trình áp dụng
							</span>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-3">
						<div className="flex-1">
							<FormSelect
								control={control}
								name="scheduleIds"
								label="Chọn lịch trình"
								options={scheduleOption}
								onChange={() => setChangeScheduleOption(!changeScheduleOption)}
								disabled={!isCreate && disabled}
							/>
						</div>
						<div className="flex gap-2 w-full sm:w-auto">
							<Button 
								type="primary" 
								onClick={handAddScheduleInDiscount}
								className="flex-1 sm:flex-none"
							>
								Thêm
							</Button>
							<Button
								color="primary"
								variant="outlined"
								onClick={handleOpenScheduleDetail}
								className="flex-1 sm:flex-none"
							>
								Chi tiết
							</Button>
						</div>
					</div>

					<div className="rounded-md bg-white p-1 sm:p-2 border border-gray-200 text-gray-700 overflow-x-auto">
						<SchedulesBoardInDiscount
							schedules={schedules}
							pageSize={5}
							onRemove={handRemoveScheduleInDiscount}
						/>
					</div>
				</div>
			</BaseForm>

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
		</>
	);
};
