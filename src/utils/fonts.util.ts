import localFont from 'next/font/local';

export const ysabeauSC = localFont({
	src: './../assets/fonts/YsabeauSC.ttf',
	variable: '--font-title',
	display: 'swap'
});

export const raleway = localFont({
	src: [
		{
			path: './../assets/fonts/Raleway.ttf',
			style: 'normal'
		},
		{
			path: './../assets/fonts/Raleway-Italic.ttf',
			style: 'italic'
		},
	],
	variable: '--font-default',
	display: 'swap'
});