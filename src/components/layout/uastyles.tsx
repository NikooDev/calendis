import React from 'react';
import { IUAStyles } from '@Calendis/types/app';

/**
 * Fix UA styles title h1 :
 * A <h1> was found inside an <article>, <aside>, <nav>, or <section> element that does not have an explicit font size set.
 * The font size for such headings will be changed in this browser soon.
 *
 * <noscript> fallback: disables SlideIn effects when JS is off.
 * Forces visibility (opacity: 1) and removes transform/blur so content stays readable.
 */
const UAStyles = ({ isAdmin }: IUAStyles) => {
	// @ts-ignore
	return (
		<>
			<style>
				{`:where(h1) {margin-block: auto;font-size: ${isAdmin ? '2rem' : '3.75rem'};}`}
			</style>
			<noscript>
				<style>
					{`.slidein { opacity: 1 !important; transform: none !important; filter: none !important; }`}
				</style>
			</noscript>
		</>
	);
};

export default UAStyles;