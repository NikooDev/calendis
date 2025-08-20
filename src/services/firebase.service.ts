import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import firebaseConfig from '@Calendis/config/firebase.config';
import { browserSessionPersistence } from '@firebase/auth';

class FirebaseService {
	public static app: FirebaseApp;


	private static init() {
		if (!this.app) {
			this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
		}

		return this.app;
	}

	public static get auth(): Auth {
		return initializeAuth(this.init(), {persistence: [browserSessionPersistence]});
	}

	public static get db(): Firestore {
		return getFirestore(this.init());
	}
}

export default FirebaseService;