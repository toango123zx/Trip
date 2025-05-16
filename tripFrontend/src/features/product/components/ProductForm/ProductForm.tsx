'use client';

import { isCuid } from 'cuid';
import { JSX, useState, useEffect, useMemo } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { BaseForm } from '@/components/Form/BaseForm';
import { FormInput } from '@/components/Form/FormInput';
import { FormSelect } from '@/components/Form/FormSelect';
import { FormTextarea } from '@/components/Form/FormTextarea';
import { Plus } from 'lucide-react';
import { locationThunk } from '@/features/location';
import {
	ScheduleForm,
	SchedulesBoard,
	scheduleThunk,
	TRequestBodyCreateSchedule,
} from '@/features/schedule';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TProductSchedule } from '@/types';

import { TRequestBodyCreateProduct } from '../../product.type';
import { EProductScheduleStatus } from '@/types/product.type';

type TProductFormProps = {
	form: UseFormReturn<TRequestBodyCreateProduct>;
	schedules?: TProductSchedule[] | TRequestBodyCreateSchedule[];
	setSchedules?: React.Dispatch<
		React.SetStateAction<TProductSchedule[] | TRequestBodyCreateSchedule[]>
	>;
	// discounts?: TDiscountDetail[];
	isCreate?: boolean;
	remove?: boolean;
	onRemove?: () => void;
	onSubmit?: SubmitHandler<TRequestBodyCreateProduct>;
	onCancel?: () => void;
	disabled?: boolean;
	open?: boolean;
};

