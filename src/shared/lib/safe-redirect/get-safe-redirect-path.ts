export const getSafeRedirectPath = (redirect: string | undefined): string | null => {
	if (!redirect) return null;
	if (!redirect.startsWith("/") || redirect.startsWith("//")) return null;
	return redirect;
};
