'use client';

import { JSX } from 'react';

import { RegisterForm } from '@/features';
import { MainLayout } from '@/layouts';

const RegisterPage = (): JSX.Element => {
	return (
		<MainLayout>
			<RegisterForm />
		</MainLayout>
	);
};

export default RegisterPage;
