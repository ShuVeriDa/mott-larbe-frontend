import { ACCESS_TOKEN_STORAGE_KEY, REMEMBER_ME_MAX_AGE } from "@/shared/config";

const getCookie = (name: string): string | null => {
	if (typeof window === "undefined") return null;
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
};

export const setAccessToken = (token: string, remember = false) => {
	if (typeof window === "undefined") return;
	const maxAge = remember ? `; max-age=${REMEMBER_ME_MAX_AGE}` : "";
	document.cookie = `${ACCESS_TOKEN_STORAGE_KEY}=${token}; path=/; SameSite=Lax${maxAge}`;
};

export const clearAccessToken = () => {
	if (typeof window === "undefined") return;
	document.cookie = `${ACCESS_TOKEN_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
};

export const getAccessToken = (): string | null => getCookie(ACCESS_TOKEN_STORAGE_KEY);
