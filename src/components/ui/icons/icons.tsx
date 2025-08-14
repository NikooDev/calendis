import React from 'react';
import { IconProps, IconVariant } from '@Calendis/types/ui';
import { twMerge } from 'tailwind-merge';

export const Icon = React.forwardRef<SVGSVGElement, IconProps>((
	{
		size = 24,
		tone = 'currentColor',
		strokeWidth = 1.75,
		variant = 'stroke',
		decorative = true,
		d,
		paths,
		title,
		className,
		viewBox = '0 0 24 24',
		children,
		...rest
	},
	ref
) => {
	const titleId = React.useId();
	const a11yProps: Partial<React.SVGProps<SVGSVGElement>> = decorative
		? { 'aria-hidden': true, focusable: false }
		: title
			? { role: 'img', 'aria-labelledby': titleId }
			: { role: 'img' };

	const content: React.ReactNode = (
		<>
			{ title ? <title id={titleId}>{title}</title> : null }
			{ d ? <path d={d}/> : null }
			{ paths?.map((pd, i) => <path key={i} d={pd}/>) }
			{ children }
		</>
	);

	const pixel = `${size}px`;

	const common = {
		ref,
		viewBox,
		width: pixel,
		height: pixel,
		className: twMerge('shrink-0 inline-block align-middle', className),
		...a11yProps,
		...rest
	} as const;

	if (variant === 'fill') {
		return (
			<svg {...common} fill={tone} stroke="none">
				{ content }
			</svg>
		);
	}

	return (
		<svg
			{...common}
			fill="none"
			stroke={tone}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			vectorEffect="non-scaling-stroke"
		>
			{ content }
		</svg>
	);
});

export const createIcon = ({
	name,
	d,
	paths,
	children,
	viewBox = '0 0 24 24',
	variant = 'stroke'
}: {
	name: string;
	d?: string;
	paths?: string[];
	children?: React.ReactNode;
	viewBox?: string;
	variant?: IconVariant;
}) => {
	const C = React.memo(React.forwardRef<SVGSVGElement, Omit<IconProps, 'd' | 'paths' | 'children'>>(
		(props, ref) => (
			<Icon ref={ref} d={d} paths={paths} viewBox={viewBox} variant={variant} {...props}>
				{ children }
			</Icon>
		)
	));

	C.displayName = name;
	return C;
};