"use client";

import { useI18n } from "@/shared/lib/i18n";
import { duration, ease } from "@/shared/lib/animation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
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
		<motion.nav
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: duration.slow, ease: ease.enter }}
			className="fixed bottom-[calc(56px+env(safe-area-inset-bottom))] inset-x-0 z-91 hidden max-md:flex items-center justify-between border-t-[0.5px] border-bd-1 bg-surf px-4"
		>
			<Link
				href={hasPrev ? prevHref : "#"}
				aria-label={t("reader.topbar.prev")}
				aria-disabled={!hasPrev}
				tabIndex={hasPrev ? 0 : -1}
				prefetch={hasPrev}
				className="flex h-14 w-16 items-center justify-center text-t-2 transition-[color,transform,opacity] duration-150 ease-out hover:text-t-1 aria-disabled:pointer-events-none aria-disabled:opacity-30 active:scale-90 active:opacity-70"
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
				className="flex h-14 w-16 items-center justify-center text-t-2 transition-[color,transform,opacity] duration-150 ease-out hover:text-t-1 aria-disabled:pointer-events-none aria-disabled:opacity-30 active:scale-90 active:opacity-70"
			>
				<ChevronRight className="size-5" strokeWidth={1.6} />
			</Link>
		</motion.nav>
	);
};
