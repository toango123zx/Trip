'use client';

import { notification } from 'antd';
import { isEmail, matches } from 'class-validator';
import { JSX, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { loginImages } from '@/assets';

import { authApi } from '../../authApi';
import { TRequestBodyRegisterApi } from '../../authType';
import { PasswordInput } from '../PasswordInput';
import { SubmitButton } from '../SubmitButton';

type TRegisterFromInput = {
	username: string;
	password: string;
	email: string;
	name: string;
	confirmPassword: string;
};

export const RegisterForm = (): JSX.Element => {
	const [rememberMe, setRememberMe] = useState(false);
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TRegisterFromInput>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const image = loginImages.loginBackground;

	const handlerSubmitClick = async (fromData: TRegisterFromInput): Promise<void> => {
		try {
			notification.config({
				duration: 5,
			});
			setIsSubmitting(true);
			const registerInformation: TRequestBodyRegisterApi = {
				username: String(fromData.username),
				password: String(fromData.password),
				email: String(fromData.email),
				name: String(fromData.name),
				confirmPassword: String(fromData.confirmPassword),
			};

			if (registerInformation.password !== registerInformation.confirmPassword) {
				notification.error({
					message: 'Error',
					description: 'Confirm passwords do not match',
				});
				return;
			}

			if (!isEmail(registerInformation.email)) {
				notification.error({
					message: 'Error',
					description: 'Invalid email address',
				});
				return;
			}

			if (
				!matches(
					registerInformation.password,
					/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/,
				)
			) {
				notification.error({
					message: 'Error',
					description:
						'Password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character',
				});
				return;
			}

			await authApi.register(registerInformation);

			navigate('/auth/login');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto px-4 pt-8 pb-28 max-w-5xl">
			<div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg">
				{/* Left side - Image with overlay text */}
				<div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
					<img
						src={image}
						alt="Coastal view with boats"
						className="absolute inset-0 w-full h-full object-cover"
					/>
				</div>

				{/* Right side - Sign in form */}
				<div className="w-full md:w-1/2 bg-[#f5f5f0] p-8 md:p-12 flex flex-col justify-center">
					<h2 className="text-7xl text-center font-bold text-orange-500 mb-8">
						Register
					</h2>

					<form
						className="space-y-6"
						onSubmit={handleSubmit(handlerSubmitClick)}
					>
						<div className="flex flex-row justify-center items-start gap-5">
							<div className="space-y-2">
								<p className="mb-1 text-orange-500 text-sm ">Username:</p>
								<input
									type="text"
									id="username"
									autoComplete="username"
									{...register('username', {
										required: 'Username is required',
									})}
									placeholder="username"
									className="w-full bg-[#F8EFE4]  p-3 rounded-md  border-none focus:ring-1 focus:ring-[#FF7A22] focus:outline-none transition-colors"
								/>
								{errors.username && (
									<p className="mt-1 text-xs text-red-700">
										{errors.username.message}
									</p>
								)}
							</div>
							<div className="space-y-2">
								<p className="mb-1 text-orange-500 text-sm ">Name:</p>
								<input
									type="text"
									id="name"
									{...register('name', {
										required: 'Name is required',
									})}
									autoComplete="name"
									placeholder="name"
									className="w-full bg-[#F8EFE4]  p-3 rounded-md  border-none focus:ring-1 focus:ring-[#FF7A22] focus:outline-none transition-colors"
								/>
								{errors.name && (
									<p className="mt-1 text-xs text-red-700">
										{errors.name.message}
									</p>
								)}
							</div>
						</div>
						<div className="space-y-2">
							<p className="mb-1 text-orange-500 text-sm ">Email:</p>
							<input
								type="text"
								id="email"
								{...register('email', { required: 'Email is required' })}
								autoComplete="email"
								placeholder="email"
								className="w-full bg-[#F8EFE4]  p-3 rounded-md  border-none focus:ring-1 focus:ring-[#FF7A22] focus:outline-none transition-colors"
							/>
							{errors.email && (
								<p className="mt-1 text-xs text-red-700">
									{errors.email.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<PasswordInput
								label="Password: "
								register={register('password', {
									required: 'Password is required',
								})}
								error={errors.password}
								placeholder="password"
							/>
						</div>

						<div className="space-y-2">
							<PasswordInput
								label="Confirm password: "
								register={register('confirmPassword', {
									required: 'Confirm password is required',
								})}
								error={errors.confirmPassword}
								placeholder="confirm password"
							/>
						</div>

						<div className="flex justify-between items-center">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="remember"
									checked={rememberMe}
									onChange={() => setRememberMe(!rememberMe)}
									className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
								/>

								<label
									htmlFor="remember"
									className="text-gray-700 text-sm"
								>
									Remember me
								</label>
							</div>

							<a
								href="/forgot-password"
								className="text-orange-500 text-sm hover:underline"
							>
								Forgot your password?
							</a>
						</div>
						<SubmitButton
							label={isSubmitting ? 'Registering...' : 'Register'}
						/>
					</form>

					<p className="text-center mt-6 text-gray-700">
						Already have an account?
						<a
							href="/auth/login"
							className="text-orange-500 hover:underline ml-2.5"
						>
							Login Here
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};
