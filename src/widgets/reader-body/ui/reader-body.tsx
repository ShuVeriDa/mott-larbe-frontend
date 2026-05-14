"use client";
import { ArticleRich, useNoteLineGroups, usePagePhrases, type TextPageResponse } from "@/entities/text";
import {
	FONT_FAMILY_CLASS,
	useReaderFontFamily,
} from "@/features/reader-font-family";
import { FONT_SIZE_PX, useReaderFontSize } from "@/features/reader-font-size";
import {
	HIGHLIGHT_COLOR_HEX,
	HighlightColorPicker,
	useHighlightVisibility,
} from "@/features/reader-highlight";
import {
	COLUMN_WIDTH_PX,
	LETTER_SPACING_VALUE,
	LINE_HEIGHT_VALUE,
	PAGE_PADDING_CLASS,
	PARAGRAPH_SPACING_VALUE,
	useReaderTextLayout,
} from "@/features/reader-text-width";
import { useReaderTheme } from "@/features/reader-theme";
import { useSelectToken, useWordLookupStore } from "@/features/word-lookup";
import { usePhraseMap } from "@/features/phrase-lookup";
import { cn } from "@/shared/lib/cn";
import { MessageSquareMoreIcon } from "lucide-react";
import { type MouseEvent, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useInlineNotes } from "../model/use-inline-notes";
import { useReaderHighlights } from "../model/use-reader-highlights";
import { ArticleHeader } from "./article-header";
import { NoteGroupPopup } from "./note-group-popup";
import { NoteInlinePopup } from "./note-inline-popup";
import { ReaderProgressBar } from "./reader-progress-bar";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";

export interface ReaderBodyProps {
	data: TextPageResponse;
	currentPage: number;
}

