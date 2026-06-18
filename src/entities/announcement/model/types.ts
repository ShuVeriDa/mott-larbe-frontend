export interface Announcement {
	id: string;
	title: string;
	body: string | null;
	textId: string | null;
	textTitle: string | null;
	createdById: string;
	createdAt: string;
}

export interface CreateAnnouncementPayload {
	title: string;
	body?: string;
	textId?: string;
}
