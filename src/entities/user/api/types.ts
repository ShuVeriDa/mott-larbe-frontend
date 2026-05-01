export type UserLanguage = "CHE" | "RU";
export type UserLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

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
