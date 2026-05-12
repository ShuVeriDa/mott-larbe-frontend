"use client";
import { ArticleRich, type TextPageResponse } from "@/entities/text";
import {
	FONT_FAMILY_CLASS,
	useReaderFontFamily,
} from "@/features/reader-font-family";
import { FONT_SIZE_PX, useReaderFontSize } from "@/features/reader-font-size";
import {
	HIGHLIGHT_COLOR_HEX,
	HighlightColorPicker,
} from "@/features/reader-highlight";
import {
	COLUMN_WIDTH_PX,
	LETTER_SPACING_VALUE,
	LINE_HEIGHT_VALUE,
	PAGE_PADDING_CLASS,
	useReaderTextLayout,
} from "@/features/reader-text-width";
import { useReaderTheme } from "@/features/reader-theme";
import { useSelectToken, useWordLookupStore } from "@/features/word-lookup";
import { cn } from "@/shared/lib/cn";
import { createPortal } from "react-dom";
import { useReaderHighlights } from "../model/use-reader-highlights";
import { ArticleHeader } from "./article-header";
import { ReaderProgressBar } from "./reader-progress-bar";

export interface ReaderBodyProps {
	data: TextPageResponse;
	currentPage: number;
}

export const ReaderBody = ({ data, currentPage }: ReaderBodyProps) => {
	const onSelectToken = useSelectToken();
	const activeToken = useWordLookupStore(s => s.activeToken);
	const theme = useReaderTheme(s => s.theme);
	const bgColor = useReaderTheme(s => s.bgColor);
	const fontSize = useReaderFontSize(s => s.size);
	const fontFamily = useReaderFontFamily(s => s.family);
	const { columnWidth, pagePadding, lineHeight, letterSpacing } =
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

	const highlightMarks = highlights.map(h => ({
		id: h.id,
		selectedText: h.selectedText,
		color: HIGHLIGHT_COLOR_HEX[h.color],
	}));

	const fontVars = {
		"--reader-font-size": `${FONT_SIZE_PX[fontSize]}px`,
		"--reader-line-height": String(LINE_HEIGHT_VALUE[lineHeight]),
		...(theme === "custom" && bgColor ? { backgroundColor: bgColor } : {}),
	};

	return (
		<article
			className={cn(
				"flex-1 overflow-y-auto pt-8 pb-15 max-md:pt-4",
				"[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4",
				PAGE_PADDING_CLASS[pagePadding],
				FONT_FAMILY_CLASS[fontFamily],
			)}
			data-reader-theme={theme === "default" ? undefined : theme}
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
				highlights={highlightMarks}
			/>
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
					/>,
					document.body,
				)}
		</article>
	);
};
