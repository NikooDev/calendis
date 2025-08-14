import React from 'react';
import UAStyles from '@Calendis/components/layout/uastyles';
import type { IChildren } from '@Calendis/types/app';

const MainLayout = ({ children }: IChildren) => {
	return (
		<>
			<UAStyles isAdmin={false}/>
			{ children }
		</>
	);
};

export default MainLayout;