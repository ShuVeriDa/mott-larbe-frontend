import { ACCESS_TOKEN_STORAGE_KEY, REMEMBER_ME_MAX_AGE } from "@/shared/config";

const getCookie = (name: string): string | null => {
	if (typeof window === "undefined") return null;
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : null;
};

const cookieFlags = (): string => {
	const secure =
		typeof window !== "undefined" && window.location.protocol === "https:"
			? "; Secure"
			: "";
	return `; path=/; SameSite=Strict${secure}`;
};

export const setAccessToken = (token: string, remember = false) => {
	if (typeof window === "undefined") return;
	const maxAge = remember ? `; max-age=${REMEMBER_ME_MAX_AGE}` : "";
	document.cookie = `${ACCESS_TOKEN_STORAGE_KEY}=${token}${cookieFlags()}${maxAge}`;
};

export const clearAccessToken = () => {
	if (typeof window === "undefined") return;
	document.cookie = `${ACCESS_TOKEN_STORAGE_KEY}=; max-age=0${cookieFlags()}`;
};

export const getAccessToken = (): string | null => getCookie(ACCESS_TOKEN_STORAGE_KEY);
