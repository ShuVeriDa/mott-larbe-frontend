"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel, TokenSort, TokenStatus } from "@/entities/token";

interface TokenizationToolbarProps {
	search: string;
	level: CefrLevel | "";
	status: TokenStatus | "";
	sort: TokenSort;
	onSearchChange: (v: string) => void;
	onLevelChange: (v: string) => void;
	onStatusChange: (v: string) => void;
	onSortChange: (v: string) => void;
}

const selectCls =
	"h-8 appearance-none rounded-base border border-bd-2 bg-surf px-2.5 pr-7 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3 focus:border-acc";

const ChevronIcon = () => (
	<svg
		className="pointer-events-none absolute right-2 top-1/2 size-2.5 -translate-y-1/2 text-t-3"
		viewBox="0 0 10 10"
		fill="none"
	>
		<path
			d="M2 3.5l3 3 3-3"
			stroke="currentColor"
			strokeWidth="1.3"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const TokenizationToolbar = ({
	search,
	level,
	status,
	sort,
	onSearchChange,
	onLevelChange,
	onStatusChange,
	onSortChange,
}: TokenizationToolbarProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-3.5 flex flex-wrap items-center gap-2">
			<div className="relative min-w-[160px] flex-1">
				<svg
					className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-t-3"
					viewBox="0 0 16 16"
					fill="none"
				>
					<circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
					<path
						d="M10.5 10.5l2.5 2.5"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t("admin.tokenization.toolbar.searchPlaceholder")}
					className="h-8 w-full rounded-[7px] border border-bd-2 bg-surf pl-8 pr-3 text-[12.5px] text-t-1 outline-none placeholder:text-t-3 transition-colors focus:border-acc"
				/>
			</div>

			<div className="relative">
				<select
					value={level}
					onChange={(e) => onLevelChange(e.target.value)}
					className={selectCls}
				>
					<option value="">{t("admin.tokenization.toolbar.allLevels")}</option>
					{(["A1", "A2", "B1", "B2", "C1", "C2"] as CefrLevel[]).map((l) => (
						<option key={l} value={l}>
							{l}
						</option>
					))}
				</select>
				<ChevronIcon />
			</div>

			<div className="relative">
				<select
					value={status}
					onChange={(e) => onStatusChange(e.target.value)}
					className={selectCls}
				>
					<option value="">{t("admin.tokenization.toolbar.allStatuses")}</option>
					<option value="ANALYZED">Analyzed</option>
					<option value="AMBIGUOUS">Ambiguous</option>
					<option value="NOT_FOUND">Not found</option>
				</select>
				<ChevronIcon />
			</div>

			<div className="relative">
				<select
					value={sort}
					onChange={(e) => onSortChange(e.target.value)}
					className={selectCls}
				>
					<option value="errors">{t("admin.tokenization.toolbar.sortErrors")}</option>
					<option value="date">{t("admin.tokenization.toolbar.sortDate")}</option>
					<option value="name">{t("admin.tokenization.toolbar.sortName")}</option>
				</select>
				<ChevronIcon />
			</div>
		</div>
	);
};
