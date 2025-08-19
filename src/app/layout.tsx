import React from 'react';
import type { Metadata } from 'next';
import type { IChildren } from '@Calendis/types/app';
import { ysabeauSC, raleway } from '@Calendis/utils/fonts.util';
import { isProd, metadatas } from '@Calendis/utils/constants.util';
import { Toaster } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import StoreProvider from '@Calendis/components/layout/store';
import AuthListener from '@Calendis/components/layout/auth/authlistener';
import ServiceWorker from '@Calendis/components/layout/serviceworker/sw';
import NetworkStatus from '@Calendis/components/layout/network';
import Navprogress from '@Calendis/components/layout/navprogress';
import '@Calendis/assets/theme/globals.css';
import '@Calendis/assets/theme/tooltip.css';

export const metadata: Metadata = metadatas;

const rootLayout = ({ children }: Readonly<IChildren>) => {
	return (
		<html lang="fr">
			<body className={twMerge(ysabeauSC.variable, raleway.variable)}>
				<StoreProvider>
					<AuthListener/>
					{ isProd && <ServiceWorker /> }
					<NetworkStatus/>
					<Navprogress/>
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