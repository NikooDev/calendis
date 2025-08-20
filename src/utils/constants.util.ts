import { Metadata } from 'next';

/**
 * Regular expression to validate email addresses.
 * Matches most common email formats like "example@mail.com".
 */
export const isEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Default style for error toasts.
 */
export const toastErrorStyle = { fontWeight: 700, fontSize: '.9rem', color: '#ff4b4b' };

/**
 * Default style for success toasts.
 */
export const toastSuccessStyle = { fontWeight: 700, fontSize: '.9rem', color: '#3eae20' };

/**
 * Default style for info toasts.
 */
export const toastInfoStyle = { fontWeight: 700, fontSize: '.9rem', color: '#314158' };

/**
 * Flag key used in sessionStorage to detect
 * if a PWA update has been applied.
 */
export const FLAG = 'pwa:updated';

/**
 * Boolean flag that indicates whether the app
 * is running in production mode.
 */
export const isProd = process.env.NODE_ENV === 'production';

export const MAIN_HOST_PROD = 'www.calendis.fr';

export const ADMIN_HOST_PROD = 'admin.calendis.fr';

export const ADMIN_PATH_DEV = '/admin';

export const COOKIE_PREFIX = 'calendis';

/**
 * Default metadata configuration for the application.
 */
export const metadatas = (title: string, description: string) => ({
	title: title,
	description: description,
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
}) as Metadata;