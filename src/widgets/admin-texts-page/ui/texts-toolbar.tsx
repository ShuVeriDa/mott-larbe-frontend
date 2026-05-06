"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminTags } from "@/entities/admin-tag";
import type { TextLevel, TextSortBy } from "@/entities/admin-text";

interface TextsToolbarProps {
	search: string;
	level: TextLevel | "";
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

	const selClass =
		"h-8 cursor-pointer appearance-none rounded-lg border border-bd-2 bg-surf px-2.5 pr-7 text-[12.5px] text-t-2 outline-none transition-colors hover:border-bd-3 focus:border-acc [background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='%23a5a39a' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] [background-position:right_8px_center] [background-repeat:no-repeat]";

	return (
		<div className="mb-3.5 flex flex-wrap items-center gap-2">
			{/* Search */}
			<div className="relative min-w-[180px] flex-1">
				<svg
					className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-t-3"
					width="14"
					height="14"
					viewBox="0 0 16 16"
					fill="none"
				>
					<circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
					<path d="M10.5 10.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
				</svg>
				<input
					type="text"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder={t("admin.texts.toolbar.searchPlaceholder")}
					className="h-8 w-full rounded-lg border border-bd-2 bg-surf pl-8 pr-3 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc max-sm:min-w-full max-sm:order-first"
				/>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap gap-1.5">
				<select
					value={level}
					onChange={(e) => onLevelChange(e.target.value)}
					className={selClass}
				>
					<option value="">{t("admin.texts.toolbar.allLevels")}</option>
					{(["A1", "A2", "B1", "B2", "C1", "C2"] as TextLevel[]).map((l) => (
						<option key={l} value={l}>{l}</option>
					))}
				</select>

				{tags && tags.length > 0 && (
					<select
						value={tagId}
						onChange={(e) => onTagChange(e.target.value)}
						className={selClass}
					>
						<option value="">{t("admin.texts.toolbar.allTags")}</option>
						{tags.map((tag) => (
							<option key={tag.id} value={tag.id}>
								{tag.name}
							</option>
						))}
					</select>
				)}

				<select
					value={sortBy}
					onChange={(e) => onSortChange(e.target.value as TextSortBy)}
					className={selClass}
				>
					<option value="createdAt">{t("admin.texts.toolbar.sortDate")}</option>
					<option value="title">{t("admin.texts.toolbar.sortTitle")}</option>
					<option value="level">{t("admin.texts.toolbar.sortLevel")}</option>
					<option value="readCount">{t("admin.texts.toolbar.sortReads")}</option>
				</select>
			</div>
		</div>
	);
};
