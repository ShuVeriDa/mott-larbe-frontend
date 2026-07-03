"use client";

import { Table, TableHeader, TableBody, TableRow, TableHead } from "@/shared/ui/table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { SpellingOccurrence } from "../api/types";
import { SpellingOccurrenceItem } from "./spelling-occurrence-item";
import { SpellingOccurrenceCard } from "./spelling-occurrence-card";

interface SpellingOccurrencesListProps {
	items: SpellingOccurrence[];
	lang: string;
	isLoading: boolean;
	canBulkFix: boolean;
	selectedTokenIds: Set<string>;
	allSelected: boolean;
	someSelected: boolean;
	onToggleSelect: (tokenId: string) => void;
	onSelectAll: () => void;
	onFixOne: (tokenId: string) => Promise<void>;
}

const thClass =
	"px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2";

export const SpellingOccurrencesList = ({
	items,
	lang,
	isLoading,
	canBulkFix,
	selectedTokenIds,
	allSelected,
	someSelected,
	onToggleSelect,
	onSelectAll,
	onFixOne,
}: SpellingOccurrencesListProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 p-3.5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="h-14 w-full animate-pulse rounded-[8px] bg-surf-3" />
				))}
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 py-16 text-center">
				<Typography tag="p" className="text-[13px] font-medium text-t-2">
					{t("admin.spellingDictionaryDetail.empty.title")}
				</Typography>
				<Typography tag="p" className="text-[12px] text-t-3">
					{t("admin.spellingDictionaryDetail.empty.subtitle")}
				</Typography>
			</div>
		);
	}

	return (
		<>
			<div className="max-sm:hidden">
				<Table className="w-full border-collapse text-[12.5px]">
					<TableHeader>
						<TableRow className="border-b border-bd-1">
							<TableHead className={`${thClass} pl-3.5`} style={{ width: 44 }}>
								<Checkbox
									checked={allSelected ? true : someSelected ? "indeterminate" : false}
									onCheckedChange={onSelectAll}
									disabled={!canBulkFix}
									aria-label={t("admin.spellingDictionaryDetail.selectAll")}
								/>
							</TableHead>
							<TableHead className={thClass}>
								{t("admin.spellingDictionaryDetail.table.occurrence")}
							</TableHead>
							<TableHead className={`${thClass} pr-3.5 text-right`} style={{ width: 190 }} />
						</TableRow>
					</TableHeader>
					<TableBody>
						{items.map((occurrence) => (
							<SpellingOccurrenceItem
								key={occurrence.id}
								occurrence={occurrence}
								lang={lang}
								isSelected={selectedTokenIds.has(occurrence.tokenId)}
								canBulkFix={canBulkFix}
								onToggleSelect={onToggleSelect}
								onFixOne={onFixOne}
							/>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="sm:hidden">
				<div className="flex items-center gap-2.5 border-b border-bd-1 px-3.5 py-2.5">
					<Checkbox
						checked={allSelected ? true : someSelected ? "indeterminate" : false}
						onCheckedChange={onSelectAll}
						disabled={!canBulkFix}
						aria-label={t("admin.spellingDictionaryDetail.selectAll")}
						className="size-5"
					/>
					<Typography tag="span" className="text-[12px] text-t-3">
						{t("admin.spellingDictionaryDetail.selectAll")}
					</Typography>
				</div>
				{items.map((occurrence) => (
					<SpellingOccurrenceCard
						key={occurrence.id}
						occurrence={occurrence}
						lang={lang}
						isSelected={selectedTokenIds.has(occurrence.tokenId)}
						canBulkFix={canBulkFix}
						onToggleSelect={onToggleSelect}
						onFixOne={onFixOne}
					/>
				))}
			</div>
		</>
	);
};
