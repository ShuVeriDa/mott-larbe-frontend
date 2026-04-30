import { http } from "@/shared/api";
import type {
	AuthLang,
	AuthResponse,
	ConfirmPasswordResetDto,
	LoginDto,
	OkResponse,
	RegisterDto,
	RequestPasswordResetDto,
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
};
