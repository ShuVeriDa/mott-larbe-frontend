"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { useAdminTags } from "@/entities/admin-tag";
import type { TextSortBy } from "@/entities/admin-text";
import { SearchBox } from "@/shared/ui/search-box";
import { Select } from "@/shared/ui/select";
import { CEFR_LEVELS } from "@/shared/types";

interface TextsToolbarProps {
	search: string;
	level: string;
	tagId: string;
	sortBy: TextSortBy;
	onSearchChange: (v: string) => void;
	onLevelChange: (v: string) => void;
	onTagChange: (v: string) => void;
	onSortChange: (v: TextSortBy) => void;
}

export const TextsToolbar = ({
	search,
	level,
	tagId,
	sortBy,
	onSearchChange,
	onLevelChange,
	onTagChange,
	onSortChange,
}: TextsToolbarProps) => {
	const { t } = useI18n();
	const { data: tags } = useAdminTags();

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => onSearchChange(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onLevelChange(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onTagChange(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onSortChange(e.currentTarget.value as TextSortBy);
	return (
		<div className="mb-3.5 flex flex-wrap items-center gap-2">
			<SearchBox
				value={search}
				onChange={handleChange}
				placeholder={t("admin.texts.toolbar.searchPlaceholder")}
				wrapperClassName="min-w-[180px] flex-1 max-sm:min-w-full max-sm:order-first"
				className="h-8"
			/>

			{/* Filters */}
			<div className="flex flex-wrap gap-1.5">
				<Select value={level} onChange={handleChange2} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
					<option value="">{t("admin.texts.toolbar.allLevels")}</option>
					{CEFR_LEVELS.map((l) => (
						<option key={l} value={l}>{l}</option>
					))}
				</Select>

				{tags && tags.length > 0 && (
					<Select value={tagId} onChange={handleChange3} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
						<option value="">{t("admin.texts.toolbar.allTags")}</option>
						{tags.map((tag) => (
							<option key={tag.id} value={tag.id}>
								{tag.name}
							</option>
						))}
					</Select>
				)}

				<Select value={sortBy} onChange={handleChange4} wrapperClassName="w-auto" className="bg-surf text-t-2 rounded-lg h-8 hover:border-bd-3">
					<option value="createdAt">{t("admin.texts.toolbar.sortDate")}</option>
					<option value="title">{t("admin.texts.toolbar.sortTitle")}</option>
					<option value="level">{t("admin.texts.toolbar.sortLevel")}</option>
					<option value="readCount">{t("admin.texts.toolbar.sortReads")}</option>
				</Select>
			</div>
		</div>
	);
};
