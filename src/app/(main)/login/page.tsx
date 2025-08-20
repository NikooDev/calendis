import React from 'react';
import Image from 'next/image';
import SlideIn from '@Calendis/components/animations/slidein';
import Login from '@Calendis/components/pages/login/login';
import type { Metadata } from 'next';
import { metadatas } from '@Calendis/utils/constants.util';

export const metadata: Metadata = metadatas('Calendis • Connexion', 'Connectez-vous à votre espace Calendis pour retrouver l’organisation de la tournée du calendrier, les prochains événements de l’amicale et toutes les informations utiles pour rester impliqué dans la vie de votre équipe.');

const Page = () => {
	return (
		<section className="flex justify-center items-center h-dvh w-full bg-theme-700">
			<div className="relative px-4 w-full sm:max-w-[500px] z-30 pb-28 lg:pb-10">
				<div className="flex flex-col items-center justify-center relative">
					<SlideIn trigger="mount" delay={100} direction="bottom" className="flex flex-col lg:flex-row gap-2 lg:gap-8 mb-10 p-5">
						<div className="mx-auto">
							<Image src="/static/img/logo.webp" width={100} height={100} className="block box-shadow rounded-full select-none pointer-events-none" alt="logo" priority/>
						</div>
						<div className="leading-14">
							<h1 className="font-title text-6xl font-black text-white text-shadow">Calendis</h1>
							<p className="font-title text-2xl text-shadow font-black ml-0.5 text-white">Connexion</p>
						</div>
					</SlideIn>
					<SlideIn trigger="mount" delay={300} direction="bottom" className="bg-white/10 p-5 rounded-2xl w-full shadow-lg">
						<Login/>
					</SlideIn>
				</div>
			</div>
		</section>
	);
};

export default Page;