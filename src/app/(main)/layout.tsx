import React from 'react';
import UAStyles from '@Calendis/components/layout/styles';
import type { IChildren } from '@Calendis/types/app';

const MainLayout = ({ children }: IChildren) => {
	return (
		<>
			<UAStyles isAdmin={true}/>
			{ children }
		</>
	);
};

export default MainLayout;