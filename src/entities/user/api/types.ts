export type UserLanguage = "CHE" | "RU";
export type UserLevel = "A" | "B" | "C";

export type PermissionCode =
	| "CAN_EDIT_TEXTS"
	| "CAN_EDIT_DICTIONARY"
	| "CAN_EDIT_MORPHOLOGY"
	| "CAN_MANAGE_USERS"
	| "CAN_MANAGE_BILLING"
	| "CAN_VIEW_ANALYTICS"
	| "CAN_VIEW_LOGS"
	| "CAN_MANAGE_FEATURE_FLAGS"
	| "CAN_MANAGE_FEEDBACK"
	| "CAN_MANAGE_LEGAL";

export interface UserProfile {
	id: string;
	email: string;
	username: string;
	name: string | null;
	surname: string | null;
	phone: string | null;
	avatar: string | null;
	language: UserLanguage | null;
	level: UserLevel | null;
	createdAt: string;
	permissions: PermissionCode[];
}

export interface UpdateUserDto {
	username?: string;
	name?: string;
	surname?: string;
	phone?: string | null;
	avatar?: string | null;
	language?: UserLanguage;
	level?: UserLevel;
}

export interface DeleteAccountResponse {
	success: boolean;
	message: string;
}