export const ProductForm = ({
	form,
	schedules,
	setSchedules = (): void => {},
	// discounts = [],
	isCreate = false,
	remove = true,
	disabled = false,
	open = true,
	onSubmit,
	onRemove = (): void => {},
	onCancel = (): void => {},
}: TProductFormProps): JSX.Element => {
	const {
		register,
		setValue,
		watch,
		handleSubmit,
		formState: { errors },
		control,
	} = form;

	const dispatch = useDispatch<TReduxStoreDispatch>();
	const locations = useSelector((s: TReduxStoreState) => s.location.locations);
	const [isOpenPopupScheduleUpdate, setIsOpenPopupScheduleUpdate] = useState(false);

	useEffect(() => {
		dispatch(locationThunk.getLocations());
	}, [dispatch]);

	const options = useMemo(
		() =>
			locations.map((l) => ({
				id: l.id,
				value: l.id,
				label: l.displayName,
				city: l.city,
			})),
		[locations],
	);

	const locationId = watch('locationId');

	const city = useMemo(
		(): string => locations.find((l) => l.id === locationId)?.city || '',
		[locations, locationId],
	);

	useEffect(() => {
		setValue('cityName', city);
	}, [city, setValue]);

	const validateGreaterThanZero = (
		value: string | number | boolean,
	): string | boolean => {
		const numValue = Number(value);
		if (isNaN(numValue) || numValue <= 0) {
			return 'Must be greater than 0';
		}
		return true;
	};

	const [isCreateSchedule, setIsCreateSchedule] = useState(false);
	const [newSchedule, setNewSchedule] = useState<TRequestBodyCreateSchedule>(
		{} as TRequestBodyCreateSchedule,
	);

	const handleAddScheduleOnClick = (): void => {
		setNewSchedule({
			id: new Date().getTime().toString(),
			price: 0,
			startTime: new Date(),
			startOrder: new Date(),
			endTime: new Date(),
			endOrder: new Date(),
			status: EProductScheduleStatus.active,
		});
		setIsCreateSchedule(true);
		setIsOpenPopupScheduleUpdate(true);
	};

	const handlerAddScheduleInPopup = (schedule: TRequestBodyCreateSchedule): void => {
		setSchedules((prev = []) => [schedule, ...prev]);
		setIsOpenPopupScheduleUpdate(false);
	};

	const handleClosePopupScheduleUpdate = (): void => {
		setIsOpenPopupScheduleUpdate(false);
	};

	const handleViewScheduleDetailOnClick = (
		schedule: TRequestBodyCreateSchedule | TProductSchedule,
	): void => {
		setIsCreateSchedule(false);
		setNewSchedule(schedule);
		setIsOpenPopupScheduleUpdate(true);
	};

	const handleRemoveSchedule = (): void => {
		if (schedules) {
			setSchedules((prev) =>
				prev.filter((schedule) => newSchedule.id !== schedule.id),
			);
		}
		if (!isCuid(newSchedule.id)) {
			setIsOpenPopupScheduleUpdate(false);
			return;
		}
		dispatch(scheduleThunk.deleteSchedule(String(newSchedule.id)));
		setIsOpenPopupScheduleUpdate(false);
	};

	const handleSaveOnClick = (data: TRequestBodyCreateProduct): void => {
		if (onSubmit) {
			onSubmit(data);
		}
	};

	return (
		<BaseForm
			title={isCreate ? 'Add Product' : 'Product Details'}
			form={form}
			isCreate={isCreate}
			disabled={disabled}
			open={open}
			onSave={handleSaveOnClick}
			onRemove={remove ? onRemove : undefined}
			onCancel={onCancel}
		>
			{/* --- Product Info --- */}
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
							d="M20 12H4"
						/>
					</svg>
					<span className="text-sm sm:text-base font-medium text-gray-800">
						Basic Information
					</span>
				</div>

				<FormInput
					control={control}
					name="name"
					label="Product Name"
					rules={{ required: 'Product Name is required' }}
					disabled={disabled}
				/>

				<FormSelect
					control={control}
					name="locationId"
					label="Location On System"
					options={options}
					rules={{ required: 'Location is required' }}
					disabled={disabled}
				/>

				<FormTextarea
					control={control}
					name="description"
					label="Description"
					rules={{ required: 'Description is required' }}
					disabled={disabled}
				/>
			</div>

			{/* --- Destination Info --- */}
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
							d="M12 4v16m8-8H4"
						/>
					</svg>
					<span className="text-sm sm:text-base font-medium text-gray-800">
						Destination & Attributes
					</span>
				</div>

				<FormInput
					control={control}
					name="cityName"
					label="Destination"
					disabled={true}
				/>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
					<FormInput
						control={control}
						name="time"
						label="Time (Hour)"
						type="number"
						rules={{
							required: 'Time is required',
							validate: validateGreaterThanZero,
						}}
						disabled={disabled}
					/>

					<FormInput
						control={control}
						name="quantityAvailable"
						label="Quantity (Person)"
						type="number"
						rules={{
							required: 'Quantity is required',
							validate: validateGreaterThanZero,
						}}
						disabled={disabled}
					/>

					<FormInput
						control={control}
						name="age"
						label="Age"
						type="number"
						rules={{
							required: 'Age is required',
							validate: validateGreaterThanZero,
						}}
						disabled={disabled}
					/>
				</div>
			</div>

			{/* --- Location on Map --- */}
			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
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
							d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 9s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z"
						/>
					</svg>
					<span className="text-sm sm:text-base font-medium text-gray-800">
						Location On Map
					</span>
				</div>

				<input
					id="locationOnMap"
					type="text"
					placeholder="Enter Coordinates or Select on Map"
					disabled={disabled}
					className={`h-9 sm:h-10 w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none ${
						disabled
							? 'bg-gray-100 border-none pl-2.5 hover:cursor-no-drop'
							: 'bg-white'
					}`}
					{...register('locationOnMap')}
				/>
			</div>

			{/* --- Gallery --- */}
			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
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
							d="M3 5h18M3 19h18M5 5v14m14-14v14"
						/>
					</svg>
					<span className="text-sm sm:text-base font-medium text-gray-800">Gallery</span>
				</div>

				<button
					type="button"
					disabled={disabled}
					className="flex h-[70px] sm:h-[85px] w-[90px] sm:w-[110px] items-center justify-center rounded-md bg-gray-200"
				>
					<Plus className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
				</button>
			</div>

			{/* --- Schedules --- */}
			<div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
				<div className="flex items-center justify-between mb-2 sm:mb-3">
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
							Schedules
						</span>
					</div>

					{!disabled && (
						<button
							type="button"
							onClick={handleAddScheduleOnClick}
							className="flex h-8 sm:h-10 items-center gap-1 rounded-full bg-orange-500 px-2 sm:px-4 py-1 sm:py-2 text-white text-xs sm:text-sm hover:bg-orange-600"
						>
							<Plus className="h-3 w-3 sm:h-4 sm:w-4" /> ADD SCHEDULES
						</button>
					)}
				</div>

				<div className="rounded-md bg-white p-1 sm:p-2 border border-gray-200 text-gray-700 overflow-x-auto">
					<SchedulesBoard
						data={schedules}
						pageSize={5}
						disabled={disabled}
						onViewDetailSchedule={handleViewScheduleDetailOnClick}
					/>
				</div>
			</div>

			{isOpenPopupScheduleUpdate && (
				<ScheduleForm
					productName={watch('name')}
					data={newSchedule}
					setData={setNewSchedule}
					isCreate={isCreateSchedule}
					onSave={handlerAddScheduleInPopup}
					onRemove={handleRemoveSchedule}
					onCancel={handleClosePopupScheduleUpdate}
				/>
			)}
		</BaseForm>
	);
};
