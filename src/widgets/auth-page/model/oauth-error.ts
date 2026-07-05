export type OAuthError = "oauth_failed" | "oauth_state_mismatch";

export const isOAuthError = (value: unknown): value is OAuthError =>
	value === "oauth_failed" || value === "oauth_state_mismatch";
