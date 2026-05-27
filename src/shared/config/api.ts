export const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9555/api";

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
export const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
