"use client";
import type { CSSProperties } from 'react';
import { ArticleTokenized, type TextPageResponse } from "@/entities/text";
import {
	FONT_LINE_HEIGHT,
	FONT_SIZE_PX,
	useReaderFontSize,
} from "@/features/reader-font-size";
import { useSelectToken, useWordLookupStore } from "@/features/word-lookup";
import { ArticleHeader } from "./article-header";
import { ReaderProgressBar } from "./reader-progress-bar";

export interface ReaderBodyProps {
	data: TextPageResponse;
	currentPage: number;
}

export const ReaderBody = ({ data, currentPage }: ReaderBodyProps) => {
	const onSelectToken = useSelectToken();
	const activeToken = useWordLookupStore((s) => s.activeToken);
	const fontSize = useReaderFontSize((s) => s.size);

	const fontVars = {
		"--reader-font-size": `${FONT_SIZE_PX[fontSize]}px`,
		"--reader-line-height": String(FONT_LINE_HEIGHT[fontSize]),
	} as CSSProperties;

	return (
		<article
			className="flex-1 overflow-y-auto px-12 pt-8 pb-15 max-md:px-4 max-md:pt-4 max-md:pb-24 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4"
			style={fontVars}
		>
			<ReaderProgressBar progress={data.progress} />
			<ArticleHeader data={data} currentPage={currentPage} />
			<ArticleTokenized
				contentRaw={data.page.contentRaw}
				tokens={data.tokens}
				activeTokenId={activeToken?.id ?? null}
				onSelectToken={onSelectToken}
			/>
		</article>
	);
};
