import { JSX } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer, Header } from '@/components';

interface IMainLayoutProps {
	children?: React.ReactNode;
}

export const MainLayout = ({ children }: IMainLayoutProps): JSX.Element => {
	return (
		<div className="flex flex-col min-h-screen w-full overflow-x-hidden">
			{/* Fixed header at top */}
			<Header className="sticky top-0 z-10 shadow-sm" />

			{/* Main content */}
			<main className="flex-1 flex flex-col">{children || <Outlet />}</main>

			{/* Footer */}
			<Footer />
		</div>
	);
};
