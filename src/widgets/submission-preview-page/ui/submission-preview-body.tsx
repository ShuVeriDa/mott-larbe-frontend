"use client";

import { ArticleRich } from "@/entities/text";
import { Typography } from "@/shared/ui/typography";
import type { TextSubmissionPage } from "@/features/text-submission";
import type { TipTapDoc } from "@/entities/text";
import type { MouseEvent } from "react";

const NOOP_SELECT = (_token: unknown, _e: MouseEvent<HTMLSpanElement>) => {};

interface SubmissionPreviewBodyProps {
	page: TextSubmissionPage;
	pageNumber: number;
	totalPages: number;
}

export const SubmissionPreviewBody = ({
	page,
	pageNumber,
	totalPages,
}: SubmissionPreviewBodyProps) => (
	<main className="mx-auto w-full max-w-[720px] px-6 py-10 max-md:px-4">
		{page.title && (
			<Typography
				tag="h2"
				className="mb-6 text-[18px] font-semibold text-t-1"
			>
				{page.title}
			</Typography>
		)}

		{totalPages > 1 && (
			<Typography tag="p" className="mb-6 text-[12px] text-t-3">
				{pageNumber} / {totalPages}
			</Typography>
		)}

		<ArticleRich
			contentRich={page.contentRich as TipTapDoc}
			tokens={[]}
			onSelectToken={NOOP_SELECT}
			maxWidth="100%"
		/>
	</main>
);
