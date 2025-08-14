import React from 'react';

export type IconVariant = 'stroke' | 'fill';

export type IconProps = Omit<React.SVGProps<SVGSVGElement>,
	| 'color'
	| 'width'
	| 'height'
> & {
	/**
	 * Pixel size applied to both `width` and `height` of the SVG.
	 * Prefer this over setting width/height separately.
	 * @default 24
	 */
	size?: number;

	/**
	 * Color used for the icon:
	 * - With `variant: 'stroke'`, applied to `stroke`.
	 * - With `variant: 'fill'`, applied to `fill`.
	 * Typically `currentColor` or a hex/RGB value.
	 * @default 'currentColor'
	 */
	tone?: string;

	/**
	 * Stroke thickness when `variant` is 'stroke'.
	 * Accepts a number (px) or CSS length string.
	 * @default 1.75
	 */
	strokeWidth?: number | string;

	/**
	 * Rendering mode for the icon paths: outline ('stroke') or solid ('fill').
	 * @default 'stroke'
	 */
	variant?: IconVariant;

	/**
	 * Marks the icon as purely decorative for screen readers.
	 * - `true` → sets `aria-hidden="true"`.
	 * - `false` → exposes the icon; provide a meaningful `title`.
	 * @default false
	 */
	decorative?: boolean;

	/**
	 * Single SVG path `d` attribute. Convenience for simple icons.
	 * Ignored if `children` provide custom content.
	 */
	d?: string;

	/**
	 * Multiple SVG path `d` strings. Rendered in order.
	 * Useful for multi-path icons without writing custom children.
	 */
	paths?: string[];

	/**
	 * Accessible title announced by screen readers when `decorative` is false.
	 * Not rendered when `decorative` is true.
	 */
	title?: string;

	/**
	 * Extra CSS classes applied to the root `<svg>`.
	 */
	className?: string;

	/**
	 * SVG viewBox defining the internal coordinate system.
	 * @default '0 0 24 24'
	 */
	viewBox?: string;

	/**
	 * Custom SVG content (e.g., `<path>`, `<g>`, `<rect>`).
	 * If provided, takes precedence over `d`/`paths`.
	 */
	children?: React.ReactNode;
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Render the input using the admin visual theme (colors/spacing).
	 */
	themeAdmin: boolean;

	/**
	 * Text label associated with the input (also used for accessibility).
	 */
	label: string;

	/**
	 * Error message to display and/or flag the field as invalid.
	 */
	error?: string;

	/**
	 * Pending/loading state (e.g., while submitting); often disables the field.
	 */
	pending?: boolean;

	/**
	 * Extra class names applied to the outer wrapper/container element.
	 */
	containerClassName?: string;

	/**
	 * Extra class names applied directly to the <input> element.
	 */
	inputClassName?: string;

	/**
	 * Whether the field should appear as “filled” (useful for floating labels).
	 */
	filled?: boolean;
}

export interface LoaderProps {
	/**
	 * Overall diameter of the loader in pixels.
	 * @default 24
	 */
	size?: number;

	/**
	 * Additional CSS classes applied to the root element.
	 */
	className?: string;

	/**
	 * Stroke or fill color of the loader (any valid CSS color).
	 * @default 'currentColor'
	 */
	color?: string;

	/**
	 * Thickness of the loader stroke (in pixels).
	 * @default 2
	 */
	strokeWidth?: number;
}