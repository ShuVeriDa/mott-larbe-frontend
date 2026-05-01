import type { LearningLevel } from "@/shared/types";

export interface Folder {
	id: string;
	name: string;
	description: string | null;
	color: string | null;
	icon: string | null;
	sortOrder: number;
	wordCounts: Record<LearningLevel, number>;
	total: number;
	progress: number;
	lastModified: string | null;
	updatedAt: string;
}

export interface FoldersSummary {
	foldersCount: number;
	wordsInFolders: number;
	knownWords: number;
	wordsWithoutFolder: number;
	maxFolders: number;
}

export interface CreateFolderDto {
	name: string;
	description?: string | null;
	color?: string;
	icon?: string;
}

export interface UpdateFolderDto {
	name?: string;
	description?: string | null;
	color?: string;
	icon?: string;
	sortOrder?: number;
}

export interface BulkAssignItem {
	id: string;
	folderId: string | null;
}

export interface BulkAssignDto {
	assignments: BulkAssignItem[];
}

export interface ReorderFoldersDto {
	orderedIds: string[];
}
