import React from 'react';
import Styles from '@Calendis/components/layout/styles';
import type { IChildren } from '@Calendis/types/app';

const MainLayout = ({ children }: IChildren) => {
	return (
		<>
			<Styles/>
			{ children }
		</>
	);
};

export default MainLayout;