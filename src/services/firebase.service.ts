import { FirebaseApp, getApp, getApps, initializeApp } from '@firebase/app';
import { Auth, initializeAuth, getAuth, browserSessionPersistence } from '@firebase/auth';
import { Firestore, getFirestore } from '@firebase/firestore';
import firebaseConfig from '@Calendis/config/firebase.config';

class FirebaseService {
	public static app: FirebaseApp;
	private static authInst: Auth | null = null;
	private static dbInst: Firestore | null = null;

	private static init() {
		if (!this.app) {
			this.app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
		}

		return this.app;
	}

	public static get auth(): Auth {
		if (this.authInst) {
			return this.authInst;
		}

		const app = this.init();

		try {
			this.authInst = initializeAuth(app, { persistence: [browserSessionPersistence] });
		} catch {
			this.authInst = getAuth(app);
		}

		return this.authInst;
	}

	public static get db(): Firestore {
		if (this.dbInst) {
			return this.dbInst;
		}

		this.dbInst = getFirestore(this.init());

		return this.dbInst;
	}
}

export default FirebaseService;