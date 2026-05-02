export type TokenizationTab = "all" | "issues" | "notfound" | "pending";
export type TokenSort = "errors" | "date" | "name";
export type TokenStatus = "ANALYZED" | "AMBIGUOUS" | "NOT_FOUND";
export type ProcessingStatus = "IDLE" | "RUNNING" | "COMPLETED" | "ERROR";
export type TokenSource = "ADMIN" | "CACHE" | "MORPHOLOGY" | "ONLINE";
export type RunScope = "pending" | "errors" | "all";
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface TokenizationStats {
	totalTokens: number;
	analyzedCount: number;
	analyzedPercent: number;
	ambiguousCount: number;
	ambiguousPercent: number;
	notFoundCount: number;
	notFoundPercent: number;
	textsWithoutProcessing: number;
	tabs: {
		all: number;
		issues: number;
		notfound: number;
		pending: number;
	};
}

export interface TokenizationDistribution {
	total: number;
	analyzed: number;
	analyzedPercent: number;
	ambiguous: number;
	ambiguousPercent: number;
	notFound: number;
	notFoundPercent: number;
	sources: {
		admin: number;
		cache: number;
		morphology: number;
		online: number;
	};
}

export interface TokenizationSettings {
	id: number;
	autoTokenize: boolean;
	normalization: boolean;
	morphAnalysis: boolean;
	onlineDictionaries: boolean;
}

export interface UpdateTokenizationSettingsDto {
	autoTokenize?: boolean;
	normalization?: boolean;
	morphAnalysis?: boolean;
	onlineDictionaries?: boolean;
}

export interface TokenizationTextItem {
	id: string;
	title: string;
	level: CefrLevel | null;
	pagesCount: number;
	processingStatus: ProcessingStatus;
	processingProgress: number;
	tokenizationVersion: number | null;
	totalTokens: number;
	analyzedCount: number;
	notFoundCount: number;
	ambiguousCount: number;
	analyzePercent: number;
	processedAt: string | null;
}

export interface TokenizationTextDetail {
	id: string;
	title: string;
	level: CefrLevel | null;
	processingStatus: ProcessingStatus;
	processingProgress: number;
	version: {
		id: string;
		version: number;
		status: ProcessingStatus;
		isCurrent: boolean;
		processedAt?: string | null;
	} | null;
	tokenStats: {
		total: number;
		analyzed: number;
		ambiguous: number;
		notFound: number;
		analyzePercent: number;
		ambiguousPercent: number;
		notFoundPercent: number;
	};
	sources: {
		admin: number;
		cache: number;
		morphology: number;
		online: number;
	};
}

export interface ProblematicToken {
	id: string;
	original: string;
	normalized: string;
	status: TokenStatus;
	source: TokenSource;
	pageNumber: number;
	position: number;
}

export interface TokenizationTextListResponse {
	data: TokenizationTextItem[];
	total: number;
	page: number;
	limit: number;
}

export interface ProblematicTokensResponse {
	data: ProblematicToken[];
	total: number;
	page: number;
	limit: number;
}

export interface QueueItem {
	textId: string;
	title: string;
	progress: number;
	queueStatus: string;
}

export interface TokenizationQueue {
	items: QueueItem[];
	count: number;
}

export interface FetchTokenizationTextsQuery {
	tab?: TokenizationTab;
	search?: string;
	level?: CefrLevel | "";
	sort?: TokenSort;
	page?: number;
	limit?: number;
}

export interface RunTokenizationDto {
	scope: RunScope;
}
