import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '@Calendis/config/firebase.config';

class FirebaseService {
	public static app: FirebaseApp;

	private static init() {
		if (!this.app) {
			this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
		}

		return this.app;
	}

	public static get auth(): Auth {
		return getAuth(this.init());
	}

	public static get db(): Firestore {
		return getFirestore(this.init());
	}
}

export default FirebaseService;