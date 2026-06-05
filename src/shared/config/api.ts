export const API_URL = (() => {
	const url = process.env.NEXT_PUBLIC_API_URL;
	if (!url && process.env.NODE_ENV === "production") {
		throw new Error("NEXT_PUBLIC_API_URL is not set");
	}
	return url ?? "http://localhost:9555/api";
})();

export const WS_URL = (() => {
	const url = process.env.NEXT_PUBLIC_WS_URL;
	if (!url && process.env.NODE_ENV === "production") {
		throw new Error("NEXT_PUBLIC_WS_URL is not set");
	}
	return url ?? "ws://localhost:9555";
})();

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
export const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
