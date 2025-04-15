'use client';

import { JSX } from 'react';

import { LoginForm } from '@/features';
import { MainLayout } from '@/layouts';

const LoginPage = (): JSX.Element => {
	return (
		<MainLayout>
			<LoginForm />
		</MainLayout>
	);
};

export default LoginPage;
