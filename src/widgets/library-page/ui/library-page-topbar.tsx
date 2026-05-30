"use client";

import { LibraryTopbar } from "@/widgets/library-topbar";
import { useLibraryPage, type LibraryPageState } from "../model/use-library-page";

interface LibraryPageTopbarProps {
	title?: string;
	state?: LibraryPageState;
}

export const LibraryPageTopbar = ({ title, state }: LibraryPageTopbarProps) => {
	const ownState = useLibraryPage();
	const { counts, handleRefresh } = state ?? ownState;

	return (
		<LibraryTopbar
			counts={counts}
			onRefresh={handleRefresh}
			title={title}
		/>
	);
};
