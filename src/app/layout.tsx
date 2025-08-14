import React from 'react';
import type { Metadata } from 'next';
import type { IChildren } from '@Calendis/types/app';
import { ysabeauSC, raleway } from '@Calendis/utils/fonts.util';
import { Toaster } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import StoreProvider from '@Calendis/components/layout/store';
import Serviceworker from '@Calendis/components/layout/sw/serviceworker';
import NetworkStatus from '@Calendis/components/layout/network';
import '@Calendis/assets/theme/globals.css';
import '@Calendis/assets/theme/tooltip.css';

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
					<Serviceworker/>
					<NetworkStatus/>
					<main>
						{ children }
					</main>
					<Toaster position="top-center" reverseOrder={false}/>
				</StoreProvider>
			</body>
		</html>
	)
}

export default rootLayout;