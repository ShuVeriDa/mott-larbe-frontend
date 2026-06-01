export const genreKeys = {
	root: ["genres"] as const,
	list: () => ["genres", "list"] as const,
	adminList: () => ["genres", "admin", "list"] as const,
};
