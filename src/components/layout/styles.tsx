import React from 'react';

/**
 * Fix UA styles title h1 :
 * A <h1> was found inside an <article>,
 * <aside>, <nav>, or <section> element that does not have an explicit font size set.
 * The font size for such headings will be changed in this browser soon.
 */
const Styles = () => {
	// @ts-ignore
	return (
		<style>
			{`:where(h1) {margin-block: 0.67em;font-size: 2em;}`}
		</style>
	);
};

export default Styles;