import { createAsyncThunk } from '@reduxjs/toolkit';
import FirestoreService from '@Calendis/services/firebase/store';
import { UserInterface } from '@Calendis/types/user';

export const getUser = createAsyncThunk(
	'user/get',
	async (userUId: string, { rejectWithValue }) => {
		const firestore = new FirestoreService('users');

		try {
			const user = await firestore.getDocument<UserInterface>(userUId);

			if (!user) {
				return rejectWithValue('Utilisateur non trouvé');
			}

			return user;
		} catch (error) {
			return rejectWithValue('Erreur lors de la récupération de l\'utilisateur');
		}
	}
);

/**
 * @description Set user
 */
export const setUser = createAsyncThunk(
	'user/set',
	async (user: Partial<UserInterface>, { rejectWithValue }) => {
		const firestore = new FirestoreService('users');

		if (!user || !user.uid) {
			return rejectWithValue('Votre session a expiré, veuillez vous reconnecter');
		}

		try {
			return await firestore.updateDocument<UserInterface>(user.uid, { ...user });
		} catch (error) {
			return rejectWithValue('Erreur lors de la mise à jour de l\'utilisateur');
		}
	}
)
