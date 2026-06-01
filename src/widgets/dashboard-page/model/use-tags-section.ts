"use client";

import { useLibraryTags } from "@/entities/library-text";

export const useTagsSection = () => {
	const { data: tags, isPending } = useLibraryTags();
	return { tags: tags ?? [], isPending };
};
