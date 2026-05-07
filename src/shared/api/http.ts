import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY, API_URL } from "@/shared/config";
import { clearAccessToken } from "@/entities/auth";

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

http.interceptors.response.use(
	(response) => response,
	(error) => {
		if (typeof window !== "undefined" && error?.response?.status === 401) {
			clearAccessToken();
			const pathParts = window.location.pathname.split("/");
			const lang = pathParts[1] ?? "ru";
			window.location.href = `/${lang}/auth`;
		}
		return Promise.reject(error);
	},
);
