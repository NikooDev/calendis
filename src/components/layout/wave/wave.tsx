'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { WaveAnimated } from '@Calendis/components/ui/icons';
import './wave.css';

const Wave = () => {
	const [path, setPath] = useState('/');
	const pathname = usePathname();

	useEffect(() => {
		setPath(pathname);
	}, [pathname]);

	useEffect(() => {
		document.documentElement.style.overflow = 'hidden';

		const t = setTimeout(() => {
			document.documentElement.style.overflow = '';
		}, 600);

		return () => clearTimeout(t);
	}, []);

	return (
		<div className="wave">
			<WaveAnimated/>
			<div className="wave-wrapper">
				<div className="wave-master"/>
			</div>
			<div className={twMerge('wave-bg w-full relative transition-all duration-700 ease-[cubic-bezier(0.40,0.00,0.20,1.00)]', path === '/login' ? 'h-dvh' : 'h-0')}/>
		</div>
	);
};

export default Wave;