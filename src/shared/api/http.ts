import axios from "axios";
import { ACCESS_TOKEN_STORAGE_KEY, API_BASE_URL } from "@/shared/config";

export const http = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

http.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
		if (token) {
			config.headers.set("Authorization", `Bearer ${token}`);
		}
	}
	return config;
});
