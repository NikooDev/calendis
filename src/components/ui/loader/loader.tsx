import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { LoaderProps } from '@Calendis/types/ui';
import './loader.css';

const Loader = ({
	size = 50,
	className,
	color = '#000',
	strokeWidth = 5
}: LoaderProps) => {
	return (
		<svg className={twMerge('spinner', className)} width={size} height={size} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
			<circle className="path" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" cx="33" cy="33" r="30"></circle>
		</svg>
	);
};

export default Loader;