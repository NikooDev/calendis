export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import UAStyles from '@Calendis/components/layout/uastyles';
import type { IChildren } from '@Calendis/types/app';
import { checkAuth } from '@Calendis/utils/functions-server.util';

const AdminLayout = async ({ children }: IChildren) => {
	await checkAuth();

	return (
		<>
			<UAStyles isAdmin={true}/>
			{ children }
		</>
	);
};

export default AdminLayout;