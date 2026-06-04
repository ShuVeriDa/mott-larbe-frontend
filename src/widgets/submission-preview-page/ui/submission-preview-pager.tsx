"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SubmissionPreviewPagerProps {
	submissionId: string;
	lang: string;
	currentPageNumber: number;
	totalPages: number;
	t: (key: string) => string;
}

export const SubmissionPreviewPager = ({
	submissionId,
	lang,
	currentPageNumber,
	totalPages,
	t,
}: SubmissionPreviewPagerProps) => {
	if (totalPages <= 1) return null;

	const prevPage = currentPageNumber > 1 ? currentPageNumber - 1 : null;
	const nextPage = currentPageNumber < totalPages ? currentPageNumber + 1 : null;
	const basePath = `/${lang}/admin/text-submissions/${submissionId}/preview`;

	return (
		<nav
			aria-label={t("adminTextSubmissions.preview.pagination")}
			className="flex shrink-0 items-center justify-center gap-2 border-t border-bd-1 bg-surf py-2"
		>
			{prevPage ? (
				<Button asChild variant="ghost">
					<Link href={`${basePath}?page=${prevPage}`}>
						<ChevronLeft className="size-3.5" />
						{t("adminTextSubmissions.preview.prev")}
					</Link>
				</Button>
			) : (
				<Button variant="ghost" disabled>
					<ChevronLeft className="size-3.5" />
					{t("adminTextSubmissions.preview.prev")}
				</Button>
			)}

			<Typography tag="span" className="min-w-[52px] text-center text-[12px] text-t-3">
				{currentPageNumber} / {totalPages}
			</Typography>

			{nextPage ? (
				<Button asChild variant="ghost">
					<Link href={`${basePath}?page=${nextPage}`}>
						{t("adminTextSubmissions.preview.next")}
						<ChevronRight className="size-3.5" />
					</Link>
				</Button>
			) : (
				<Button variant="ghost" disabled>
					{t("adminTextSubmissions.preview.next")}
					<ChevronRight className="size-3.5" />
				</Button>
			)}
		</nav>
	);
};
