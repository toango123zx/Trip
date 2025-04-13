'use client';

import { JSX, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginImages } from '@/assets';

import { LoginApi } from '../../authApi';
import { PasswordInput } from '../PasswordInput';
import { SubmitButton } from '../SubmitButton';

export const LoginForm = (): JSX.Element => {
	const username = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [rememberMe, setRememberMe] = useState(false);
	const navigate = useNavigate();

	const image = loginImages.loginBackground;

	const handlerSubmitClick = async (): Promise<void> => {
		if (!username.current?.value || !password.current?.value) {
			alert('Please fill in username and password');
			return;
		}

		const data = await LoginApi(
			String(username.current?.value),
			String(password.current?.value),
		);
		if (!data.accessToken) {
			return;
		}

		localStorage.setItem('accessToken', data.accessToken);

		navigate('/');
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
						Login{' '}
					</h2>

					<form className="space-y-6">
						<div className="space-y-2">
							<p className="mb-1 text-orange-500 text-sm ">Username:</p>
							<input
								type="text"
								id="username"
								ref={username}
								autoComplete="username"
								className="w-full bg-[#F8EFE4]  p-3 rounded-md  border-none focus:ring-1 focus:ring-[#FF7A22] focus:outline-none transition-colors"
							/>
						</div>

						<div className="space-y-2">
							<PasswordInput label="Password: " valueRef={password} />
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
						<SubmitButton label="Login" onClick={handlerSubmitClick} />
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
