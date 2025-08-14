import React from 'react';
import type { Metadata } from 'next';
import type { IChildren } from '@Calendis/types/app';
import { ysabeauSC, raleway } from '@Calendis/utils/fonts.util';
import { twMerge } from 'tailwind-merge';
import StoreProvider from '@Calendis/components/layout/store';
import '@Calendis/assets/theme/globals.css';

export const metadata: Metadata = {
	title: 'Calendis',
	description: 'La planification connectée des tournées de calendriers',
	icons: {
		icon: [
			{
				rel: 'icon',
				type: 'image/ico',
				url: '/static/icons/favicon.ico',
				sizes: '16x16'
			}
		],
		apple: [
			{ url: '/img/apple-touch-icon-180x180.png', sizes: '180x180' }
		]
	},
	manifest: '/manifest.json'
};

const rootLayout = ({ children }: Readonly<IChildren>) => {
	return (
		<html lang="fr">
			<body className={twMerge(ysabeauSC.variable, raleway.variable)}>
				<StoreProvider>
					{ children }
				</StoreProvider>
			</body>
		</html>
	)
}

export default rootLayout;