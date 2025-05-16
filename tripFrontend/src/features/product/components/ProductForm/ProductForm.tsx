'use client';

import { isCuid } from 'cuid';
import { X, Save, Plus, Map, Trash2 } from 'lucide-react';
import { JSX, useState, useEffect, useMemo } from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Input, Row, Select, Textarea } from '@/components';
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

type TProductFormProps = {
	form: UseFormReturn<TRequestBodyCreateProduct>;
	schedules?: TProductSchedule[] | TRequestBodyCreateSchedule[];
	setSchedules?: React.Dispatch<
		React.SetStateAction<TProductSchedule[] | TRequestBodyCreateSchedule[]>
	>;
	// discounts?: TDiscountDetail[];
	remove?: boolean;
	onRemove?: () => void;
	onSubmit?: SubmitHandler<TRequestBodyCreateProduct>;
	onCancel?: () => void;
	disabled?: boolean;
};

export const ProductForm = ({
	form,
	schedules,
	setSchedules = (): void => {},
	// discounts = [],
	remove = true,
	disabled = false,
	onSubmit,
	onRemove = (): void => {},
	onCancel = (): void => {},
}: TProductFormProps): JSX.Element => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
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

	const handleRemoveOnClick = (): void => {
		onRemove();
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

	return (
		<div
			className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 px-4 sm:px-20"
			onClick={onCancel}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className="max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-lg bg-white shadow-lg"
			>
				{/* Header */}
				<header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 py-4">
					<h1 className="text-2xl font-bold">Add Product</h1>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={onCancel}
							className="flex h-10 items-center gap-1 rounded-md border bg-gray-50 px-4 py-2 hover:bg-gray-100"
						>
							<X className="h-5 w-5" /> Cancel
						</button>
						{!disabled && remove && (
							<button
								type="button"
								onClick={handleRemoveOnClick}
								className="flex h-10 items-center gap-1 rounded-md border border-red-500 bg-red-500 text-white px-4 py-2 hover:bg-red-700"
							>
								<Trash2 className="h-5 w-5" /> Remove
							</button>
						)}
						{!disabled && (
							<button
								type="submit"
								onClick={onSubmit && handleSubmit(onSubmit)}
								className="flex h-10 items-center gap-1 rounded-md border border-orange-500 bg-orange-500  px-4 py-2 text-white hover:bg-orange-600"
							>
								<Save className="h-5 w-5" /> Save
							</button>
						)}
					</div>
				</header>

				{/* Form */}
				<form
					className="px-6 pb-8 pt-6"
					onSubmit={onSubmit && handleSubmit(onSubmit)}
				>
					<Input<TRequestBodyCreateProduct>
						id="name"
						label="Product Name"
						required
						register={register}
						errors={errors}
						disabled={disabled}
					/>
					<Select<TRequestBodyCreateProduct>
						id="locationId"
						label="Location On System"
						required
						defaultValue={watch('locationId')}
						setValue={setValue}
						errors={errors}
						options={options}
						placeholder="Select location"
						disabled={disabled}
					/>
					<Textarea<TRequestBodyCreateProduct>
						id="description"
						label="Description"
						register={register}
						errors={errors}
						required
						disabled={disabled}
					/>
					<Input<TRequestBodyCreateProduct>
						id="cityName"
						label="Destination"
						defaultValue={watch('cityName')}
						register={register}
						errors={errors}
						// required
						disabled={disabled}
					/>
					<Input<TRequestBodyCreateProduct>
						id="time"
						label="Time (Hour)"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
						disabled={disabled}
					/>
					<Input<TRequestBodyCreateProduct>
						id="quantityAvailable"
						label="Quantity (Person)"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
						disabled={disabled}
					/>
					<Input<TRequestBodyCreateProduct>
						id="age"
						label="Age"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
						disabled={disabled}
					/>

					<Row label="Location On Map">
						<div className="relative">
							<input
								id="locationOnMap"
								type="text"
								placeholder="Enter Coordinates or Select on Map"
								disabled={disabled}
								className={`h-10 w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none ${disabled ? 'bg-gray-100 border-none pl-2.5 hover:cursor-no-drop' : 'bg-white'}`}
								{...register('locationOnMap')}
							/>
							<button
								type="button"
								disabled={disabled}
								className="absolute right-0 top-1/2 -translate-y-1/2 transform"
								aria-label="Open map"
							>
								<Map className="h-5 w-5 text-gray-500" />
							</button>
						</div>
					</Row>

					<section className="mb-6">
						<h2 className="mb-3 text-xl font-bold">From our gallery</h2>
						<button
							type="button"
							disabled={disabled}
							className="flex h-[85px] w-[110px] items-center justify-center rounded-md bg-gray-200"
						>
							<Plus className="h-6 w-6 text-gray-500" />
						</button>
					</section>

					{['Schedules'].map((title) => (
						<section key={title} className="mb-6">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="text-xl font-bold">{title}</h2>
								{!disabled && (
									<button
										type="button"
										disabled={disabled}
										onClick={
											title === 'Schedules'
												? (): void => handleAddScheduleOnClick()
												: (): void => {}
										}
										className="flex h-10 items-center gap-1 rounded-full bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
									>
										<Plus className="h-4 w-4" /> ADD{' '}
										{title.toUpperCase()}
									</button>
								)}
							</div>

							<div className=" items-center justify-center rounded-md border text-gray-500">
								{/* No {title.toLowerCase()} have been added yet */}
								{title === 'Schedules' ? (
									<SchedulesBoard
										data={schedules}
										pageSize={5}
										disabled={disabled}
										onViewDetailSchedule={
											handleViewScheduleDetailOnClick
										}
									/>
								) : (
									// title === 'Discounts' && (
									// 	<DiscountBoard data={discounts} />
									// )
									<></>
								)}
							</div>
						</section>
					))}
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
				</form>
			</div>
		</div>
	);
};
