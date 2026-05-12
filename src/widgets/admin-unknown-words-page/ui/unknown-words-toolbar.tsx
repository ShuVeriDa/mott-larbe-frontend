"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { SearchBox } from "@/shared/ui/search-box";
import type { TextListItem, UnknownWordsSortOrder } from "@/entities/admin-unknown-word";
import { Select } from "@/shared/ui/select";

interface UnknownWordsToolbarProps {
	search: string;
	sort: UnknownWordsSortOrder;
	textId: string | undefined;
	texts: TextListItem[];
	onSearchChange: (value: string) => void;
	onSortChange: (value: UnknownWordsSortOrder) => void;
	onTextChange: (value: string | undefined) => void;
}

export const UnknownWordsToolbar = ({
	search,
	sort,
	textId,
	texts,
	onSearchChange,
	onSortChange,
	onTextChange,
}: UnknownWordsToolbarProps) => {
	const { t } = useI18n();

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onTextChange(e.currentTarget.value || undefined);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onSortChange(e.currentTarget.value as UnknownWordsSortOrder);
	return (
		<div className="mb-2.5 flex flex-wrap items-center gap-2">
			{/* Search */}
			<SearchBox
				value={search}
				onChange={handleChange}
				placeholder={t("admin.unknownWords.toolbar.searchPlaceholder")}
				wrapperClassName="min-w-[180px] flex-1"
				className="h-8"
			/>

			{texts.length > 0 && (
				<Select value={textId ?? ""} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
					<option value="">{t("admin.unknownWords.toolbar.allTexts")}</option>
					{texts.map((tx) => (
						<option key={tx.id} value={tx.id}>
							{tx.title}
						</option>
					))}
				</Select>
			)}

			<Select value={sort} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
				<option value="frequency_desc">{t("admin.unknownWords.toolbar.sortFrequency")}</option>
				<option value="newest_first">{t("admin.unknownWords.toolbar.sortNewest")}</option>
				<option value="alphabetical">{t("admin.unknownWords.toolbar.sortAlpha")}</option>
			</Select>
		</div>
	);
};
