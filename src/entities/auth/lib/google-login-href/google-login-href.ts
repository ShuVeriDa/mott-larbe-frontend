import { API_URL } from "@/shared/config";

export const getGoogleLoginHref = (
	lang: string,
	intent: "login" | "link" = "login",
): string =>
	`${API_URL}/auth/google?lang=${encodeURIComponent(lang)}&intent=${intent}`;
