'use client';

import { JSX, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { ProductForm, scheduleThunk, TRequestBodyCreateSchedule } from '@/features';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TProductDetail } from '@/types';

import { TRequestBodyCreateProduct } from '../../product.type';
import { productThunk } from '../../productThunk';
import { notificationUtils } from '@/utils/notificationUtils';

type TAddProductProps = {
	onCancel?: () => void;
};

// Thêm cấu hình Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const AddProduct = ({
	onCancel = (): void => {},
}: TAddProductProps): JSX.Element => {
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [locationDescription, setLocationDescription] = useState<string>('');
	const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
	const form = useForm<TRequestBodyCreateProduct>({});

	const dispatch = useDispatch<TReduxStoreDispatch>();

	const loadingApi = useSelector((s: TReduxStoreState) => s.product.loading);
	const errorApi = useSelector((s: TReduxStoreState) => s.product.error);
	const [schedules, setSchedules] = useState<TRequestBodyCreateSchedule[]>([]);
	const productDetail = useSelector<TReduxStoreState, TProductDetail>(
		(s: TReduxStoreState) => s.product.productDetail,
	);

	const onSubmit: SubmitHandler<TRequestBodyCreateProduct> = (data) => {
		const formattedData = {
			...data,
			time: Number(data.time),
			quantityAvailable: Number(data.quantityAvailable),
			age: Number(data.age),
		};

		setHasSubmitted(true);
		dispatch(productThunk.createProduct(formattedData));
	};

	const generateLocationDescription = async (name: string, description?: string, location?: string) => {
		if (!name) {
			notificationUtils.warning();
			return;
		}

		setIsGeneratingDescription(true);

		const prompt = `
Hãy viết một mô tả chi tiết hơn (100- 150 từ) để giới thiệu địa điểm du lịch "${name}" ${location && `tại ${location}`} ${description && `và với nôi dung mô tả cơ bản là ${description}`}. 
Nội dung cần hấp dẫn, truyền cảm hứng, và nêu bật điểm đặc sắc của địa danh này
Kết quả môt là một đoạn văn mô tả duy nhất
`;

		try {
			const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite-preview-06-17' });
			const result = await model.generateContent(prompt);
			const description = result.response.text();
			form.setValue('description', description, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true,
			});

			setLocationDescription(description);
			notificationUtils.success();
		} catch (error: any) {
			console.error('Lỗi tạo mô tả:', error);
			notificationUtils.error({message: error.response.data.message});
		} finally {
			setIsGeneratingDescription(false);
		}
	};

	useEffect(() => {
		if (
			schedules.length > 0 &&
			hasSubmitted &&
			!loadingApi &&
			!errorApi &&
			productDetail?.id
		) {
			schedules.forEach((schedule) => {
				dispatch(
					scheduleThunk.createSchedule({
						productId: productDetail.id,
						schedule,
					}),
				);
			});

			setSchedules([]);
		}
		if (hasSubmitted && !loadingApi && !errorApi) {
			onCancel();
		}
	}, [
		dispatch,
		hasSubmitted,
		loadingApi,
		errorApi,
		onCancel,
		schedules,
		productDetail.id,
	]);

	return (
		<div>
			<ProductForm
				form={form}
				isRemove={false}
				schedules={schedules}
				setSchedules={setSchedules}
				isCreate={true}
				onSubmit={onSubmit}
				onCancel={onCancel}
				generateLocationDescription={generateLocationDescription}
				locationDescription={locationDescription}
				isGeneratingDescription={isGeneratingDescription}
			/>
		</div>
	);
};
