import { FirebaseError } from '@firebase/app';
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from '@firebase/auth';
import { FirebaseErrorEnum } from '@Calendis/types/auth';
import FirebaseService from '@Calendis/services/firebase.service';

export const signIn = async (email: string, password: string) => {
	const auth = FirebaseService.auth;
	const emailSanitize = email.trim().toLowerCase();
	const passwordSanitize = password.trim();

	try {
		await setPersistence(auth, browserSessionPersistence);
		const userCredential = await signInWithEmailAndPassword(auth, emailSanitize, passwordSanitize);

		return {
			user: userCredential.user,
			token: await userCredential.user.getIdToken(),
			ok: true
		};
	} catch (error) {
		let fieldErrors: Partial<Record<'email' | 'password', string>> = {};
		let formError: string | null = null;

		if (error instanceof FirebaseError) {
			switch (error.code) {
				case FirebaseErrorEnum.INVALID_EMAIL:
					fieldErrors.email = 'L\'adresse e-mail est incorrecte.';
					break;
				case FirebaseErrorEnum.USER_NOT_FOUND:
					fieldErrors.email = 'Cette adresse e-mail ne correspond à aucun compte.';
					break;
				case FirebaseErrorEnum.WRONG_PASSWORD:
					fieldErrors.password = 'Mot de passe incorrect.';
					break;
				case FirebaseErrorEnum.INVALID_CREDENTIAL:
					formError = 'Identifiants incorrects.';
					break;
				case FirebaseErrorEnum.USER_DISABLED:
					formError = 'Ce compte a été désactivé.';
					break;
				case FirebaseErrorEnum.NETWORK_REQUEST_FAILED:
					formError = 'Aucune connexion. Vérifiez vos paramètres réseau.';
					break;
				case FirebaseErrorEnum.TOO_MANY_REQUESTS:
					formError = 'Trop de tentatives, veuillez réessayer plus tard.';
					break;
				default:
					formError = 'Impossible de vous connecter pour le moment.';
					console.error('[auth:signIn]', error.code);
			}
		} else {
			console.error('[auth:signIn] unknown error:', error);
		}

		return {
			ok: false,
			code: (error as FirebaseError).code || 'unknown',
			fieldErrors,
			formError
		};
	}
};