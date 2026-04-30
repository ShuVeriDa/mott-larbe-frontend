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
