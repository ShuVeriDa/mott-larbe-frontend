export interface LoginDto {
	username: string;
	password: string;
}

export interface RegisterDto {
	email: string;
	username: string;
	name: string;
	surname: string;
	password: string;
	phone?: string;
}

export interface AuthUser {
	id: string;
	email: string;
	username: string;
	name?: string | null;
	surname?: string | null;
}

export interface AuthResponse {
	accessToken: string;
	user: AuthUser;
}

export type AuthLang = "ru" | "che" | "en" | "ar";

export interface RequestPasswordResetDto {
	email: string;
	lang?: AuthLang;
}

export interface ConfirmPasswordResetDto {
	token: string;
	password: string;
}

export type ValidatePasswordResetReason =
	| "missing"
	| "invalid"
	| "expired"
	| "used"
	| "account_unavailable";

export type ValidatePasswordResetResponse =
	| {
			valid: true;
			expiresAt: string;
			email: string;
	  }
	| {
			valid: false;
			reason: ValidatePasswordResetReason;
	  };

export interface OkResponse {
	ok: true;
}

export interface SessionLocation {
	country: string;
	city: string;
}

export interface UserSession {
	id: string;
	ipAddress: string;
	device: string;
	location: SessionLocation | null;
	createdAt: string;
	isCurrent: boolean;
}

export interface ChangePasswordDto {
	currentPassword: string;
	newPassword: string;
	lang?: AuthLang;
}

export interface EmailChangeRequestDto {
	newEmail: string;
	currentPassword: string;
	lang?: AuthLang;
}

export interface RevokeSessionsResponse {
	revoked: number;
}
