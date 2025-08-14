import React from 'react';

export interface ISlideIn extends React.HTMLAttributes<HTMLElement> {
	/**
	 * Delay before the animation starts (in milliseconds).
	 * @default 0
	 */
	delay?: number;

	/**
	 * Duration of the animation (in milliseconds).
	 * @default 350
	 */
	duration?: number;

	/**
	 * Direction from which the element enters the viewport.
	 * @default 'bottom'
	 */
	direction?: 'bottom' | 'top' | 'left' | 'right';

	/**
	 * Initial offset distance used for the slide-in transform (in pixels).
	 * @default 12
	 */
	distance?: number;

	/**
	 * When to trigger the animation:
	 * - 'mount': start on component mount
	 * - 'view': start when the element enters the viewport (IntersectionObserver)
	 * - 'image': start when a descendant img (including next/image) finishes loading
	 * @default 'mount'
	 */
	trigger?: 'mount' | 'view' | 'image';

	/**
	 * If true, the animation plays only the first time it becomes visible.
	 * Relevant when `trigger` is 'view'.
	 * @default true
	 */
	once?: boolean;

	/**
	 * Wrapper element/component to render (e.g., 'div', 'section', or a custom component).
	 * @default 'div'
	 */
	as?: React.ElementType;

	/**
	 * Avoids setting `opacity: 0` on initial render to preserve LCP measurement.
	 * Useful when the wrapped element is the LCP candidate.
	 * @default false
	 */
	lcpSafe?: boolean;

	/**
	 * Content to be animated.
	 */
	children: React.ReactNode;
}