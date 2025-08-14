import React from 'react';

export interface IChildren {
	children: React.ReactNode;
}

export interface IUAStyles {
	isAdmin: boolean;
}

export interface IAppState {
	online: NetworkEnum;
}

export enum NetworkEnum {
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE'
}