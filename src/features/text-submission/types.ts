import type { TipTapDoc } from "@/shared/ui/notion-editor";

// ─── Pages ─────────────────────────────────────────────────────────────────

export interface TextSubmissionPage {
	id: string;
	pageNumber: number;
	title?: string;
	contentRich: TipTapDoc;
}

export interface CreateTextSubmissionPageDto {
	pageNumber: number;
	title?: string;
	contentRich: TipTapDoc;
}

// ─── Existing types — unchanged ────────────────────────────────────────────

export type TextSubmissionStatus = "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";
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
	// C2 fallback rule: legacy plain-text content (old submissions)
	content?: string;
	comment?: string;
	status: TextSubmissionStatus;
	// New fields (Step 2 schema)
	submissionType: SubmissionType;
	licenseType?: SubmissionLicenseType;
	publicationYear?: number;
	// C2 fallback rule: new TipTap rich content (new flow)
	contentRich?: TipTapDoc;
	pages?: TextSubmissionPage[];
	reviewedBy?: string;
	reviewedAt?: string;
	reviewComment?: string;
	textId?: string;
	updatedAt: string;
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
	// New fields
	submissionType?: SubmissionType;
	licenseType?: SubmissionLicenseType;
	publicationYear?: number;
	contentRich?: TipTapDoc;
	pages?: CreateTextSubmissionPageDto[];
	status?: TextSubmissionStatus;
}

export interface UpdateTextSubmissionDto {
	title?: string;
	language?: string;
	author?: string;
	sourceUrl?: string;
	content?: string;
	comment?: string;
	submissionType?: SubmissionType;
	licenseType?: SubmissionLicenseType;
	publicationYear?: number;
	contentRich?: TipTapDoc;
	pages?: CreateTextSubmissionPageDto[];
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
	draft: number;
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
	// New: filter owner list by status (e.g. DRAFT, REJECTED)
	status?: TextSubmissionStatus;
}

// ─── New types ─────────────────────────────────────────────────────────────

export type SubmissionType = "ORIGINAL" | "EXTERNAL";

export type SubmissionLicenseType =
	| "PUBLIC_DOMAIN"
	| "CC"
	| "PERMISSION"
	| "UNKNOWN";
