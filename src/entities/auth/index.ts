export { authApi, authKeys } from "./api";
export type {
	AuthLang,
	AuthResponse,
	AuthUser,
	ChangePasswordDto,
	ConfirmPasswordResetDto,
	EmailChangeRequestDto,
	LoginDto,
	OkResponse,
	RegisterDto,
	RequestPasswordResetDto,
	RevokeSessionsResponse,
	SessionLocation,
	UserSession,
	ValidatePasswordResetReason,
	ValidatePasswordResetResponse,
} from "./api";
export {
	clearAccessToken,
	getAccessToken,
	setAccessToken,
} from "./lib/access-token";
export {
	useChangePassword,
	useRequestEmailChange,
	useSessions,
	useTerminateAllSessions,
	useTerminateSession,
} from "./model";
