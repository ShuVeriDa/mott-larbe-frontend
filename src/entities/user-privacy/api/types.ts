export interface UserPrivacySettings {
	showPhone: boolean;
	showAge: boolean;
	showHeritage: boolean;
	showLocation: boolean;
	showActivity: boolean;
	showJoinDate: boolean;
}

export interface UpdatePrivacyDto {
	showPhone?: boolean;
	showAge?: boolean;
	showHeritage?: boolean;
	showLocation?: boolean;
	showActivity?: boolean;
	showJoinDate?: boolean;
}

export type PrivacyField = keyof UserPrivacySettings;
