import Store from '@Calendis/store';

export type RootStateType = ReturnType<typeof Store.getState>;
export type RootDispatch = typeof Store.dispatch;

export enum StateStatusEnum {
	IDLE = 'IDLE',
	LOADING = 'LOADING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR'
}

interface StatusStateInterface {
	loading: boolean;
	error: string | null;
	status: StateStatusEnum;
}

export default StatusStateInterface;
