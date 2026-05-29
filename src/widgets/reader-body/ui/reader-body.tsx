"use client";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";
import {
	ArticleRich,
	useNoteLineGroups,
	usePagePhrases,
	type TextPageResponse,
} from "@/entities/text";
import { PhraseTranslatePopup } from "@/features/ai-phrase-translate";
import { usePhraseMap } from "@/features/phrase-lookup";
import {
	FONT_FAMILY_CLASS,
	useReaderFontFamily,
} from "@/features/reader-font-family";
import { FONT_SIZE_PX, useReaderFontSize } from "@/features/reader-font-size";
import {
	HIGHLIGHT_COLOR_HEX,
	HighlightColorPicker,
	useHighlightVisibility,
	usePhraseColorVisibility,
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
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { extractSentence } from "@/shared/lib/extract-sentence";
import { useMounted } from "@/shared/lib/mounted";
import { useSwipe } from "@/shared/lib/swipe/use-swipe";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useInlineNotes } from "../model/use-inline-notes";
import { useReaderHighlights } from "../model/use-reader-highlights";
import { ArticleHeader } from "./article-header";
import { NoteGroupIcon } from "./note-group-icon";
import { NoteGroupPopup } from "./note-group-popup";
import { NoteInlinePopup } from "./note-inline-popup";
import { ReaderProgressBar } from "./reader-progress-bar";

export interface ReaderBodyProps {
	data: TextPageResponse;
	currentPage: number;
	onNavigate?: (delta: -1 | 1) => void;
}

export const ReaderBody = ({ data, currentPage, onNavigate }: ReaderBodyProps) => {
	const mounted = useMounted();
	const { lang } = useI18n();
	const onSelectToken = useSelectToken(data.page.contentRaw);
	const activeToken = useWordLookupStore(s => s.activeToken);

	const [phraseTranslate, setPhraseTranslate] = useState<{
		phrase: string;
		x: number;
		y: number;
		contextSentence?: string;
	} | null>(null);

	// Phrase lookup
	const { data: phrasesData } = usePagePhrases(data.id, data.page.pageNumber);
	const phraseMap = usePhraseMap(phrasesData);
	const openPhraseInPopup = useWordLookupStore(s => s.openPhraseInPopup);
	const handleSelectPhrase = (
		phrase: PagePhraseOccurrence,
		anchor: { left: number; top: number; width: number; height: number },
	) => {
		openPhraseInPopup(phrase, anchor);
	};
	const highlightsVisible = useHighlightVisibility(s => s.highlightsVisible);
	const phraseColorVisible = usePhraseColorVisibility(
		s => s.phraseColorVisible,
	);
	const theme = useReaderTheme(s => s.theme);
	const bgColor = useReaderTheme(s => s.bgColor);
	const fontSize = useReaderFontSize(s => s.size);
	const fontFamily = useReaderFontFamily(s => s.family);
	const {
		columnWidth,
		pagePadding,
		lineHeight,
		letterSpacing,
		paragraphSpacing,
	} = useReaderTextLayout();

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

	const handleTranslatePhrase = () => {
		if (!selection) return;
		const phrase = selection.text;
		const raw = data.page.contentRaw;
		const idx = raw.indexOf(phrase);
		const contextSentence = idx !== -1
			? extractSentence(raw, idx, idx + phrase.length)
			: undefined;
		setPhraseTranslate({ phrase, x: selection.x, y: selection.y, contextSentence });
		handleDismiss();
	};

	const handleClosePhraseTranslate = () => setPhraseTranslate(null);

	const swipe = useSwipe({
		onSwipeLeft: () => {
			if (window.getSelection()?.toString()) return;
			onNavigate?.(-1);
		},
		onSwipeRight: () => {
			if (window.getSelection()?.toString()) return;
			onNavigate?.(1);
		},
		enabled: !!onNavigate,
	});

	const highlightMarks = highlightsVisible
		? highlights.map(h => ({
				id: h.id,
				selectedText: h.selectedText,
				color:
					HIGHLIGHT_COLOR_HEX[h.color as keyof typeof HIGHLIGHT_COLOR_HEX] ??
					h.color,
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
				"relative flex-1 overflow-y-auto pt-8 pb-15 max-md:pt-4",
				"bg-bg text-t-1 transition-colors duration-250",
				"[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4",
				PAGE_PADDING_CLASS[pagePadding],
				FONT_FAMILY_CLASS[fontFamily],
			)}
			data-reader-theme={theme}
			style={fontVars}
			onPointerDown={swipe.onPointerDown}
			onPointerUp={swipe.onPointerUp}
			onPointerCancel={swipe.onPointerCancel}
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
				phraseColorVisible={phraseColorVisible}
				pageNumber={currentPage}
			/>
			{/* Note line group icons — rendered via portal at measured positions */}
			{mounted && noteGroups.length > 0 &&
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
				)}

			{mounted && selection &&
				createPortal(
					<HighlightColorPicker
						x={selection.x}
						y={selection.y}
						onPick={handlePickColor}
						onDismiss={handleDismiss}
						hasExisting={!!matchedHighlight}
						onRemove={matchedHighlight ? handleRemoveHighlight : undefined}
						onAddNote={handleAddNoteFromSelection}
						onTranslatePhrase={handleTranslatePhrase}
					/>,
					document.body,
				)}
			{mounted && (
				<AnimatePresence>
					{phraseTranslate && (
						<PhraseTranslatePopup
							phrase={phraseTranslate.phrase}
							x={phraseTranslate.x}
							y={phraseTranslate.y}
							contextSentence={phraseTranslate.contextSentence}
							lang={lang}
							onClose={handleClosePhraseTranslate}
						/>
					)}
				</AnimatePresence>
			)}
			{mounted && (
				<AnimatePresence>
					{activeNotePopup && (
						<NoteInlinePopup
							popup={activeNotePopup}
							onClose={handleClosePopup}
							onUpdate={handleUpdateNote}
							onDelete={handleDeleteNote}
						/>
					)}
				</AnimatePresence>
			)}
			{mounted && (
				<AnimatePresence>
					{groupPopup && (
						<NoteGroupPopup
							popup={groupPopup}
							onClose={handleCloseGroupPopup}
							onUpdate={handleUpdateNote}
							onDelete={handleDeleteNote}
						/>
					)}
				</AnimatePresence>
			)}
		</article>
	);
};

