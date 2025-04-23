import Firebase from '@Calendis/services/firebase/init';
import {
	Timestamp,
	doc, getDoc, getDocs, query, where, or, limit, limitToLast,
	orderBy, collection, setDoc, updateDoc, deleteDoc, getFirestore
} from '@react-native-firebase/firestore';
import { LimitSearchParameter, OrSearchParameter, SortSearchParameter, WhereSearchParameter } from '@Calendis/types/firestore';
import CommonInterface from '@Calendis/types/common';
import { DateTime } from 'luxon';

/**
 * @description Firestore service class
 * @param T
 * @author Nicolas Tual
 */
class FirestoreService {
	private readonly collectionName: string;
	private readonly db: ReturnType<typeof getFirestore> = Firebase.Firestore;

	constructor(collectionName: string) {
		this.collectionName = collectionName;
	}

	/**
	 * @description Get a document from a collection
	 * @param uid
	 */
	public async getDocument<T extends CommonInterface>(uid: string): Promise<T | null> {
		const ref = doc(this.db, this.collectionName, uid);
		try {
			const docSnap = await getDoc(ref);

			if (docSnap.exists) {
				const data = docSnap.data() as T;

				if (data.created) {
					data.created = this.transformDate(data.created);
				}

				return data;
			}

			return null;
		} catch (err) {
			console.error('Error getting document:', err);
			return null;
		}
	}

	/**
	 * @description Search documents in a collection
	 * @param queries
	 */
	public async search<T extends CommonInterface>(queries: (WhereSearchParameter | OrSearchParameter | SortSearchParameter | LimitSearchParameter)[]): Promise<T[]> {
		const ref = collection(this.db, this.collectionName);
		let queryRef = query(ref);

		queries.forEach(queryParam => {
			if ((queryParam as WhereSearchParameter).where) {
				const { where: field, operator, value } = queryParam as WhereSearchParameter;
				queryRef = query(queryRef, where(field, operator, value));
			}

			if ((queryParam as OrSearchParameter).or) {
				const orConditions = (queryParam as OrSearchParameter).or;
				const orClause = or(...orConditions.map(cond => where(cond.where, cond.operator, cond.value)));
				queryRef = query(queryRef, orClause);
			}

			if ((queryParam as SortSearchParameter).sortBy) {
				const { sortBy, direction } = queryParam as SortSearchParameter;
				queryRef = query(queryRef, orderBy(sortBy, direction));
			}

			if ((queryParam as LimitSearchParameter).limit) {
				const { limit: maxResults, limitToLast: isLimitToLast } = queryParam as LimitSearchParameter;
				if (isLimitToLast) {
					queryRef = query(queryRef, limitToLast(maxResults));
				} else {
					queryRef = query(queryRef, limit(maxResults));
				}
			}
		});

		try {
			const querySnapshot = await getDocs(queryRef);

			return querySnapshot.docs.map(doc => {
				const data = {
					id: doc.id,
					...doc.data() as T,
				} as T;

				if (data.created) {
					data.created = this.transformDate(data.created);
				}

				return data;
			});
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	/**
	 * @description Get all documents from a collection
	 */
	public async list<T extends CommonInterface>(): Promise<T[]> {
		const ref = collection(this.db, this.collectionName);
		try {
			const querySnapshot = await getDocs(ref);

			return querySnapshot.docs.map(doc => {
				const data = {
					id: doc.id,
					...doc.data() as T,
				} as T;

				if (data.created) {
					data.created = this.transformDate(data.created);
				}

				return data;
			});
		} catch (err) {
			console.error(err);
			return [];
		}
	}

	/**
	 * @description Create a document in a collection
	 * @param data
	 */
	public async createDocument<T extends CommonInterface>(data: T): Promise<{ valid: boolean, uid: string | null }> {
		try {
			const ref = collection(this.db, this.collectionName);

			const newDocRef = doc(ref);
			const generatedId = newDocRef.id;

			const uid = data.uid || generatedId;

			const documentData = {
				...data,
				uid: uid,
				created: Timestamp.fromDate(data.created.toJSDate())
			};

			await setDoc(doc(ref, uid), documentData);

			return {
				valid: true,
				uid: uid
			};
		} catch (err) {
			console.error('Error creating document:', err);

			return {
				valid: false,
				uid: null
			};
		}
	}

	/**
	 * @description Update a document in a collection
	 * @param uid
	 * @param data
	 * @param hasCreated
	 */
	public async updateDocument<T extends CommonInterface>(uid: string, data: Partial<T>, hasCreated?: boolean): Promise<Partial<T> | null> {
		try {
			const ref = doc(this.db, this.collectionName, uid);
			const { created, ...partialData } = data;

			await updateDoc(ref, partialData);

			return hasCreated ? {
				...data,
				created
			} : data;
		} catch (err) {
			console.error('Error updating document:', err);
			return null;
		}
	}

	/**
	 * @description Delete a document from a collection
	 * @param uid
	 */
	public async deleteDocument(uid: string): Promise<string | null> {
		try {
			const ref = doc(this.db, this.collectionName, uid);

			await deleteDoc(ref);

			return uid;
		} catch (err) {
			console.error('Error deleting document:', err);
			return null;
		}
	}

	/**
	 * @description Transform Firestore Timestamp to DateTime
	 * @param date
	 * @private
	 */
	public transformDate(date: DateTime | Timestamp): DateTime {
		if (date && typeof date === 'object' && 'seconds' in date) {
			return DateTime.fromSeconds(date.seconds);
		} else {
			throw new Error('Invalid date type: Expected a Timestamp.');
		}
	}
}

export default FirestoreService;
