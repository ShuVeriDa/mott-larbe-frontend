import type { TipTapDoc, TipTapMark, TipTapNode } from "@/shared/ui/notion-editor";
import type { CefrLevel, LearningLevel } from "@/shared/types";
import type { AppLanguage } from "@/shared/lib/languages";

export type { TipTapDoc, TipTapMark, TipTapNode };

export type TextLanguage = AppLanguage;

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
	displayText?: string;
}

export interface ScriptPageResponse {
	contentRich: TipTapDoc;
	tokens: TextToken[];
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

export interface TextSubmittedBy {
	id: string;
	name: string | null;
	surname: string | null;
	username: string;
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
	submittedBy?: TextSubmittedBy | null;
}

export interface TextProgressResponse {
	progress: number;
}

export interface BookmarkResponse {
	bookmarked: boolean;
}
