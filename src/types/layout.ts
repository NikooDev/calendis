import React from 'react';
import { AuthEnum } from '@Calendis/types/auth';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ChildrenInterface {
	children: React.ReactNode;
}

export interface ClassNameInterface extends ChildrenInterface {
	className?: string | undefined;
	style?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
}

export interface LayoutInterface extends ClassNameInterface {
	insetTop?: boolean;
	insetBottom?: boolean;
}

export interface LoaderLayoutInterface extends ChildrenInterface {
	loading: boolean;
	isAuth: AuthEnum;
}

export enum LoaderEnum {
	WAITFORREADY = 'WAITFORREADY',
	FADEOUT = 'FADEOUT',
	HIDDEN = 'HIDDEN',
}
