"use client";

import { type ComponentProps } from "react";
import { TableRow, TableCell } from "@/shared/ui/table";
import type { AdminSpellingEntry } from "@/entities/spelling-dictionary";
import { SpellingEntryRowActions } from "./spelling-entry-row-actions";

interface SpellingEntryRowProps {
	entry: AdminSpellingEntry;
	onEdit: (entry: AdminSpellingEntry) => void;
	onDelete: (entry: AdminSpellingEntry) => void;
}

export const SpellingEntryRow = ({ entry, onEdit, onDelete }: SpellingEntryRowProps) => {
	const handleActionsClick: NonNullable<ComponentProps<"td">["onClick"]> = e =>
		e.stopPropagation();

	return (
		<TableRow className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2">
			<TableCell className="px-2.5 py-[10px] pl-3.5">
				<span className="rounded-[5px] bg-red-bg px-1.5 py-0.5 font-mono text-[12px] text-red-t line-through">
					{entry.wrongForm}
				</span>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<span className="rounded-[5px] bg-green-50 px-1.5 py-0.5 font-mono text-[12px] text-green-700">
					{entry.correctForm}
				</span>
			</TableCell>
			<TableCell className="px-2.5 py-[10px] text-[12.5px] text-t-3 max-sm:hidden">
				{entry.comment ?? (
					<span className="text-t-4">—</span>
				)}
			</TableCell>
			<TableCell className="px-2.5 py-[10px] text-[12.5px] text-t-3 max-sm:hidden">
				{entry.createdBy?.username ?? (
					<span className="text-t-4">—</span>
				)}
			</TableCell>
			<TableCell className="px-2.5 py-[10px] pr-3.5" onClick={handleActionsClick}>
				<SpellingEntryRowActions
					entry={entry}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			</TableCell>
		</TableRow>
	);
};
