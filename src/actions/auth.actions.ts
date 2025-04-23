import { AuthInterface } from '@Calendis/types/auth';
import Firebase from '@Calendis/services/firebase/init';
import { signInWithEmailAndPassword, signOut } from '@react-native-firebase/auth';

export const login = async ({email, password}: AuthInterface) => {
	const auth = Firebase.Auth;

	try {
		const { user } = await signInWithEmailAndPassword(auth, email, password);

		return await user.getIdToken();
	} catch (e) {
		console.error(e);

		if (typeof e === 'object' && e !== null && 'code' in e && 'message' in e) {
			const err = e as { code: string; message: string };

			switch (err.code) {
				case 'auth/invalid-credential':
					throw new Error('Aucun compte ne correspond à cette adresse e-mail.');
				case 'auth/invalid-email':
					throw new Error("L'adresse e-mail est invalide.");
				case 'auth/user-disabled':
					throw new Error('Ce compte a été désactivé.');
				case 'auth/user-not-found':
					throw new Error('Aucun compte ne correspond à cette adresse e-mail.');
				case 'auth/wrong-password':
					throw new Error('Le mot de passe est incorrect.');
				default:
					throw new Error('Une erreur inattendue s\'est produite.');
			}
		} else {
			console.error('Unexpected error:', e);
			throw new Error('Une erreur inconnue s’est produite.');
		}
	}
}

export const logout = async () => {
	const auth = Firebase.Auth;

	try {
		await signOut(auth);

		return true;
	} catch (err) {
		console.log(err);
	}
}
