import { http } from "@/shared/api";
import type {
	AuthLang,
	AuthResponse,
	ChangePasswordDto,
	ConfirmPasswordResetDto,
	EmailChangeRequestDto,
	LinkedAccountsResponse,
	LoginDto,
	OkResponse,
	RegisterDto,
	RequestPasswordResetDto,
	RevokeSessionsResponse,
	TelegramAuthData,
	UserSession,
	ValidatePasswordResetResponse,
} from "./types";

export const authApi = {
	login: async (body: LoginDto): Promise<AuthResponse> => {
		const { data } = await http.post<AuthResponse>("/auth/login", body);
		return data;
	},

	restore: async (body: LoginDto): Promise<AuthResponse> => {
		const { data } = await http.post<AuthResponse>("/auth/restore", body);
		return data;
	},

	register: async (body: RegisterDto): Promise<AuthResponse> => {
		const { data } = await http.post<AuthResponse>("/auth/register", body);
		return data;
	},

	logout: async (): Promise<void> => {
		await http.post("/auth/logout");
	},

	refresh: async (): Promise<AuthResponse> => {
		const { data } = await http.post<AuthResponse>("/auth/login/access-token");
		return data;
	},

	requestPasswordReset: async (
		body: RequestPasswordResetDto,
	): Promise<OkResponse> => {
		const { data } = await http.post<OkResponse>(
			"/auth/password-reset/request",
			body,
		);
		return data;
	},

	validatePasswordResetToken: async (
		token: string,
	): Promise<ValidatePasswordResetResponse> => {
		const { data } = await http.post<ValidatePasswordResetResponse>(
			"/auth/password-reset/validate",
			{ token },
		);
		return data;
	},

	confirmPasswordReset: async (
		body: ConfirmPasswordResetDto,
		lang?: AuthLang,
	): Promise<OkResponse> => {
		const { data } = await http.post<OkResponse>(
			"/auth/password-reset/confirm",
			body,
			{ params: lang ? { lang } : undefined },
		);
		return data;
	},

	getSessions: async (): Promise<UserSession[]> => {
		const { data } = await http.get<UserSession[]>("/auth/sessions");
		return data;
	},

	terminateSession: async (id: string): Promise<RevokeSessionsResponse> => {
		const { data } = await http.delete<RevokeSessionsResponse>(
			`/auth/sessions/${id}`,
		);
		return data;
	},

	terminateAllSessions: async (): Promise<RevokeSessionsResponse> => {
		const { data } =
			await http.delete<RevokeSessionsResponse>("/auth/sessions");
		return data;
	},

	changePassword: async (body: ChangePasswordDto): Promise<OkResponse> => {
		const { data } = await http.post<OkResponse>("/auth/password/change", body);
		return data;
	},

	requestEmailChange: async (body: EmailChangeRequestDto): Promise<OkResponse> => {
		const { data } = await http.post<OkResponse>("/auth/email-change/request", body);
		return data;
	},

	getLinkedAccounts: async (): Promise<LinkedAccountsResponse> => {
		const { data } = await http.get<LinkedAccountsResponse>("/auth/linked-accounts");
		return data;
	},

	unlinkAccount: async (id: string): Promise<OkResponse> => {
		const { data } = await http.delete<OkResponse>(`/auth/linked-accounts/${id}`);
		return data;
	},

	loginWithTelegram: async (body: TelegramAuthData): Promise<AuthResponse> => {
		const { data } = await http.post<AuthResponse>("/auth/telegram", body);
		return data;
	},

	linkTelegramAccount: async (body: TelegramAuthData): Promise<OkResponse> => {
		const { data } = await http.post<OkResponse>("/auth/telegram/link", body);
		return data;
	},
};
