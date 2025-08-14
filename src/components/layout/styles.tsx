import React from 'react';
import { IUAStyles } from '@Calendis/types/app';

/**
 * Fix UA styles title h1 :
 * A <h1> was found inside an <article>, <aside>, <nav>, or <section> element that does not have an explicit font size set.
 * The font size for such headings will be changed in this browser soon.
 */
const UAStyles = ({ isAdmin }: IUAStyles) => {
	// @ts-ignore
	return (
		<style>
			{`:where(h1) {margin-block: auto;font-size: ${isAdmin ? '2rem' : '3.75rem'};}`}
		</style>
	);
};

export default UAStyles;