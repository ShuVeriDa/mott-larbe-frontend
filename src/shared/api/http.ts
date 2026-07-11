import axios, { isAxiosError } from "axios";
import { API_URL, SERVER_API_URL } from "@/shared/config";

export interface ApiErrorBody {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  correlationId: string;
  // Some errors (e.g. ACCOUNT_SCHEDULED_FOR_DELETION) attach extra structured
  // fields beyond the base shape — see AllExceptionsFilter on the backend.
  [extra: string]: unknown;
}

export const getApiErrorCode = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data as Partial<ApiErrorBody> | undefined;
    if (data?.code) return data.code;
  }
  return "INTERNAL_SERVER_ERROR";
};

export const getApiErrorBody = (error: unknown): Partial<ApiErrorBody> | undefined => {
  if (isAxiosError(error)) {
    return error.response?.data as Partial<ApiErrorBody> | undefined;
  }
  return undefined;
};

// withCredentials: true ensures the httpOnly access_token cookie is sent
// automatically with every request — no client-side token reading needed.
// X-Requested-With is a custom header that browsers block in simple CORS
// requests, giving the backend an additional CSRF signal to verify.
//
// baseURL must differ by environment: in the browser, API_URL (which may be a
// same-origin relative path like "/api" for single-tunnel ngrok dev, so auth
// cookies stay same-origin) is proxied by next.config.ts's rewrites(). But
// server-side calls (e.g. queryClient.prefetchQuery in a Server Component)
// never go through that HTTP-level proxy — a relative baseURL has no origin
// to resolve against there, so server-side must use the resolved absolute
// SERVER_API_URL instead.
export const http = axios.create({
	baseURL: typeof window === "undefined" ? SERVER_API_URL : API_URL,
	withCredentials: true,
	headers: { "X-Requested-With": "XMLHttpRequest" },
});

// Keep in sync with the always-accessible route segments in src/proxy.ts —
// a 401 on these pages (e.g. an anonymous visitor's useCurrentUser() call)
// must NOT force-navigate them to /auth, since they're allowed to browse
// this content while signed out.
const PUBLIC_SEGMENTS = new Set(["auth", "reset-password", "script-guide", "pwa-guide"]);

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
