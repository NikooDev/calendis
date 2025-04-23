import { initializeApp, getApps } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import firebaseConfig from '@Calendis/config/firebase';

/**
 * @description Firebase initialization
 * @author Nicolas Tual
 */
class Firebase {
	private static instance: Firebase | null = null;
	public static db: ReturnType<typeof getFirestore>;
	public static auth: ReturnType<typeof getAuth>;

	private constructor() {}

	public static async init(): Promise<Firebase> {
		if (!Firebase.instance) {
			const firebase = new Firebase();

			if (getApps().length === 0) {
				await initializeApp(firebaseConfig);
			}

			Firebase.auth = getAuth();
			Firebase.db = getFirestore();

			Firebase.instance = firebase;
		}

		return Firebase.instance;
	}

	public static get Firestore() {
		return Firebase.db;
	}

	public static get Auth() {
		return Firebase.auth;
	}
}

export default Firebase;
