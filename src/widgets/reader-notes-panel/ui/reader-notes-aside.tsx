"use client";

import { cn } from "@/shared/lib/cn";
import { useEscapeToClose } from "@/shared/lib/escape-to-close";
import type { ReaderNotesPanelProps } from "../model/types";
import { NotesChromeHeader } from "./notes-chrome-header";
import { NotesPanelBody } from "./notes-panel-body";

export const ReaderNotesAside = ({
	textId,
	pageNumber,
	open,
	onClose,
}: ReaderNotesPanelProps) => {
	useEscapeToClose(open, onClose);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-[0.5px] transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<NotesChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<NotesPanelBody textId={textId} pageNumber={pageNumber} />
			</div>
		</aside>
	);
};
