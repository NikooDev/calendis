'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import './cubes.css';

const BASE_DUR = [12, 12, 12, 18, 12, 12, 12, 45, 35, 11];
const DELAYS   = [1,  2,  4,  1,  1,  3,  7, 15,  2,  1];
const SPEED_DUR= [4,  6,  2,  5, 6, 4, 3.5, 15, 10, 4.5];

const Cubes = () => {
	const pathname = usePathname();
	const nodesRef = useRef<HTMLDivElement[]>([]);
	const animsRef = useRef<Animation[]>([]);

	const fast = pathname === '/login';

	const setNode = (i: number) => (el: HTMLDivElement | null) => {
		if (el) nodesRef.current[i] = el;
	};

	const cubes = useMemo(
		() => Array.from({ length: 10 }).map((_, i) => (
			<div key={i} ref={setNode(i)} className="cube"/>
		)),
		[]
	);

	const keyframes = useMemo<Keyframe[]>(
		() => [
			{ transform: 'translateY(0) rotate(0deg)',    backgroundColor: '#e60076', opacity: 1, borderRadius: '10%' },
			{ transform: 'translateY(-1000px) rotate(720deg)', backgroundColor: '#3131c3', opacity: 0, borderRadius: '50%' },
		],
		[]
	);

	useLayoutEffect(() => {
		if (animsRef.current.length) return;

		animsRef.current = nodesRef.current.map((el, i) => {
			return el.animate(keyframes, {
				duration: BASE_DUR[i] * 1000,
				delay: DELAYS[i] * 1000,
				iterations: Infinity,
				easing: 'ease-in-out',
				fill: 'both',
			});
		});

		return () => {
			animsRef.current.forEach(a => a.cancel());
			animsRef.current = [];
		};
	}, [keyframes]);

	useEffect(() => {
		animsRef.current.forEach((anim, i) => {
			const base = BASE_DUR[i];
			const target = fast ? SPEED_DUR[i] : BASE_DUR[i];
			anim.playbackRate = base / target;
		});
	}, [fast]);

	return (
		<div className="cubes" aria-hidden={true}>
			{ cubes }
		</div>
	);
};

export default Cubes;