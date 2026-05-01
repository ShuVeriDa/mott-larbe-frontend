export type FeedbackType = "QUESTION" | "BUG" | "IDEA" | "COMPLAINT";
export type FeedbackStatus = "NEW" | "IN_PROGRESS" | "ANSWERED" | "RESOLVED";
export type FeedbackContextType = "WORD" | "SENTENCE" | "TEXT";
export type FeedbackAuthorType = "USER" | "ADMIN";
export type FeedbackMessageType = "PUBLIC_REPLY" | "INTERNAL_NOTE";

export interface FeedbackAuthor {
	id: string;
	name: string;
	surname: string;
	username: string;
}

export interface FeedbackMessage {
	id: string;
	threadId: string;
	body: string;
	authorType: FeedbackAuthorType;
	messageType: FeedbackMessageType;
	isReadByUser: boolean;
	isReadByAdmin: boolean;
	createdAt: string;
	author: FeedbackAuthor | null;
}

export interface FeedbackThread {
	id: string;
	ticketNumber: number;
	type: FeedbackType;
	status: FeedbackStatus;
	title: string | null;
	body: string;
	isReadByUser: boolean;
	isReadByAdmin: boolean;
	closedAt: string | null;
	createdAt: string;
	updatedAt: string;
	messages: FeedbackMessage[];
	unreadCountUser: number;
}

// ── Requests ────────────────────────────────────────────────────────────────

export interface CreateFeedbackDto {
	type: FeedbackType;
	body: string;
	title?: string;
	contextType?: FeedbackContextType;
	contextWord?: string;
	contextSentence?: string;
	contextLemmaId?: string;
	contextTextId?: string;
	contextPosition?: number;
	contextAction?: string;
}

export interface GetFeedbackDto {
	type?: FeedbackType;
	status?: FeedbackStatus;
	page?: number;
	limit?: number;
}

export interface AddMessageDto {
	body: string;
}

// ── Responses ───────────────────────────────────────────────────────────────

export interface PaginatedFeedback {
	items: FeedbackThread[];
	total: number;
	page: number;
	limit: number;
}

export interface UnreadCountResponse {
	count: number;
}
