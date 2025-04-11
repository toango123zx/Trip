'use client';

import { JSX, useRef, useState } from 'react';

import { PasswordInput } from '../PasswordInput';
import { SubmitButton } from '../SubmitButton';

export const SignInForm = (): JSX.Element => {
	const username = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const [rememberMe, setRememberMe] = useState(false);

	const image =
		'https://i.pinimg.com/736x/58/fc/ef/58fcef99fc5f63e28b69d7a6777c7b65.jpg';

	const handlerSubmitClick = (): void => {};

	return (
		<div className="container mx-auto px-4 py-8 max-w-5xl">
			<div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg">
				{/* Left side - Image with overlay text */}
				<div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
					<img
						src={image}
						alt="Coastal view with boats"
						className="absolute inset-0 w-full h-full object-cover"
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="flex flex-col items-center rotate-[-90deg] md:rotate-0 transform md:translate-x-0">
							<h2 className="text-white text-6xl font-bold tracking-wider">
								<span className="text-white">S</span>
								<span className="text-white">I</span>
								<span className="text-white">G</span>
								<span className="text-white">N</span>
							</h2>
							<h2 className="text-orange-500 text-6xl font-bold tracking-wider">
								<span>I</span>
								<span>N</span>
							</h2>
						</div>
					</div>
				</div>

				{/* Right side - Sign in form */}
				<div className="w-full md:w-1/2 bg-[#f5f5f0] p-8 md:p-12 flex flex-col justify-center">
					<h2 className="text-4xl font-bold text-orange-500 mb-8">Sign In</h2>

					<form className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="username" className="text-orange-500 text-sm">
								Username:
							</label>
							<input
								type="text"
								id="username"
								ref={username}
								autoComplete="username"
								className="w-full p-3 rounded-md bg-orange-100 border-none focus:ring-2 focus:ring-orange-300"
							/>
						</div>

						<div className="space-y-2">
							<PasswordInput label="Password: " value={password} />
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
						<SubmitButton onClick={handlerSubmitClick} />
					</form>

					<p className="text-center mt-6 text-gray-700">
						Don't have an account?
						<a
							href="/signup"
							className="text-orange-500 hover:underline ml-1"
						>
							Sign Up Here
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignInForm;
