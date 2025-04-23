import { ClassNameInterface } from '@Calendis/types/layout';
import React from 'react';
import { Pressable } from 'react-native';

export interface ParagraphInterface extends ClassNameInterface {
	size: number;
	weight?: 'light' | 'regular' | 'semibold' | 'bold';
	light?: boolean;
	numberOfLines?: number;
}

export interface Button extends ClassNameInterface {
	color?: 'primary' | 'secondary' | 'tertiary' | 'warn' | 'default' | 'none';
	icon?: string;
	iconSize?: number;
	iconColor?: string;
	iconClass?: string;
	textLight?: boolean;
	textSize: number;
	textClass?: string;
	textWeight?: ParagraphInterface['weight'];
}

export type ButtonInterface = Button & React.ComponentProps<typeof Pressable>;
