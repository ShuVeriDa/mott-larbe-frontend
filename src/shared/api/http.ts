import axios, { isAxiosError } from "axios";
import { ACCESS_TOKEN_STORAGE_KEY, API_URL } from "@/shared/config";
import { clearAccessToken, setAccessToken, getAccessToken } from "@/entities/auth";

export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  correlationId: string;
}

export const getApiErrorCode = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorBody> | undefined;
    if (data?.code) return data.code;
  }
  return "INTERNAL_SERVER_ERROR";
};

export const http = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

http.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const match = document.cookie.match(
			new RegExp(`(?:^|; )${ACCESS_TOKEN_STORAGE_KEY}=([^;]*)`),
		);
		const token = match ? decodeURIComponent(match[1]) : null;
		if (token) {
			config.headers.set("Authorization", `Bearer ${token}`);
		}
	}
	return config;
});

const PUBLIC_SEGMENTS = new Set(["auth", "reset-password"]);

const isOnPublicPage = (): boolean => {
	const parts = window.location.pathname.split("/");
	const segment = parts[2] ?? null;
	return segment === null || PUBLIC_SEGMENTS.has(segment);
};

const redirectToAuth = (): void => {
	clearAccessToken();
	if (!isOnPublicPage()) {
		const lang = window.location.pathname.split("/")[1] ?? "ru";
		window.location.href = `/${lang}/auth`;
	}
};

interface AuthResponse {
	accessToken: string;
	rememberMe?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

const tryRefreshToken = (): Promise<string | null> => {
	if (refreshPromise) return refreshPromise;

	refreshPromise = http
		.post<AuthResponse>("/auth/login/access-token")
		.then((res) => {
			const { accessToken, rememberMe } = res.data;
			setAccessToken(accessToken, rememberMe ?? false);
			return accessToken;
		})
		.catch(() => null)
		.finally(() => {
			refreshPromise = null;
		});

	return refreshPromise;
};

const AUTH_LOGOUT_EXCLUDED_PATHS = new Set(["/auth/password/change"]);
const REFRESH_PATH = "/auth/login/access-token";

http.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (typeof window === "undefined" || error?.response?.status !== 401) {
			return Promise.reject(error);
		}

		const requestPath: string = error?.config?.url ?? "";

		if (AUTH_LOGOUT_EXCLUDED_PATHS.has(requestPath) || requestPath === REFRESH_PATH) {
			return Promise.reject(error);
		}

		const newToken = await tryRefreshToken();

		if (!newToken) {
			redirectToAuth();
			return Promise.reject(error);
		}

		const retryConfig = { ...error.config };
		retryConfig.headers = { ...retryConfig.headers };
		retryConfig.headers["Authorization"] = `Bearer ${newToken}`;
		retryConfig._retry = true;

		return http(retryConfig);
	},
);
