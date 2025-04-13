import { JSX } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer, Header } from '@/components';

interface IMainLayoutProps {
	children?: React.ReactNode;
}

export const MainLayout = ({ children }: IMainLayoutProps): JSX.Element => {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Fixed header at top */}
			<Header className="sticky top-0 z-50 shadow-sm" />

			{/* Main content */}
			<main className="flex justify-center items-center">
				{children || <Outlet />}
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
};
