'use client';

import { JSX } from 'react';

import { Footer, Header } from '@/components';
import { SignInForm } from '@/features';

const SignInPage = (): JSX.Element => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-grow">
				<div className="flex flex-col md:flex-row h-full">
					{/* Left side - Image with overlay text */}
					<div className="relative w-full md:w-1/2 h-[300px] md:h-auto">
						<div
							className="absolute inset-0 bg-cover bg-center"
							style={{
								backgroundImage: "url('/src/assets/images/beach.jpg')",
							}}
						></div>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="flex items-center">
								<div className="text-white text-[120px] md:text-[180px] font-bold transform -rotate-90 origin-center">
									SIGN
								</div>
								<div className="text-[#FF7A22] text-[120px] md:text-[180px] font-bold transform -rotate-90 origin-center">
									IN
								</div>
							</div>
						</div>
					</div>

					{/* Right side - Sign in form */}
					<div className="w-full md:w-1/2 bg-[#F5F2EA] p-8 md:p-12 flex items-center justify-center">
						<SignInForm />
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default SignInPage;
