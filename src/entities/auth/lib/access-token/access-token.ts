import { ACCESS_TOKEN_STORAGE_KEY } from "@/shared/config";

export const setAccessToken = (token: string) => {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
};

export const clearAccessToken = () => {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const getAccessToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};
