'use client';

import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ISlideIn } from '@Calendis/types/animation';
import { twMerge } from 'tailwind-merge';
import './animation.css';

const SlideIn = ({
	delay = 0,
	duration = 300,
	direction = 'bottom',
	distance = 20,
	trigger = 'mount',
	once = true,
	as: Tag = 'div',
	lcpSafe = false,
	className,
	children,
	...rest
}: ISlideIn) => {
	const ref = useRef<HTMLElement>(null);
	const [armed, setArmed] = useState(false);
	const [ready, setReady] = useState(false);
	const ranRef = useRef(false);

	const play = useCallback(() => {
		if (ranRef.current) return;

		setArmed(true);

		let raf1: number | null = null;
		let raf2: number | null = null;

		raf1 = requestAnimationFrame(() => {
			raf2 = requestAnimationFrame(() => {
				setReady(true);
				ranRef.current = true;
			});
		});

		return () => {
			if (raf1) cancelAnimationFrame(raf1);
			if (raf2) cancelAnimationFrame(raf2);
		};
	}, []);

	useLayoutEffect(() => {
		if (trigger === 'mount') {
			return play();
		}
	}, [trigger, play]);

	useEffect(() => {
		if (process.env.NODE_ENV !== 'production' && ranRef.current) return;

		if (trigger === 'view') {
			const el = ref.current;
			if (!el) return;

			const io = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					play();
					if (once) io.disconnect();
				} else if (!once) {
					setReady(false);
					setArmed(false);
				}
			}, { threshold: 0.25 });

			io.observe(el);
			return () => io.disconnect();
		}

		if (trigger === 'image') {
			const el = ref.current;
			if (!el) return;

			const wireImage = (img: HTMLImageElement) => {
				const fire = () => { play(); };

				if (img.decode) {
					img.decode().catch(() => {}).finally(fire);
				} else if (img.complete && img.naturalWidth > 0) {
					fire();
				} else {
					img.addEventListener('load', fire, { once: true });
					img.addEventListener('error', fire, { once: true });

					return () => {
						img.removeEventListener('load', fire);
						img.removeEventListener('error', fire);
					};
				}
			};

			const mo = new MutationObserver(() => {
				const candidate = el.querySelector('img') as HTMLImageElement | null;
				if (candidate) {
					wireImage(candidate);
					mo.disconnect();
				}
			});

			const immediate = el.querySelector('img') as HTMLImageElement | null;
			if (immediate) {
				wireImage(immediate);
			} else {
				mo.observe(el, { childList: true, subtree: true });
			}

			return () => mo.disconnect();
		}
	}, [trigger, once, play]);

	const d = `${distance}px`;
	let tx = '0px', ty = '0px';
	if (direction === 'left') tx = `-${d}`;
	if (direction === 'right') tx = d;
	if (direction === 'top') ty = `-${d}`;
	if (direction === 'bottom') ty = d;

	return (
		<Tag
			ref={ref}
			className={twMerge('slidein', armed && 'armed', ready && 'ready', className)}
			style={{
				['--delay']: `${delay}ms`,
				['--duration']: `${duration}ms`,
				['--tx']: tx,
				['--ty']: ty,
				['--init-opacity']: lcpSafe ? 1 : 0,
			}}
			{...rest}
		>
			{children}
		</Tag>
	);
};

export default memo(SlideIn);