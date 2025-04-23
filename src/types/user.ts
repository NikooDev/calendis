import CommonInterface from '@Calendis/types/common';
import StatusStateInterface from '@Calendis/types/store';

export interface UserInterface extends CommonInterface {
	firstname: string;
	lastname: string;
	email: string;
	avatarID: string;
	badgeChat: number;
}

export interface UserStateInterface extends StatusStateInterface {
	user: UserInterface;
}
