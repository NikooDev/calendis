export interface WhereSearchParameter {
	where: string;
	operator: '>=' | '==' | '<=' | '!=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
	value: string | Date | number | boolean | {};
}

export interface OrSearchParameter {
	or: WhereSearchParameter[];
}

export interface SortSearchParameter {
	sortBy: string;
	direction: 'asc' | 'desc';
}

export interface LimitSearchParameter {
	limit: number;
	limitToLast: boolean;
}
