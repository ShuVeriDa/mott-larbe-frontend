"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordsSortOrder } from "@/entities/unknown-word";

interface UnknownWordsToolbarProps {
	search: string;
	sort: UnknownWordsSortOrder;
	onSearchChange: (value: string) => void;
	onSortChange: (value: UnknownWordsSortOrder) => void;
}

export const UnknownWordsToolbar = ({
	search,
	sort,
	onSearchChange,
	onSortChange,
}: UnknownWordsToolbarProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-2">
			{/* Search */}
			<div className="relative min-w-[180px] flex-1">
				<svg
					className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-t-3"
					width="13"
					height="13"
					viewBox="0 0 16 16"
					fill="none"
				>
					<circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3" />
					<path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t("admin.unknownWords.toolbar.searchPlaceholder")}
					className="h-8 w-full rounded-lg border border-bd-2 bg-surf pl-8 pr-3 text-[12.5px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc transition-colors"
				/>
			</div>

			{/* Sort */}
			<select
				value={sort}
				onChange={(e) => onSortChange(e.target.value as UnknownWordsSortOrder)}
				className="h-8 cursor-pointer appearance-none rounded-lg border border-bd-2 bg-surf px-2.5 pr-7 text-[12.5px] text-t-2 outline-none hover:border-bd-3 focus:border-acc transition-colors"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%23a5a39a' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "right 8px center",
				}}
			>
				<option value="frequency_desc">{t("admin.unknownWords.toolbar.sortFrequency")}</option>
				<option value="newest_first">{t("admin.unknownWords.toolbar.sortNewest")}</option>
				<option value="alphabetical">{t("admin.unknownWords.toolbar.sortAlpha")}</option>
			</select>
		</div>
	);
};
