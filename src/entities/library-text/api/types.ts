import type { CefrLevel } from "@/shared/types";

export type LibraryTextLanguage = "CHE" | "RU" | "EN";
export type LibraryProgressStatus = "NEW" | "IN_PROGRESS" | "COMPLETED";
export type LibrarySortOption =
	| "newest"
	| "oldest"
	| "alpha"
	| "progress"
	| "length"
	| "level";

export interface TextTagDto {
	id: string;
	name: string;
}

export interface LibraryTextListItem {
	id: string;
	title: string;
	description: string | null;
	language: LibraryTextLanguage;
	level: CefrLevel | null;
	author: string | null;
	imageUrl: string | null;
	tags: TextTagDto[];
	wordCount: number;
	readingTime: number;
	progressPercent: number;
	progressStatus: LibraryProgressStatus;
	lastOpened: string | null;
	isNew: boolean;
	isFavorite: boolean;
}

export interface LibraryTextCounts {
	total: number;
	new: number;
	inProgress: number;
	completed: number;
}

export interface GetLibraryTextsResponse {
	items: LibraryTextListItem[];
	page: number;
	limit: number;
	counts: LibraryTextCounts;
}

export interface GetLibraryTextsQuery {
	language?: LibraryTextLanguage[];
	level?: CefrLevel[];
	status?: LibraryProgressStatus;
	orderBy?: LibrarySortOption;
	search?: string;
	page?: number;
	limit?: number;
}
