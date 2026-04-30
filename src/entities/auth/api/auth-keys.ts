export const authKeys = {
	root: ["auth"] as const,
	currentUser: () => ["auth", "current-user"] as const,
	sessions: () => ["auth", "sessions"] as const,
	passwordResetValidate: (token: string) =>
		["auth", "password-reset", "validate", token] as const,
};
