'use client';

import { notification } from 'antd';
import { JSX, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginImages } from '@/assets';
import { userThunk } from '@/features/users';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { TUser } from '@/types';

import { authApi } from '../../authApi';
import { PasswordInput } from '../PasswordInput';
import { SubmitButton } from '../SubmitButton';

type LoginFormInputs = {
	username: string;
	password: string;
};

export const LoginForm = (): JSX.Element => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();
	const [rememberMe, setRememberMe] = useState(false);
	const [loginError, setLoginError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch<TReduxStoreDispatch>();
	const userInformation: TUser = useSelector<TReduxStoreState, TUser>(
		(state: TReduxStoreState) => state.user.userDetail,
	);
	const logged = Boolean(localStorage.getItem('logged'));

	const image = loginImages.loginBackground;

	const onSubmit = async (formData: LoginFormInputs): Promise<void> => {
		setIsSubmitting(true);
		setLoginError(null);

		const data = await authApi.login({
			username: String(formData.username),
			password: String(formData.password),
		});

		if (!data.accessToken) {
			notification.error({
				message: 'Error',
				description: 'Type returns about error',
			});
			return;
		}
		localStorage.setItem('logged', 'true');
		navigate('/');
	};

	useEffect(() => {
		dispatch(userThunk.getMe());
		if (userInformation && logged == true) {
			localStorage.setItem('role', userInformation.roleName);
		}
	}, [dispatch, userInformation, logged]);

	return (
		<div className="container mx-auto px-4 pt-8 pb-28 max-w-5xl">
			<div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg">
				{/* Left side - Image */}
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
						Login{' '}
					</h2>

					{loginError && (
						<div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
							{loginError}
						</div>
					)}

					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-2">
							<p className="mb-1 text-orange-500 text-sm">Username:</p>
							<input
								type="text"
								id="username"
								autoComplete="username"
								{...register('username', {
									required: 'Username is required',
								})}
								className={`w-full bg-[#F8EFE4] p-3 rounded-md ${errors.username ? 'border border-red-500' : 'border-none'} focus:ring-1 focus:ring-[#FF7A22] focus:outline-none transition-colors`}
							/>
							{errors.username && (
								<p className="mt-1 text-xs text-red-700">
									{errors.username.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<PasswordInput
								label="Password: "
								error={errors.password}
								register={register('password', {
									required: 'Password is required',
									minLength: {
										value: 6,
										message: 'Password must be at least 6 characters',
									},
								})}
							/>
							{/* Password errors are now handled by the PasswordInput component */}
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
							disabled={isSubmitting}
							label={isSubmitting ? 'Logging in...' : 'Login'}
						/>
					</form>

					<p className="text-center mt-6 text-gray-700">
						Don't have an account?
						<a
							href="/auth/register"
							className="text-orange-500 hover:underline ml-2.5"
						>
							Register Here
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};
