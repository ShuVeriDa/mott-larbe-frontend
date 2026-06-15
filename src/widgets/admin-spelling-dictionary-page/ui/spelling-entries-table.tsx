"use client";

import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/shared/ui/table";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminSpellingEntry } from "@/entities/spelling-dictionary";
import { SpellingEntryRow } from "./spelling-entry-row";

interface SpellingEntriesTableProps {
	items: AdminSpellingEntry[];
	isLoading: boolean;
	onEdit: (entry: AdminSpellingEntry) => void;
	onDelete: (entry: AdminSpellingEntry) => void;
}

const thClass =
	"px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2";

export const SpellingEntriesTable = ({
	items,
	isLoading,
	onEdit,
	onDelete,
}: SpellingEntriesTableProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
				<Table className="w-full border-collapse text-[12.5px]" aria-busy="true">
					<TableBody>
						{Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i} className="border-b border-bd-1">
								<TableCell className="px-2.5 py-[10px] pl-3.5" style={{ width: 160 }}>
									<div className="h-5 w-24 animate-pulse rounded-[5px] bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]" style={{ width: 160 }}>
									<div className="h-5 w-24 animate-pulse rounded-[5px] bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px] max-sm:hidden">
									<div className="h-3 w-40 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px] max-sm:hidden" style={{ width: 130 }}>
									<div className="h-3 w-20 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell style={{ width: 80 }} />
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="py-16 text-center text-[13px] text-t-3">
				{t("admin.spellingDictionary.table.empty")}
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<Table className="w-full border-collapse text-[12.5px]">
				<TableHeader>
					<TableRow className="border-b border-bd-1">
						<TableHead className={`${thClass} pl-3.5`}>
							{t("admin.spellingDictionary.table.wrongForm")}
						</TableHead>
						<TableHead className={thClass}>
							{t("admin.spellingDictionary.table.correctForm")}
						</TableHead>
						<TableHead className={`${thClass} max-sm:hidden`}>
							{t("admin.spellingDictionary.table.comment")}
						</TableHead>
						<TableHead className={`${thClass} max-sm:hidden`} style={{ width: 130 }}>
							{t("admin.spellingDictionary.table.author")}
						</TableHead>
						<TableHead className={thClass} style={{ width: 80 }} />
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map(entry => (
						<SpellingEntryRow
							key={entry.id}
							entry={entry}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
