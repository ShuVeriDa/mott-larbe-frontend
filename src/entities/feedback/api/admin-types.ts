import type { FeedbackAuthorType, FeedbackMessageType, FeedbackStatus, FeedbackType } from "./types";

export type FeedbackPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AdminFeedbackTab = "OPEN" | "ALL" | "CLOSED";

export interface AdminFeedbackUser {
	id: string;
	email: string;
	name: string;
	surname: string;
	username: string;
	plan: string | null;
	signupAt: string;
}

export interface AdminFeedbackAssignee {
	id: string;
	name: string;
	surname: string;
	username: string;
}

export interface AdminFeedbackMessage {
	id: string;
	threadId: string;
	body: string;
	authorType: FeedbackAuthorType;
	messageType: FeedbackMessageType;
	isReadByUser: boolean;
	isReadByAdmin: boolean;
	createdAt: string;
	author: AdminFeedbackAssignee | null;
}

export interface AdminFeedbackThread {
	id: string;
	ticketNumber: number;
	type: FeedbackType;
	status: FeedbackStatus;
	priority: FeedbackPriority;
	title: string | null;
	assigneeAdminId: string | null;
	assignee: AdminFeedbackAssignee | null;
	user: AdminFeedbackUser;
	messages: AdminFeedbackMessage[];
	unreadCountAdmin: number;
	createdAt: string;
	updatedAt: string;
	closedAt: string | null;
}

export interface AdminFeedbackStats {
	total: number;
	openTotal: number;
	unreadByAdmin: number;
	byStatus: Array<{ status: FeedbackStatus; count: number }>;
	byType: Array<{ type: FeedbackType; count: number }>;
}

export interface PaginatedAdminFeedback {
	items: AdminFeedbackThread[];
	total: number;
	page: number;
	limit: number;
}

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface GetAdminFeedbackDto {
	type?: FeedbackType;
	status?: FeedbackStatus;
	priority?: FeedbackPriority;
	tab?: AdminFeedbackTab;
	search?: string;
	page?: number;
	limit?: number;
}

export interface AdminReplyDto {
	body: string;
	isInternal?: boolean;
}

export interface AssignFeedbackDto {
	assigneeAdminId: string | null;
}

export interface UpdateFeedbackStatusDto {
	status: FeedbackStatus;
}

export interface UpdateFeedbackPriorityDto {
	priority: FeedbackPriority;
}

export interface TransferFeedbackDto {
	targetAdminId: string;
	note?: string;
}