export const ReaderBody = ({ data, currentPage }: ReaderBodyProps) => {
	const onSelectToken = useSelectToken();
	const activeToken = useWordLookupStore(s => s.activeToken);

	// Phrase lookup
	const { data: phrasesData } = usePagePhrases(data.id, data.page.pageNumber);
	const phraseMap = usePhraseMap(phrasesData);
	const openPhraseInPopup = useWordLookupStore(s => s.openPhraseInPopup);
	const handleSelectPhrase = useCallback(
		(phrase: PagePhraseOccurrence, anchor: { left: number; top: number; width: number; height: number }) => {
			openPhraseInPopup(phrase, anchor);
		},
		[openPhraseInPopup],
	);
	const highlightsVisible = useHighlightVisibility(s => s.highlightsVisible);
	const theme = useReaderTheme(s => s.theme);
	const bgColor = useReaderTheme(s => s.bgColor);
	const fontSize = useReaderFontSize(s => s.size);
	const fontFamily = useReaderFontFamily(s => s.family);
	const { columnWidth, pagePadding, lineHeight, letterSpacing, paragraphSpacing } =
		useReaderTextLayout();

	const {
		articleRef,
		selection,
		highlights,
		matchedHighlight,
		handlePickColor,
		handleRemoveHighlight,
		handleDismiss,
	} = useReaderHighlights(data.id, data.page.pageNumber, data.page.contentRaw);

	const {
		noteMarks,
		activeNotePopup,
		groupPopup,
		handleNoteGroupClick,
		handleClosePopup,
		handleCloseGroupPopup,
		handleAddNote,
		handleUpdateNote,
		handleDeleteNote,
	} = useInlineNotes(data.id, data.page.pageNumber);

	// Measure note positions after render and group by visual line
	const noteMarkIds = noteMarks.map(n => n.id);
	const noteGroups = useNoteLineGroups(articleRef, noteMarkIds);

	const handleAddNoteFromSelection = (body: string) => {
		if (!selection) return;
		handleAddNote(selection.text, body);
	};

	const highlightMarks = highlightsVisible
		? highlights.map(h => ({
				id: h.id,
				selectedText: h.selectedText,
				color: HIGHLIGHT_COLOR_HEX[h.color],
			}))
		: [];

	const fontVars = {
		"--reader-font-size": `${FONT_SIZE_PX[fontSize]}px`,
		"--reader-line-height": String(LINE_HEIGHT_VALUE[lineHeight]),
		...(theme === "custom" && bgColor ? { backgroundColor: bgColor } : {}),
	};

	return (
		<article
			className={cn(
				"flex-1 overflow-y-auto pt-8 pb-15 max-md:pt-4",
				"bg-bg text-t-1 transition-colors duration-250",
				"[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4",
				PAGE_PADDING_CLASS[pagePadding],
				FONT_FAMILY_CLASS[fontFamily],
			)}
			data-reader-theme={theme}
			style={fontVars}
		>
			<ReaderProgressBar progress={data.progress} />
			<ArticleHeader data={data} currentPage={currentPage} />
			<ArticleRich
				ref={articleRef}
				contentRich={data.page.contentRich}
				tokens={data.tokens}
				activeTokenId={activeToken?.id ?? null}
				onSelectToken={onSelectToken}
				maxWidth={COLUMN_WIDTH_PX[columnWidth]}
				letterSpacing={LETTER_SPACING_VALUE[letterSpacing]}
				paragraphSpacing={PARAGRAPH_SPACING_VALUE[paragraphSpacing]}
				highlights={highlightMarks}
				noteMarks={noteMarks}
				onNoteGroupClick={handleNoteGroupClick}
				phraseMap={phraseMap}
				onSelectPhrase={handleSelectPhrase}
			/>
			{/* Note line group icons — rendered via portal at measured positions */}
			{typeof window !== "undefined" && noteGroups.length > 0 &&
				createPortal(
					<>
						{noteGroups.map(group => (
							<NoteGroupIcon
								key={group.noteIds.join(",")}
								group={group}
								onNoteGroupClick={handleNoteGroupClick}
							/>
						))}
					</>,
					document.body,
				)
			}

			{typeof window !== "undefined" &&
				selection &&
				createPortal(
					<HighlightColorPicker
						x={selection.x}
						y={selection.y}
						onPick={handlePickColor}
						onDismiss={handleDismiss}
						hasExisting={!!matchedHighlight}
						onRemove={matchedHighlight ? handleRemoveHighlight : undefined}
						onAddNote={handleAddNoteFromSelection}
					/>,
					document.body,
				)}
			{typeof window !== "undefined" && activeNotePopup && (
				<NoteInlinePopup
					popup={activeNotePopup}
					onClose={handleClosePopup}
					onUpdate={handleUpdateNote}
					onDelete={handleDeleteNote}
				/>
			)}
			{typeof window !== "undefined" && groupPopup && (
				<NoteGroupPopup
					popup={groupPopup}
					onClose={handleCloseGroupPopup}
					onUpdate={handleUpdateNote}
					onDelete={handleDeleteNote}
				/>
			)}
		</article>
	);
};

interface NoteGroupIconProps {
	group: { noteIds: string[]; x: number; y: number };
	onNoteGroupClick: (noteIds: string[], x: number, y: number) => void;
}

const NoteGroupIcon = ({ group, onNoteGroupClick }: NoteGroupIconProps) => {
	const iconRef = useRef<HTMLButtonElement>(null);

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		onNoteGroupClick(group.noteIds, rect.left + rect.width / 2, rect.bottom);
	};

	return (
		<button
			ref={iconRef}
			data-note-icon="true"
			onMouseDown={e => e.preventDefault()}
			onClick={handleClick}
			style={{
				position: "fixed",
				left: group.x,
				top: group.y,
				zIndex: 50,
			}}
			className={cn(
				"flex items-center gap-0.5 rounded p-0.5",
				"text-amber-400 transition-colors hover:bg-amber-50 hover:text-amber-600",
			)}
		>
			<MessageSquareMoreIcon size={14} strokeWidth={1.8} />
			{group.noteIds.length > 1 && (
				<span className="text-[10px] font-semibold leading-none">
					{group.noteIds.length}
				</span>
			)}
		</button>
	);
};
