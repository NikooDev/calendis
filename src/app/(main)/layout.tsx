import React from 'react';
import UAStyles from '@Calendis/components/layout/uastyles';
import Wave from '@Calendis/components/layout/wave/wave';
import Cubes from '@Calendis/components/layout/cubes/cubes';
import Footer from '@Calendis/components/partials/footer';
import type { IChildren } from '@Calendis/types/app';

const MainLayout = ({ children }: IChildren) => {
	return (
		<>
			<UAStyles isAdmin={false}/>
			<Wave/>
			{ children }
			<Cubes/>
			<Footer/>
		</>
	);
};

export default MainLayout;