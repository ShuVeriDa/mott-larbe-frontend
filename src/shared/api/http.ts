import axios, { isAxiosError } from "axios";
import { API_URL } from "@/shared/config";

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

// withCredentials: true ensures the httpOnly access_token cookie is sent
// automatically with every request — no client-side token reading needed.
export const http = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

const PUBLIC_SEGMENTS = new Set(["auth", "reset-password"]);

const isOnPublicPage = (): boolean => {
	const parts = window.location.pathname.split("/");
	const segment = parts[2] ?? null;
	return segment === null || PUBLIC_SEGMENTS.has(segment);
};

const redirectToAuth = (): void => {
	if (!isOnPublicPage()) {
		const lang = window.location.pathname.split("/")[1] ?? "ru";
		window.location.href = `/${lang}/auth`;
	}
};

let refreshPromise: Promise<boolean> | null = null;

// After a successful refresh the backend sets a new access_token cookie via
// Set-Cookie — the browser picks it up automatically for the retry request.
const tryRefreshToken = (): Promise<boolean> => {
	if (refreshPromise) return refreshPromise;

	refreshPromise = http
		.post("/auth/login/access-token")
		.then(() => true)
		.catch(() => false)
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
		if (typeof window === "undefined") return Promise.reject(error);

		const status: number = error?.response?.status;
		const requestPath: string = error?.config?.url ?? "";

		// Surface rate-limit errors with retry timing so the UI can show feedback.
		if (status === 429) {
			const retryAfter = error.response?.headers?.["retry-after"];
			const raw = Number(retryAfter);
			const enriched = Object.assign(error, {
				isRateLimit: true,
				retryAfterSeconds: Number.isFinite(raw) && raw > 0 ? Math.min(raw, 3600) : 60,
			});
			return Promise.reject(enriched);
		}

		if (status !== 401) return Promise.reject(error);

		if (AUTH_LOGOUT_EXCLUDED_PATHS.has(requestPath) || requestPath === REFRESH_PATH) {
			return Promise.reject(error);
		}

		// Prevent a second refresh attempt if the retry itself returns 401.
		if (error.config?._retry) {
			redirectToAuth();
			return Promise.reject(error);
		}

		const refreshed = await tryRefreshToken();

		if (!refreshed) {
			redirectToAuth();
			return Promise.reject(error);
		}

		// Cookie is updated by the browser — just retry without manual header injection.
		const retryConfig = { ...error.config, _retry: true };
		return http(retryConfig);
	},
);
