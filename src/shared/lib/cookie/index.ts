export const escapeCookieName = (name: string) =>
	name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
