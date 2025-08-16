import type { NextConfig } from 'next';
import fs from 'node:fs';
import { isProd } from '@Calendis/utils/constants.util';

const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const nextConfig: NextConfig = {
	distDir: 'dist',
	env: {
		NEXT_PUBLIC_APP_VERSION: version
	},
	async headers() {
		if (!isProd) return [];
		return [
			{
				source: '/sw.js',
				headers: [
					{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
					{ key: 'Content-Type', value: 'application/javascript; charset=utf-8' }
				],
			},
		];
	}
};

export default nextConfig;
