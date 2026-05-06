export type TextStatus = "draft" | "published" | "archived";
export type ProcessingStatus = "IDLE" | "RUNNING" | "COMPLETED" | "ERROR";
export type TextLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type TextLanguage = "CHE" | "RU" | "AR" | "EN";
export type TextSortBy = "createdAt" | "title" | "level" | "readCount";
export type TextSortOrder = "asc" | "desc";
export type AdminTextsTab = "all" | "published" | "draft" | "archived" | "processing" | "error";

export interface TextTag {
	id: string;
	name: string;
}

export interface AdminTextListItem {
	id: string;
	title: string;
	level: TextLevel | null;
	language: TextLanguage;
	status: TextStatus;
	publishedAt: string | null;
	archivedAt: string | null;
	processingStatus: ProcessingStatus;
	processingProgress: number;
	tokenCount: number;
	tags: TextTag[];
	readCount: number;
	createdAt: string;
}

export interface AdminTextsListResponse {
	items: AdminTextListItem[];
	page: number;
	limit: number;
	total: number;
}

export interface AdminTextsStats {
	totalCount: number;
	totalGrowthPerMonth: number;
	publishedCount: number;
	publishedPercent: number;
	draftCount: number;
	archivedCount: number;
	processingCount: number;
	errorCount: number;
}

export interface FetchAdminTextsQuery {
	search?: string;
	level?: TextLevel | "";
	tagId?: string;
	status?: AdminTextsTab;
	sortBy?: TextSortBy;
	sortOrder?: TextSortOrder;
	page?: number;
	limit?: number;
}

export interface BulkTextsResult {
	updated?: number;
	started?: number;
	deleted?: number;
}

export interface PublishResult {
	textId: string;
	published: boolean;
}

export interface ProcessTextDto {
	useNormalization?: boolean;
	useMorphAnalysis?: boolean;
}

export interface ProcessResult {
	textId: string;
	started: boolean;
}

export interface CreateTextPageDto {
	pageNumber: number;
	title?: string;
	contentRich: { type: string; content?: unknown[] };
}

export interface CreateTextDto {
	title: string;
	language: TextLanguage;
	level?: TextLevel | null;
	description?: string;
	author?: string;
	source?: string;
	imageUrl?: string | null;
	tagIds?: string[];
	tagNames?: string[];
	status?: TextStatus;
	autoTokenize?: boolean;
	autoTokenizeOnSave?: boolean;
	useNormalization?: boolean;
	useMorphAnalysis?: boolean;
	pages: CreateTextPageDto[];
}

export interface UpdateTextDto {
	title?: string;
	language?: TextLanguage;
	level?: TextLevel | null;
	description?: string;
	author?: string;
	source?: string | null;
	imageUrl?: string | null;
	pages?: CreateTextPageDto[];
	tagIds?: string[];
	tagNames?: string[];
	status?: TextStatus;
	autoTokenizeOnSave?: boolean;
	useNormalization?: boolean;
	useMorphAnalysis?: boolean;
}

export interface TextPageDetail {
	id: string;
	pageNumber: number;
	title: string | null;
	contentRich: { type: string; content?: unknown[] };
	contentRaw: string;
	tokenCount: number;
	wordCount: number;
}

export interface AdminTextDetail {
	id: string;
	title: string;
	description: string | null;
	language: TextLanguage;
	level: TextLevel | null;
	author: string | null;
	source: string | null;
	imageUrl: string | null;
	publishedAt: string | null;
	archivedAt: string | null;
	status: TextStatus;
	processingStatus: ProcessingStatus;
	processingProgress: number;
	autoTokenizeOnSave: boolean;
	useNormalization: boolean;
	useMorphAnalysis: boolean;
	pages: TextPageDetail[];
	tags: TextTag[];
	tokenCount: number;
	createdAt: string;
	updatedAt: string;
}

export type ProcessingTrigger = "MANUAL" | "AUTO_ON_SAVE" | "AUTO_ON_CREATE";
export type VersionLogLevel = "INFO" | "OK" | "WARN" | "ERROR";
export type VersionPageStatus = "OK" | "ERROR" | "SKIPPED";

export interface VersionInitiator {
	id: string;
	name: string;
}

export interface TextVersionListItem {
	id: string;
	version: number;
	label: string | null;
	status: ProcessingStatus;
	progress: number;
	isCurrent: boolean;
	trigger: ProcessingTrigger;
	initiator: VersionInitiator | null;
	tokenCount: number;
	unknownCount: number;
	pageCount: number;
	durationMs: number | null;
	errorMessage: string | null;
	useNormalization: boolean;
	useMorphAnalysis: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface TextVersionsListResponse {
	textId: string;
	total: number;
	successCount: number;
	errorCount: number;
	data: TextVersionListItem[];
}

export interface VersionPageStat {
	pageId: string;
	pageNumber: number;
	tokenCount: number;
	wordCount: number;
	charCount: number;
	status: VersionPageStatus;
}

export interface VersionLogEntry {
	id: string;
	timestamp: string;
	level: VersionLogLevel;
	message: string;
}

export interface TextVersionDetail {
	id: string;
	version: number;
	label: string | null;
	status: ProcessingStatus;
	progress: number;
	isCurrent: boolean;
	trigger: ProcessingTrigger;
	initiator: VersionInitiator | null;
	durationMs: number | null;
	errorMessage: string | null;
	useNormalization: boolean;
	useMorphAnalysis: boolean;
	createdAt: string;
	updatedAt: string;
	totalTokenCount: number;
	totalWordCount: number;
	totalCharCount: number;
	pages: VersionPageStat[];
	logs: VersionLogEntry[];
}

export interface RestoreVersionResult {
	versionId: string;
	restored: boolean;
}

export interface RetryVersionResult {
	textId: string;
	started: boolean;
}

export interface BulkImportResultItem {
	index: number;
	status: "ok" | "error";
	textId?: string;
	title?: string;
	error?: string;
}

export interface BulkImportResult {
	total: number;
	created: number;
	failed: number;
	items: BulkImportResultItem[];
}

export interface UnknownWordItem {
	word: string;
	count: number;
}

export interface AdminTextUnknownWords {
	versionId: string;
	version: number;
	items: UnknownWordItem[];
	total: number;
}

export interface SseProgressEvent {
	id: string;
	version: number;
	status: ProcessingStatus | "NONE";
	progress: number;
	errorMessage: string | null;
	durationMs: number | null;
	isCurrent: boolean;
	updatedAt: string;
}
