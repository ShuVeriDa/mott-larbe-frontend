export type NotificationType =
	| "FEEDBACK_REPLY"
	| "SUGGESTION_APPROVED"
	| "SUGGESTION_REJECTED"
	| "TEXT_SUBMISSION_APPROVED"
	| "TEXT_SUBMISSION_REJECTED"
	| "NEW_FEEDBACK_THREAD"
	| "NEW_TEXT_SUBMISSION"
	| "NEW_SUGGESTION";

export interface Notification {
	id: string;
	userId: string;
	type: NotificationType;
	entityId: string | null;
	isRead: boolean;
	createdAt: string;
}

export interface UnreadCountResponse {
	count: number;
}
