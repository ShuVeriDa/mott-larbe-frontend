"use client";

import { ReactNode } from "react";

import type { LibraryTextCounts } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";

interface LibraryStatsRowProps {
	counts: LibraryTextCounts;
}

export const LibraryStatsRow = ({ counts }: LibraryStatsRowProps) => {
	const { t } = useI18n();

	return (
		<div className="flex shrink-0 items-center gap-3.5 overflow-x-auto border-b border-bd-1 bg-surf px-5 py-1.5 text-[11px] [scrollbar-width:none] max-sm:gap-3 max-sm:px-3 [&::-webkit-scrollbar]:hidden">
			<StatChip dotClass="bg-t-3">
				<span className="font-semibold text-t-2">{counts.total}</span>
				&nbsp;{t("library.stats.total")}
			</StatChip>
			<StatChip dotClass="bg-grn">
				<span className="font-semibold text-t-2">{counts.completed}</span>
				&nbsp;{t("library.stats.done")}
			</StatChip>
			<StatChip dotClass="bg-acc">
				<span className="font-semibold text-t-2">{counts.inProgress}</span>
				&nbsp;{t("library.stats.reading")}
			</StatChip>
			<StatChip dotClass="bg-t-4">
				<span className="font-semibold text-t-2">{counts.new}</span>
				&nbsp;{t("library.stats.new")}
			</StatChip>
		</div>
	);
};

const StatChip = ({
	children,
	dotClass,
}: {
	children: ReactNode;
	dotClass: string;
}) => (
	<div className="flex shrink-0 items-center gap-[5px] text-t-3">
		<span className={`size-1.5 shrink-0 rounded-full ${dotClass}`} />
		{children}
	</div>
);
