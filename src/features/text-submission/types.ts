export type TextSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type TextSubmissionDecision = "approve" | "reject";

export interface TextSubmissionUser {
	id: string;
	username: string;
	name: string;
}

export interface TextSubmission {
	id: string;
	userId: string;
	title: string;
	language: string;
	author?: string;
	sourceUrl?: string;
	content?: string;
	comment?: string;
	status: TextSubmissionStatus;
	reviewedBy?: string;
	reviewedAt?: string;
	reviewComment?: string;
	user?: TextSubmissionUser;
	reviewer?: TextSubmissionUser;
	createdAt: string;
}

export interface CreateTextSubmissionDto {
	title: string;
	language: string;
	author?: string;
	sourceUrl?: string;
	content?: string;
	comment?: string;
}

export interface ReviewTextSubmissionDto {
	decision: TextSubmissionDecision;
	reviewComment?: string;
}

export interface TextSubmissionsListMeta {
	total: number;
	limit: number;
	offset: number;
}

export interface TextSubmissionsListResponse {
	data: TextSubmission[];
	meta: TextSubmissionsListMeta;
}

export interface TextSubmissionStats {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
}

export interface GetTextSubmissionsParams {
	status?: TextSubmissionStatus;
	q?: string;
	limit?: number;
	offset?: number;
	order?: "asc" | "desc";
}

export interface GetMyTextSubmissionsParams {
	limit?: number;
	offset?: number;
}
