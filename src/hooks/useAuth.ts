import { useCallback, useEffect } from 'react';
import Firebase from '@Calendis/services/firebase/init';
import { onAuthStateChanged, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser } from '@Calendis/actions/user.actions';
import { doc, onSnapshot } from '@react-native-firebase/firestore';
import { logout as signOut } from '@Calendis/actions/auth.actions';
import { RootDispatch, RootStateType } from '@Calendis/types/store';
import { setLoginSuccess, setLogout } from '@Calendis/store/reducers/auth.reducer';
import { resetStore } from '@Calendis/store/reducers';
import { UserInterface } from '@Calendis/types/user';

/**
 * @description Hook for authentication -> Checks the user's authentication state
 */
const useAuth = () => {
	const dispatch = useDispatch<RootDispatch>();
	const { user: currentUser } = useSelector((state: RootStateType) => state.user);
	const auth = Firebase.Auth;
	let unsubscribeUserDoc: (() => void) | null = null;

	/**
	 * @description Listens for user state changes
	 * @param userUID
	 */
	const onUserStateChange = useCallback((userUID: string) => {
		const db = Firebase.Firestore;
		const userDocRef = doc(db, 'users', userUID);

		unsubscribeUserDoc = onSnapshot(userDocRef, async (doc) => {
			if (doc.exists) {
				const user = doc.data() as UserInterface;

				if (user !== currentUser) {
					dispatch(setUser(user));
				}
			}
		}, (error) => {
			console.log(error);
		});
	}, [dispatch, currentUser])

	/**
	 * @description Listens for authentication state changes
	 */
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseAuthTypes.User | null) => {
			try {
				if (user && user.uid) {
					const token = await user.getIdToken();

					if (token) {
						dispatch(getUser(user.uid));
						dispatch(setLoginSuccess());
						onUserStateChange(user.uid);
					} else {
						await logout();
					}
				} else {
					await logout();
				}
			} catch (error) {
				console.error('Error during authentication:', error);
				await logout();
			}
		});

		return () => {
			unsubscribe();

			if (unsubscribeUserDoc) {
				unsubscribeUserDoc();
				unsubscribeUserDoc = null;
			}
		}
	}, [dispatch, onUserStateChange]);

	/**
	 * @description Logs out the user
	 */
	const logout = async () => {
		dispatch(resetStore());
		dispatch(setLogout());

		if (unsubscribeUserDoc) {
			unsubscribeUserDoc();
			unsubscribeUserDoc = null;
		}

		if (!currentUser.uid) {
			return;
		}

		await signOut();
	}

	return {
		logout
	}
}

export default useAuth;
