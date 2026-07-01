"use client";

import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import { useSpellingCorrectionPopup } from "../model/use-spelling-correction-popup";
import { useSpellingCorrectionSync } from "../model/use-spelling-correction-sync";
import { useSpellingOccurrencesDialog } from "../model/use-spelling-occurrences-dialog";
import { SpellingOccurrencesDialog } from "./spelling-occurrences-dialog";

interface SpellingCorrectionOverlayProps {
	editor: Editor | null;
	children: ReactNode;
}

export const SpellingCorrectionOverlay = ({
	editor,
	children,
}: SpellingCorrectionOverlayProps) => {
	useSpellingCorrectionSync(editor);

	const {
		dialog,
		deselected,
		selectedCount,
		allChecked,
		someChecked,
		open,
		close,
		handleToggle,
		handleToggleAll,
		handleSelectCorrectForm,
		handleApply,
	} = useSpellingOccurrencesDialog(editor);

	const { containerRef } = useSpellingCorrectionPopup(editor, { onOpen: open });

	return (
		<div ref={containerRef} className="relative">
			{children}
			<SpellingOccurrencesDialog
				dialog={dialog}
				deselected={deselected}
				selectedCount={selectedCount}
				allChecked={allChecked}
				someChecked={someChecked}
				onToggle={handleToggle}
				onToggleAll={handleToggleAll}
				onSelectCorrectForm={handleSelectCorrectForm}
				onApply={handleApply}
				onClose={close}
			/>
		</div>
	);
};
