"use client";

import { type ComponentProps } from "react";
import Link from "next/link";
import { TableRow, TableCell } from "@/shared/ui/table";
import type { AdminSpellingEntry, SpellingMatchType } from "@/entities/spelling-dictionary";
import { parseCorrectForm } from "@/entities/spelling-dictionary";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { SpellingEntryRowActions } from "./spelling-entry-row-actions";

interface SpellingEntryRowProps {
	entry: AdminSpellingEntry;
	onEdit: (entry: AdminSpellingEntry) => void;
	onDelete: (entry: AdminSpellingEntry) => void;
}

const MATCH_TYPE_STYLES: Record<SpellingMatchType, string> = {
	substring: "bg-surf-3 text-t-3",
	whole_word: "bg-blue-50 text-blue-700",
	prefix: "bg-violet-50 text-violet-700",
	suffix: "bg-amber-50 text-amber-700",
};

const MATCH_TYPE_LABELS: Record<SpellingMatchType, string> = {
	substring: "подстрока",
	whole_word: "слово",
	prefix: "начало",
	suffix: "оконч.",
};

const renderCorrectForm = (value: string) =>
	parseCorrectForm(value).map((node, i) =>
		node.superscript ? <sup key={i}>{node.text}</sup> : <span key={i}>{node.text}</span>,
	);

export const SpellingEntryRow = ({ entry, onEdit, onDelete }: SpellingEntryRowProps) => {
	const { lang } = useI18n();
	const handleActionsClick: NonNullable<ComponentProps<"td">["onClick"]> = e =>
		e.stopPropagation();

	const allCorrectForms = [
		entry.correctForm,
		...(entry.correctForms ?? []).filter(f => f !== entry.correctForm),
	];

	return (
		<TableRow className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2">
			<TableCell className="px-2.5 py-[10px] pl-3.5">
				<div className="flex flex-col gap-1">
					<Link
						href={`/${lang}/admin/spelling-dictionary/${entry.id}`}
						className="rounded-[5px] bg-red-bg px-1.5 py-0.5 font-mono text-[12px] text-red-t line-through w-fit transition-colors hover:bg-red-bg/70 hover:no-underline focus-visible:underline"
					>
						{entry.wrongForm}
					</Link>
					<span className={cn(
						"rounded-[4px] px-1.5 py-0 text-[10px] font-medium w-fit",
						MATCH_TYPE_STYLES[entry.matchType],
					)}>
						{MATCH_TYPE_LABELS[entry.matchType]}
					</span>
				</div>
			</TableCell>
			<TableCell className="px-2.5 py-[10px]">
				<div className="flex flex-wrap gap-1">
					{allCorrectForms.map((form, i) => (
						<span
							key={i}
							className="rounded-[5px] bg-green-50 px-1.5 py-0.5 font-mono text-[12px] text-green-700"
						>
							{renderCorrectForm(form)}
						</span>
					))}
				</div>
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
