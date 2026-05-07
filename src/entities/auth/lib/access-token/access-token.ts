import { ACCESS_TOKEN_STORAGE_KEY } from "@/shared/config";

export const setAccessToken = (token: string) => {
	if (typeof window === "undefined") return;
	document.cookie = `${ACCESS_TOKEN_STORAGE_KEY}=${token}; path=/; SameSite=Lax`;
};

export const clearAccessToken = () => {
	if (typeof window === "undefined") return;
	document.cookie = `${ACCESS_TOKEN_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
};

export const getAccessToken = (): string | null => {
	if (typeof window === "undefined") return null;
	const match = document.cookie.match(
		new RegExp(`(?:^|; )${ACCESS_TOKEN_STORAGE_KEY}=([^;]*)`),
	);
	return match ? decodeURIComponent(match[1]) : null;
};
