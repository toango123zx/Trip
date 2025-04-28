import React, { JSX } from 'react';

import { UsersList } from '@/features';
import { MainLayout } from '@/layouts';

const UsersManagement = (): JSX.Element => {
	return (
		<MainLayout>
			<UsersList />
		</MainLayout>
	);
};

export default UsersManagement;
