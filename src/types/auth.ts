export enum AuthEnum {
	LOGGED_IN = 'LOGGED_IN',
	LOGGED_OUT = 'LOGGED_OUT',
	LOGGED_ERROR = 'LOGGED_ERROR',
	LOGGED_LOADING = 'LOGGED_LOADING'
}

export interface AuthInterface {
	email: string;
	password: string;
}

export interface SignupInterface {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	avatarID: string;
}

export interface AuthStateInterface {
	isAuth: AuthEnum;
}
