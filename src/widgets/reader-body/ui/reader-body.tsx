"use client";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";
import {
	ArticleRich,
	resolveCyrillicText,
	useNoteLineGroups,
	usePagePhrases,
	useScriptPage,
	type TextPageResponse,
} from "@/entities/text";
import { PhraseTranslatePopup, PhraseTranslateSheet } from "@/features/ai-phrase-translate";
import { usePhraseMap } from "@/features/phrase-lookup";
import {
	FONT_FAMILY_CLASS,
	useReaderFontFamily,
} from "@/features/reader-font-family";
import { useReaderFontSize } from "@/features/reader-font-size";
import { useReaderArabicSettings } from "@/features/reader-arabic-settings";
import { FONT_FAMILY_META } from "@/features/reader-font-family";
import {
	HIGHLIGHT_COLOR_HEX,
	HighlightColorPicker,
	useHighlightVisibility,
	usePhraseColorVisibility,
} from "@/features/reader-highlight";
import {
	stripArabicDiacritics,
	stripDiacriticsFromDoc,
	useReaderScript,
} from "@/features/reader-script";
import {
	convertTokensToOld,
} from "@/shared/lib/chechen-ortho";
import {
	COLUMN_WIDTH_PX,
	LETTER_SPACING_VALUE,
	LINE_HEIGHT_VALUE,
	PAGE_PADDING_CLASS,
	PARAGRAPH_SPACING_VALUE,
	WORD_SPACING_VALUE,
	useReaderTextLayout,
} from "@/features/reader-text-width";
import { useReaderTheme } from "@/features/reader-theme";
import { useSelectToken, useWordLookupStore } from "@/features/word-lookup";
import { useSettings } from "@/entities/settings";
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

export interface ReaderBodyProps {
	data: TextPageResponse;
	currentPage: number;
	onNavigate?: (delta: -1 | 1) => void;
}

