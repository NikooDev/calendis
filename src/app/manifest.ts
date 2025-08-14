import type { MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => {
	return {
		name: 'Calendis',
		short_name: 'Calendis',
		description: 'La planification connectée des tournées de calendriers.',
		start_url: '/',
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#e60076',
		icons: [
			{
				src: '/static/icons/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/static/icons/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			},
			{ src: '/static/icons/icon-256x256.png',
				sizes: '256x256',
				type: 'image/png'
			}
		]
	}
}

export default manifest;