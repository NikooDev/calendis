import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackGuestType = {
	Home: undefined;
	Login: undefined;
	Users: undefined;
}

interface RootStackUserTypeParams {
	screen?: string,
	params?: {
		[key: string]: any
	}
}

export type RootStackUserType = {
	Round: RootStackUserTypeParams;
	Message: RootStackUserTypeParams;
	Maps: RootStackUserTypeParams;
	Profile: RootStackUserTypeParams;
	Settings: RootStackUserTypeParams;
}

export type RootStackParamList<T> = T;
export type RootStackPropsGuest<T extends keyof RootStackParamList<RootStackGuestType>> = NativeStackScreenProps<RootStackParamList<RootStackGuestType>, T>;
export type RootStackPropsUser<T extends keyof RootStackParamList<RootStackUserType>> = NativeStackScreenProps<RootStackParamList<RootStackUserType>, T>;

export interface RootStackGuestNavigation {
	navigation: RootStackPropsGuest<keyof RootStackParamList<RootStackGuestType>>['navigation'];
}

export interface RootStackUserNavigation {
	navigation: RootStackPropsUser<keyof RootStackParamList<RootStackUserType>>['navigation'];
}
