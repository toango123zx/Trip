'use client';

import { JSX } from 'react';

import { Footer, Header } from '@/components';

import { SignInForm } from './components';

const SignInPage = (): JSX.Element => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-grow">
				<div className="flex flex-col md:flex-row h-full">
					<SignInForm />
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default SignInPage;
