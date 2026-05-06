import { http } from "@/shared/api";
import type {
	AuthLang,
	AuthResponse,
	ChangePasswordDto,
	ConfirmPasswordResetDto,
	EmailChangeRequestDto,
	LoginDto,
	OkResponse,
	RegisterDto,
	RequestPasswordResetDto,
	RevokeSessionsResponse,
	UserSession,
	ValidatePasswordResetResponse,
} from "./types";

export const authApi = {
	login: async (body: LoginDto): Promise<AuthResponse> => {
		const { data } = await http.post<AuthResponse>("/auth/login", body);
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
		const { data } = await http.get<ValidatePasswordResetResponse>(
			"/auth/password-reset/validate",
			{ params: { token } },
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
};
