'use client';

import { JSX } from 'react';

import { Footer, Header } from '@/components';
import { LoginForm } from '@/features';

const LoginPage = (): JSX.Element => {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-grow">
				<div className="flex flex-col md:flex-row h-full">
					<LoginForm />
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default LoginPage;
