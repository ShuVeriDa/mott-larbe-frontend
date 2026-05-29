"use client";

import { useI18n } from "@/shared/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ReaderMobileNavProps {
	textId: string;
	lang: string;
	currentPage: number;
	totalPages: number;
}

export const ReaderMobileNav = ({
	textId,
	lang,
	currentPage,
	totalPages,
}: ReaderMobileNavProps) => {
	const { t } = useI18n();
	const hasPrev = currentPage > 1;
	const hasNext = currentPage < totalPages;
	const prevHref = `/${lang}/reader/${textId}/p/${currentPage - 1}`;
	const nextHref = `/${lang}/reader/${textId}/p/${currentPage + 1}`;

	return (
		<nav className="fixed bottom-[calc(56px+env(safe-area-inset-bottom))] inset-x-0 z-91 hidden max-md:flex items-center justify-between border-t-[0.5px] border-bd-1 bg-surf px-4">
			<Link
				href={hasPrev ? prevHref : "#"}
				aria-label={t("reader.topbar.prev")}
				aria-disabled={!hasPrev}
				tabIndex={hasPrev ? 0 : -1}
				prefetch={hasPrev}
				className="flex h-14 w-16 items-center justify-center text-t-2 transition-colors hover:text-t-1 aria-disabled:pointer-events-none aria-disabled:opacity-30"
			>
				<ChevronLeft className="size-5" strokeWidth={1.6} />
			</Link>

			<span className="text-[13px] font-medium tabular-nums text-t-3">
				{currentPage} / {totalPages}
			</span>

			<Link
				href={hasNext ? nextHref : "#"}
				aria-label={t("reader.topbar.next")}
				aria-disabled={!hasNext}
				tabIndex={hasNext ? 0 : -1}
				prefetch={hasNext}
				className="flex h-14 w-16 items-center justify-center text-t-2 transition-colors hover:text-t-1 aria-disabled:pointer-events-none aria-disabled:opacity-30"
			>
				<ChevronRight className="size-5" strokeWidth={1.6} />
			</Link>
		</nav>
	);
};
