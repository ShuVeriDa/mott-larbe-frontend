import type { CefrLevel, LearningLevel } from "@/shared/types";

export type TextLanguage = "CHE" | "RU" | "EN" | string;

export interface TextToken {
	id: string;
	position: number;
	original: string;
	normalized: string;
	lemmaId: string | null;
	vocabId: string | null;
	isKnown: boolean;
	userStatus: LearningLevel | null;
	startOffset: number;
	endOffset: number;
}

export interface TipTapMark {
	type: string;
	attrs?: Record<string, unknown>;
}

export interface TipTapNode {
	type: string;
	text?: string;
	marks?: TipTapMark[];
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
}

export interface TipTapDoc {
	type: "doc";
	content?: TipTapNode[];
}

export interface TextPageData {
	id: string;
	pageNumber: number;
	title: string | null;
	contentRich: TipTapDoc;
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
