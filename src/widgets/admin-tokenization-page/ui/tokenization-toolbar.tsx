"use client";

import { ComponentProps } from 'react';
import type { TokenSort, TokenStatus } from "@/entities/token";
import { useI18n } from "@/shared/lib/i18n";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";
import { CEFR_LEVELS } from "@/shared/types";

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

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => onLevelChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => onStatusChange(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"select">["onChange"]> = e => onSortChange(e.currentTarget.value);
	return (
		<div className="mb-3.5 flex flex-wrap items-center gap-2">
			<SearchBox
				value={search}
				onChange={handleChange}
				placeholder={t("admin.tokenization.toolbar.searchPlaceholder")}
				wrapperClassName="min-w-[160px] flex-1"
				className="h-8"
			/>

			<Select value={level} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 h-8 hover:border-bd-3">
				<option value="">{t("admin.tokenization.toolbar.allLevels")}</option>
				{CEFR_LEVELS.map(l => (
					<option key={l} value={l}>
						{l}
					</option>
				))}
			</Select>

			<Select value={status} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 h-8 hover:border-bd-3">
				<option value="">{t("admin.tokenization.toolbar.allStatuses")}</option>
				<option value="ANALYZED">Analyzed</option>
				<option value="AMBIGUOUS">Ambiguous</option>
				<option value="NOT_FOUND">Not found</option>
			</Select>

			<Select value={sort} onChange={handleChange4} wrapperClassName="w-auto" className="bg-surf text-t-2 h-8 hover:border-bd-3">
				<option value="errors">{t("admin.tokenization.toolbar.sortErrors")}</option>
				<option value="date">{t("admin.tokenization.toolbar.sortDate")}</option>
				<option value="name">{t("admin.tokenization.toolbar.sortName")}</option>
			</Select>
		</div>
	);
};
