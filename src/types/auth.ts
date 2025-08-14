export enum AuthEnum {
	LOGGED_IN = 'LOGGED_IN',
	LOGGED_OUT = 'LOGGED_OUT',
	LOGGED_ERROR = 'LOGGED_ERROR',
	LOGGED_LOADING = 'LOGGED_LOADING'
}

export enum FirebaseErrorEnum {
	INVALID_CREDENTIAL = 'auth/invalid-credential',
	INVALID_EMAIL = 'auth/invalid-email',
	WRONG_PASSWORD = 'auth/wrong-password',
	USER_NOT_FOUND = 'auth/user-not-found',
	USER_DISABLED = 'auth/user-disabled',
	NETWORK_REQUEST_FAILED = 'auth/network-request-failed',
	TOO_MANY_REQUESTS = 'auth/too-many-requests',
}

export interface IAuth {
	email: string;
	password: string;
}

export interface IAuthState {
	isAuth: AuthEnum;
}