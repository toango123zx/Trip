'use client';

import { X, Save, Plus, Map, Trash2 } from 'lucide-react';
import { JSX, useState, useEffect, useMemo } from 'react';
import {
	FieldErrors,
	SubmitHandler,
	useForm,
	UseFormReturn,
	UseFormSetValue,
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { ComboBox } from '@/components';
import { locationThunk } from '@/features/location';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';

import { TRequestBodyCreateProduct } from '../../product.type';

type FieldErr = FieldErrors<TRequestBodyCreateProduct>;

type TError = {
	id: keyof TRequestBodyCreateProduct;
	errors: FieldErr;
};

type TRow = {
	label: string;
	required?: boolean;
	children: React.ReactNode;
	top?: boolean;
};

type TInputProps = {
	id: keyof TRequestBodyCreateProduct;
	label: string;
	defaultValue?: string;
	register: ReturnType<typeof useForm<TRequestBodyCreateProduct>>['register'];
	errors: FieldErr;
	required?: boolean;
	disabled?: boolean;
	type?: string;
	validate?: (value: string | number | boolean) => string | boolean;
};

type TTextareaProps = {
	id: keyof TRequestBodyCreateProduct;
	label: string;
	register: ReturnType<typeof useForm<TRequestBodyCreateProduct>>['register'];
	required?: boolean;
	errors: FieldErr;
};

type TSelect = {
	id: keyof TRequestBodyCreateProduct;
	label: string;
	setValue: UseFormSetValue<TRequestBodyCreateProduct>;
	errors: FieldErr;
	options: { id: string; value: string; label: string; city?: string }[];
	required?: boolean;
	placeholder?: string;
	disabled?: boolean;
	defaultValue?: string;
	name?: keyof TRequestBodyCreateProduct;
};

type TProductFormProps = {
	form: UseFormReturn<TRequestBodyCreateProduct>;
	remove?: boolean;
	onSubmit?: SubmitHandler<TRequestBodyCreateProduct>;
	onCancel?: () => void;
};

const Required = (): JSX.Element => (
	<span className="text-red-600" aria-hidden>
		*
	</span>
);

const ErrorText = ({ id, errors }: TError): JSX.Element => (
	<p id={`${id}-error`} className="min-h-[1.25rem] text-sm text-red-600">
		{errors[id]?.message as string}
	</p>
);

const Row = ({ label, required, children, top }: TRow): JSX.Element => (
	<div
		className={`grid grid-cols-[260px_1fr] ${top ? 'items-start' : 'items-center'} mb-4`}
	>
		<label className="font-medium text-gray-800">
			{label}
			{required && <Required />}
		</label>
		{children}
	</div>
);

const Input = ({
	id,
	label,
	defaultValue,
	register,
	errors,
	required,
	disabled = false,
	type = 'text',
	validate,
}: TInputProps): JSX.Element => (
	<Row label={label} required={required}>
		<div>
			<input
				id={id as string}
				type={type}
				aria-invalid={errors[id] ? 'true' : undefined}
				aria-describedby={`${id}-error`}
				defaultValue={defaultValue}
				disabled={disabled}
				className={`h-10 w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none ${disabled ? 'bg-gray-100 border-none pl-2.5' : 'bg-white'}`}
				{...register(id, {
					...(required && { required: `${label} is required` }),
					...(type === 'number' && { valueAsNumber: true }),
					...(validate && { validate: validate }),
					setValueAs: (value) => value.trim(),
				})}
			/>
			<ErrorText id={id} errors={errors} />
		</div>
	</Row>
);

const Textarea = ({
	id,
	label,
	required,
	register,
	errors,
}: TTextareaProps): JSX.Element => (
	<Row label={label} top>
		<div>
			<textarea
				id={id as string}
				className="h-[100px] w-full rounded-md bg-white-100 p-4 border border-gray-300 focus:outline-none"
				{...register(id, {
					...(required && { required: `${label} is required` }),
					setValueAs: (value) => value.trim(),
				})}
			/>
			<ErrorText id={id} errors={errors} />
		</div>
	</Row>
);

const Select = ({
	id,
	label,
	setValue,
	errors,
	options,
	required,
	placeholder,
	disabled = false,
	defaultValue,
	name,
}: TSelect): JSX.Element => {
	const [selectedOption, setSelectedOption] = useState<{
		id: string;
		value: string;
		label: string;
		city?: string;
	} | null>(null);

	useEffect(() => {
		const option = options.find((o) => o.label === defaultValue);
		if (option) {
			setSelectedOption(option);
		}
	}, [options, defaultValue]);

	useEffect(() => {
		const fieldName = name || id;
		setValue(fieldName, selectedOption?.value || '');
	}, [selectedOption, setValue, name, id]);

	return (
		<Row label={label} required={required}>
			<ComboBox
				options={options}
				selectedOption={selectedOption}
				setSelectedOption={setSelectedOption}
				placeholder={placeholder}
				disabled={disabled}
			/>
			<ErrorText id={id} errors={errors} />
		</Row>
	);
};

export const ProductForm = ({
	form,
	remove = true,
	onSubmit,
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

	const handleRemoveOnClick = (): void => {};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 sm:px-20"
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
						{remove && (
							<button
								type="button"
								onClick={handleRemoveOnClick}
								className="flex h-10 items-center gap-1 rounded-md border border-red-500 bg-red-500 text-white px-4 py-2 hover:bg-red-700"
							>
								<Trash2 className="h-5 w-5" /> Remove
							</button>
						)}
						<button
							type="submit"
							onClick={onSubmit && handleSubmit(onSubmit)}
							className="flex h-10 items-center gap-1 rounded-md border border-orange-500 bg-orange-500  px-4 py-2 text-white hover:bg-orange-600"
						>
							<Save className="h-5 w-5" /> Save
						</button>
					</div>
				</header>

				{/* Form */}
				<form
					className="px-6 pb-8 pt-6"
					onSubmit={onSubmit && handleSubmit(onSubmit)}
				>
					<Input
						id="name"
						label="Product Name"
						required
						register={register}
						errors={errors}
					/>
					<Select
						id="locationId"
						label="Location On System"
						required
						defaultValue={watch('locationId')}
						setValue={setValue}
						errors={errors}
						options={options}
						placeholder="Select location"
					/>
					<Textarea
						id="description"
						label="Description"
						register={register}
						errors={errors}
						required
					/>
					<Input
						id="cityName"
						label="Destination"
						defaultValue={watch('cityName')}
						register={register}
						errors={errors}
						// required
						disabled
					/>
					<Input
						id="time"
						label="Time (Hour)"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
					/>
					<Input
						id="quantityAvailable"
						label="Quantity (Person)"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
					/>
					<Input
						id="age"
						label="Age"
						register={register}
						errors={errors}
						required
						type="number"
						validate={validateGreaterThanZero}
					/>

					<Row label="Location On Map">
						<div className="relative">
							<input
								id="locationOnMap"
								type="text"
								placeholder="Enter Coordinates or Select on Map"
								className="h-10 w-full border-b border-gray-300 focus:border-gray-500 focus:outline-none"
								{...register('locationOnMap')}
							/>
							<button
								type="button"
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
							className="flex h-[85px] w-[110px] items-center justify-center rounded-md bg-gray-200"
						>
							<Plus className="h-6 w-6 text-gray-500" />
						</button>
					</section>

					{['Schedules', 'Discounts'].map((title) => (
						<section key={title} className="mb-6">
							<div className="mb-3 flex items-center justify-between">
								<h2 className="text-xl font-bold">{title}</h2>
								<button
									type="button"
									className="flex h-10 items-center gap-1 rounded-full bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
								>
									<Plus className="h-4 w-4" /> ADD {title.toUpperCase()}
								</button>
							</div>
							<div className="flex h-[80px] items-center justify-center rounded-md border p-6 text-gray-500">
								No {title.toLowerCase()} have been added yet
							</div>
						</section>
					))}
				</form>
			</div>
		</div>
	);
};
