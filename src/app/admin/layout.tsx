import React from 'react';
import UAStyles from '@Calendis/components/layout/uastyles';
import type { IChildren } from '@Calendis/types/app';

const AdminLayout = ({ children }: IChildren) => {
	return (
		<>
			<UAStyles isAdmin={true}/>
			{ children }
		</>
	);
};

export default AdminLayout;