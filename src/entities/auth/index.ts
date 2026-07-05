export { authApi, authKeys } from "./api";
export type {
	AuthLang,
	AuthResponse,
	AuthUser,
	ChangePasswordDto,
	ConfirmPasswordResetDto,
	EmailChangeRequestDto,
	LinkedAccount,
	LinkedAccountsResponse,
	LoginDto,
	OAuthProvider,
	OkResponse,
	RegisterDto,
	RequestPasswordResetDto,
	RevokeSessionsResponse,
	SessionLocation,
	TelegramAuthData,
	UserSession,
	ValidatePasswordResetReason,
	ValidatePasswordResetResponse,
} from "./api";
export { clearAccessToken } from "./lib/access-token";
export { getGoogleLoginHref } from "./lib/google-login-href";
export {
	linkedAccountsQueryOptions,
	useChangePassword,
	useRequestEmailChange,
	useSessions,
	useTerminateAllSessions,
	useTerminateSession,
} from "./model";
