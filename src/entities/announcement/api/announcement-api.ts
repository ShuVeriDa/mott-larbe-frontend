import { http } from "@/shared/api";
import type { Announcement, CreateAnnouncementPayload } from "../model/types";

export const announcementApi = {
	getList: () =>
		http.get<Announcement[]>("/admin/announcements").then((r) => r.data),

	create: (payload: CreateAnnouncementPayload) =>
		http
			.post<Announcement>("/admin/announcements", payload)
			.then((r) => r.data),

	delete: (id: string) =>
		http.delete(`/admin/announcements/${id}`).then((r) => r.data),
};
