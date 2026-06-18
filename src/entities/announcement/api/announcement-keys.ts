export const announcementKeys = {
	all: ["entities", "announcement"] as const,
	list: () => [...announcementKeys.all, "list"] as const,
};
