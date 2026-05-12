import type { CefrLevel, LearningLevel } from "@/shared/types";

export type TextLanguage = "CHE" | "RU" | "EN" | string;

export interface TextToken {
	id: string;
	position: number;
	original: string;
	normalized: string;
	lemmaId: string | null;
	userStatus: LearningLevel | null;
	startOffset: number;
	endOffset: number;
}

export interface TextPageData {
	id: string;
	pageNumber: number;
	title: string | null;
	contentRich: unknown;
	contentRaw: string;
}

export interface TextPageTag {
	id: string;
	name: string;
}

export interface TextPageResponse {
	id: string;
	title: string;
	author: string | null;
	language: TextLanguage;
	level: CefrLevel | null;
	tags?: TextPageTag[];
	imageUrl: string | null;
	totalPages: number;
	wordCount: number;
	progress: number;
	page: TextPageData;
	tokens: TextToken[];
	bookmarked?: boolean;
}

export interface TextProgressResponse {
	progress: number;
}

export interface BookmarkResponse {
	bookmarked: boolean;
}
