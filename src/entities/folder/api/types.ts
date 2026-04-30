import type { LearningLevel } from "@/shared/types";

export interface Folder {
	id: string;
	name: string;
	description: string | null;
	color: string;
	sortOrder: number;
	wordCounts: Record<LearningLevel, number>;
	total: number;
	progress: number;
	lastModified: string;
}

export interface CreateFolderDto {
	name: string;
	description?: string | null;
	color?: string;
}
