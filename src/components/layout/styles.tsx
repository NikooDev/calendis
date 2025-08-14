import React from 'react';

/**
 * Fix
 * @constructor
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