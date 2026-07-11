export const API_URL = (() => {
	const url = process.env.NEXT_PUBLIC_API_URL;
	if (!url && process.env.NODE_ENV === "production") {
		throw new Error("NEXT_PUBLIC_API_URL is not set");
	}
	return url ?? "http://localhost:9555/api";
})();

// Server-side fetch() calls (generateStaticParams, RSC, metadata) run in Node,
// not through the Next.js HTTP server, so next.config.ts's rewrites() proxy for
// a relative API_URL (e.g. "/api", used for single-tunnel ngrok dev so the
// browser stays same-origin for cookies) never applies — a relative URL has no
// base and fetch() throws. Resolve against the real backend host in that case.
export const SERVER_API_URL = API_URL.startsWith("/")
	? `${process.env.DEV_API_PROXY_TARGET ?? "http://localhost:9555"}${API_URL}`
	: API_URL;

export const WS_URL = (() => {
	const url = process.env.NEXT_PUBLIC_WS_URL;
	if (!url && process.env.NODE_ENV === "production") {
		throw new Error("NEXT_PUBLIC_WS_URL is not set");
	}
	return url ?? "ws://localhost:9555";
})();

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
export const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Public bot username (not a secret) for the Telegram Login Widget.
export const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "";
