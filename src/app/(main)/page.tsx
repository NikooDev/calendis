import React from 'react';
import Image from 'next/image';
import SlideIn from '@Calendis/components/animations/slidein';
import { AndroidIcon, AppleIcon } from '@Calendis/components/ui/icons';

const Page = () => {
	return (
		<section className="h-dvh w-full bg-theme-700">
			<div className="container mx-auto justify-around flex items-center h-full px-4 z-30 relative pb-10">
				<div className="flex justify-center pb-20 flex-col items-center lg:items-start lg:flex-row">
					<div className="self-start flex mx-auto">
						<SlideIn trigger="mount" delay={100} direction="bottom" className="w-[150px] h-[150px] rounded-full box-shadow">
							<Image src="/static/img/logo.webp" width={150} height={150} loading="lazy" className="select-none" alt="logo"/>
						</SlideIn>
					</div>
					<div className="flex flex-col items-center lg:items-start lg:ml-10 mt-4 lg:mt-0 z-10">
						<SlideIn trigger="mount" delay={200} direction="bottom">
							<div className="leading-14">
								<h1 className="font-title font-black text-white text-shadow text-center lg:text-left">Calendis</h1>
								<p className="font-title text-2xl mt-4 font-black leading-8 text-white text-shadow text-center lg:text-left">La planification connectée des<br/>tournées de calendriers.</p>
							</div>
						</SlideIn>
						<SlideIn trigger="mount" delay={400} direction="bottom">
							<div className="flex gap-4 mt-4 lg:w-auto">
								<button className="flex items-center w-full bg-pink-600 hover:bg-white hover:text-theme-500 text-white transition-colors duration-200 pl-3 pr-4 py-2 rounded-lg gap-3 leading-6 select-none">
									<AppleIcon className="-mt-0.5 lg:w-[30px] lg:h-[30px]"/>
									<span className="flex flex-col items-start">
										<span className="text-sm lg:text-md font-extrabold">TÉLÉCHARGER</span>
										<span className="text-xs font-bold">Version iOS</span>
									</span>
								</button>
								<button className="flex items-center w-full bg-pink-600 hover:bg-white hover:text-theme-500 text-white transition-colors duration-200 pl-3 pr-4 py-2 rounded-lg gap-3 leading-6 select-none">
									<AndroidIcon className="-mt-0.5 lg:w-[30px] lg:h-[30px]"/>
									<span className="flex flex-col items-start">
										<span className="text-sm lg:text-md font-extrabold">TÉLÉCHARGER</span>
										<span className="text-xs font-bold">Version Android</span>
									</span>
								</button>
							</div>
						</SlideIn>
					</div>
				</div>
				<div className="relative z-50 hidden lg:flex">
					<SlideIn trigger="image" delay={400} direction="right" className="rounded-3xl box-shadow">
						<div className="relative w-[320px] h-[700px]">
							<Image src="/static/img/mobile.webp" alt="Mobile" className="object-cover select-none" sizes="(min-width:1024px) 300px, 0px" quality={75} fill priority/>
						</div>
					</SlideIn>
					<SlideIn trigger="image" delay={700} direction="right" className="absolute -bottom-10 -right-10 rounded-3xl box-shadow">
						<div className="relative w-[200px] h-[433px]">
							<Image src="/static/img/mobileDashboard.webp" alt="Mobile" className="object-cover select-none" sizes="(min-width:1024px) 200px, 0px" loading="lazy" quality={75} fill/>
						</div>
					</SlideIn>
				</div>
			</div>
		</section>
	);
};

export default Page;