export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import type { IChildren } from '@Calendis/types/app';
import UAStyles from '@Calendis/components/layout/uastyles';
import AuthBootstrap from '@Calendis/components/layout/auth/authbootstrap';
import { checkAuth } from '@Calendis/utils/functions-server.util';
import { metadatas } from '@Calendis/utils/constants.util';

export const metadata: Metadata = metadatas('Calendis • Administration', 'La planification connectée des tournées de calendriers');

const AdminLayout = async ({ children }: IChildren) => {
	await checkAuth();

	return (
		<>
			<UAStyles isAdmin={true}/>
			<AuthBootstrap/>
			{ children }
		</>
	);
};

export default AdminLayout;