export const ReaderBody = ({ data, currentPage, onNavigate }: ReaderBodyProps) => {
	const mounted = useMounted();
	const { lang } = useI18n();
	const { data: settings } = useSettings();
	const popupMode = settings?.preferences.popupMode ?? "POPUP";
	const mobileDisplayMode = settings?.preferences.mobileDisplayMode ?? "SHEET";
	const showProgress = settings?.preferences.showProgress ?? true;
	const onSelectToken = useSelectToken(data.page.contentRaw, popupMode, mobileDisplayMode);
	const activeToken = useWordLookupStore(s => s.activeToken);

	// Script selection
	const { script, showDiacritics, orthography } = useReaderScript();
	const scriptQuery = useScriptPage(
		data.id,
		data.page.pageNumber,
		script !== "CYRILLIC" ? script : null,
	);
	const isNonCyrillic = script !== "CYRILLIC";
	const scriptData = isNonCyrillic ? scriptQuery.data : null;
	const displayContentRich = scriptData?.contentRich ?? data.page.contentRich;
	const displayTokens = scriptData?.tokens ?? data.tokens;
	const applyDiacriticsStrip = script === "ARABIC" && !showDiacritics;
	const isOldOrtho = orthography === "OLD";
	const articleLang = script === "ARABIC" || data.language === "AR" ? "ar" : script === "LATIN" ? "che-Latn" : lang;
	const tokensAfterDiacritics = applyDiacriticsStrip
		? displayTokens.map(t =>
			t.displayText ? { ...t, displayText: stripArabicDiacritics(t.displayText) } : t,
		  )
		: displayTokens;
	const tokensForDisplay = isOldOrtho
		? convertTokensToOld(tokensAfterDiacritics)
		: tokensAfterDiacritics;

	const [phraseTranslate, setPhraseTranslate] = useState<{
		phrase: string;
		displayPhrase?: string;
		x: number;
		y: number;
		bottom: number;
		contextSentence?: string;
		useSheet: boolean;
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
	const arabicFamily = useReaderFontFamily(s => s.arabicFamily);
	const {
		columnWidth,
		pagePadding,
		lineHeight,
		letterSpacing,
		paragraphSpacing,
		wordSpacing,
	} = useReaderTextLayout();
	const { arabicFontSize } = useReaderArabicSettings();
	const arabicFontCssValue = FONT_FAMILY_META[arabicFamily]?.cssValue ?? "var(--font-scheherazade), serif";

	const {
		articleRef,
		selection,
		highlights,
		matchedHighlight,
		handlePickColor,
		handleRemoveHighlight,
		handleDismiss,
		isTokenInRange,
		onTokenLongPress,
		onTokenRangeTap,
	} = useReaderHighlights(data.id, data.page.pageNumber, data.page.contentRaw, tokensForDisplay, isNonCyrillic);

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
		const cyrillicText = isNonCyrillic
			? resolveCyrillicText(selection.text, displayTokens, data.page.contentRaw)
			: selection.text;
		handleAddNote(cyrillicText, body);
	};

	const handleTranslatePhrase = () => {
		if (!selection) return;
		const cyrillicPhrase = isNonCyrillic
			? resolveCyrillicText(selection.text, displayTokens, data.page.contentRaw)
			: selection.text;
		const raw = data.page.contentRaw;
		const idx = raw.indexOf(cyrillicPhrase);
		const contextSentence = idx !== -1
			? extractSentence(raw, idx, idx + cyrillicPhrase.length)
			: undefined;
		const isMobile = typeof window !== "undefined" && window.innerWidth <= 767;
		const useSheet = isMobile && mobileDisplayMode === "SHEET";
		setPhraseTranslate({
			phrase: cyrillicPhrase,
			displayPhrase: isNonCyrillic ? selection.text : undefined,
			x: selection.x,
			y: selection.y,
			bottom: selection.bottom,
			contextSentence,
			useSheet,
		});
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

	// Two independent RTL triggers that must never be merged into one flag:
	// (a) isArabicScript — CHE text transliterated into Arabic script (ChScript toggle).
	// (b) isArabicLanguage — the text's own language is AR (a real Arabic text).
	// A text can only ever be one or the other: the ChScript toggle only exists
	// for CHE texts, and AR-language texts don't expose it (see ScriptSwitcher below).
	const isArabicScript = script === "ARABIC";
	const isArabicLanguage = data.language === "AR";
	const isRtlDisplay = isArabicScript || isArabicLanguage;
	const contentRichAfterDiacritics = applyDiacriticsStrip
		? stripDiacriticsFromDoc(displayContentRich)
		: displayContentRich;
	// Old orthography: tokens carry converted displayText — no doc conversion needed.
	// We pass the original doc as cyrillicContentRich so offset mapping stays correct.
	const contentRichForDisplay = contentRichAfterDiacritics;
	const fontVars = {
		"--reader-font-size": isRtlDisplay ? `${arabicFontSize}px` : `${fontSize}px`,
		"--reader-line-height": String(LINE_HEIGHT_VALUE[lineHeight]),
		"--reader-word-spacing": WORD_SPACING_VALUE[wordSpacing],
		...(isRtlDisplay ? { "--reader-arabic-font": arabicFontCssValue } : {}),
		...(theme === "custom" && bgColor ? { backgroundColor: bgColor } : {}),
	};

	return (
		<article
			className={cn(
				"relative flex-1 overflow-y-auto pt-8 pb-15 max-md:pt-4",
				"bg-bg text-t-1 transition-colors duration-250",
				"[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4",
				PAGE_PADDING_CLASS[pagePadding],
				isRtlDisplay ? "arabic-script" : FONT_FAMILY_CLASS[fontFamily],
			)}
			data-reader-theme={theme}
			dir={isRtlDisplay ? "rtl" : undefined}
			lang={articleLang}
			style={fontVars}
			onPointerDown={swipe.onPointerDown}
			onPointerUp={swipe.onPointerUp}
			onPointerCancel={swipe.onPointerCancel}
		>
			<ArticleHeader data={data} currentPage={currentPage} showProgress={showProgress} />
			<ArticleRich
				ref={articleRef}
				contentRich={contentRichForDisplay}
				tokens={tokensForDisplay}
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
				isRtl={isRtlDisplay}
				cyrillicRaw={isNonCyrillic || isOldOrtho ? data.page.contentRaw : undefined}
				cyrillicContentRich={isNonCyrillic || isOldOrtho ? data.page.contentRich : undefined}
				isTokenInRange={isTokenInRange}
				onTokenLongPress={onTokenLongPress}
				onTokenRangeTap={onTokenRangeTap}
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
						bottom={selection.bottom}
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
					{phraseTranslate && !phraseTranslate.useSheet && (
						<PhraseTranslatePopup
							key={phraseTranslate.phrase}
							phrase={phraseTranslate.phrase}
							displayPhrase={phraseTranslate.displayPhrase}
							x={phraseTranslate.x}
							y={phraseTranslate.y}
							bottom={phraseTranslate.bottom}
							contextSentence={phraseTranslate.contextSentence}
							lang={lang}
							onClose={handleClosePhraseTranslate}
						/>
					)}
				</AnimatePresence>
			)}
			{mounted && (
				<PhraseTranslateSheet
					open={!!phraseTranslate?.useSheet}
					phrase={phraseTranslate?.phrase ?? ""}
					displayPhrase={phraseTranslate?.displayPhrase}
					contextSentence={phraseTranslate?.contextSentence}
					lang={lang}
					onClose={handleClosePhraseTranslate}
				/>
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

