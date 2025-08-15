import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	distDir: 'dist',
	async headers() {
		return [
			{
				source: '/static/sw/sw.js',
				headers: [
					{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
					{ key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
					{ key: 'Service-Worker-Allowed', value: '/' }
				],
			},
		];
	}
};

export default nextConfig;
