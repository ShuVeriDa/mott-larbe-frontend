"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

const buttonClass = cn(
	"inline-flex h-7 w-7 items-center justify-center rounded-base",
	"border-hairline border-bd-1 bg-surf-2 text-t-2",
	"transition-colors duration-150 hover:border-bd-2 hover:text-t-1",
	"aria-disabled:opacity-30 aria-disabled:pointer-events-none",
);

export interface ReaderPagerProps {
	textId: string;
	lang: string;
	currentPage: number;
	totalPages: number;
}

export const ReaderPager = ({
	textId,
	lang,
	currentPage,
	totalPages,
}: ReaderPagerProps) => {
	const { t } = useI18n();
	const prevHref = `/${lang}/reader/${textId}/p/${currentPage - 1}`;
	const nextHref = `/${lang}/reader/${textId}/p/${currentPage + 1}`;
	const hasPrev = currentPage > 1;
	const hasNext = currentPage < totalPages;

	return (
		<div className="flex shrink-0 items-center gap-1">
			<Link
				href={hasPrev ? prevHref : "#"}
				aria-label={t("reader.topbar.prev")}
				aria-disabled={!hasPrev}
				tabIndex={hasPrev ? 0 : -1}
				className={buttonClass}
				prefetch={hasPrev}
			>
				<ChevronLeft className="size-3" strokeWidth={1.6} />
			</Link>
			<Typography tag="span" className="min-w-[42px] px-2 text-center text-[11.5px] font-medium tabular-nums text-t-2">
				{currentPage} / {totalPages}
			</Typography>
			<Link
				href={hasNext ? nextHref : "#"}
				aria-label={t("reader.topbar.next")}
				aria-disabled={!hasNext}
				tabIndex={hasNext ? 0 : -1}
				className={buttonClass}
				prefetch={hasNext}
			>
				<ChevronRight className="size-3" strokeWidth={1.6} />
			</Link>
		</div>
	);
};
