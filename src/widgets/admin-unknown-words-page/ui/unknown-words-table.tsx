"use client";

import { Typography } from "@/shared/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordItem } from "@/entities/admin-unknown-word";
import type { useAdminUnknownWordMutations } from "@/entities/admin-unknown-word";
import { CountBadge } from "./unknown-words-count-badge";
import { UnknownWordRowActions } from "./unknown-words-row-actions";
import { formatShortDate } from "../lib/format-date";

interface UnknownWordsTableProps {
	words: UnknownWordItem[];
	selectedIds: Set<string>;
	allSelected: boolean;
	onToggleAll: () => void;
	onToggleRow: (id: string) => void;
	mutations: ReturnType<typeof useAdminUnknownWordMutations>;
	isLoading: boolean;
	onAddToDictionary: (word: UnknownWordItem) => void;
	onLinkToLemma: (word: UnknownWordItem) => void;
	onViewContexts: (word: UnknownWordItem) => void;
}

export const UnknownWordsTable = ({
	words,
	selectedIds,
	allSelected,
	onToggleAll,
	onToggleRow,
	mutations,
	isLoading,
	onAddToDictionary,
	onLinkToLemma,
	onViewContexts,
}: UnknownWordsTableProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
				<Table className="w-full border-collapse text-[12.5px]" aria-busy="true" aria-label="Loading unknown words">
					<TableBody>
						{Array.from({ length: 8 }).map((_, i) => (
							<TableRow key={i} className="border-b border-bd-1">
								<TableCell className="px-2.5 py-[10px] pl-3.5" style={{ width: 32 }}>
									<div className="size-3.5 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]">
									<div className="space-y-1">
										<div className="h-3.5 w-24 animate-pulse rounded bg-surf-3" />
										<div className="h-2.5 w-16 animate-pulse rounded bg-surf-3" />
									</div>
								</TableCell>
								<TableCell className="px-2.5 py-[10px]">
									<div className="h-3 w-48 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]" style={{ width: 90 }}>
									<div className="h-5 w-8 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]" style={{ width: 80 }}>
									<div className="h-3 w-14 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell className="px-2.5 py-[10px]" style={{ width: 80 }}>
									<div className="h-3 w-14 animate-pulse rounded bg-surf-3" />
								</TableCell>
								<TableCell style={{ width: 90 }} />
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-bd-3 max-sm:hidden">
			<Table className="w-full border-collapse text-[12.5px]" aria-label={t("admin.unknownWords.table.word")}>
				<TableHeader>
					<TableRow className="border-b border-bd-1 bg-surf-2">
						<TableHead className="px-2.5 py-[10px] pl-3.5" style={{ width: 32 }}>
							<input
								type="checkbox"
								checked={allSelected}
								onChange={onToggleAll}
								aria-label={t("admin.unknownWords.table.selectAll")}
								className="size-3.5 cursor-pointer accent-acc"
							/>
						</TableHead>
						<TableHead className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap">
							{t("admin.unknownWords.table.word")}
						</TableHead>
						<TableHead className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
							{t("admin.unknownWords.table.context")}
						</TableHead>
						<TableHead
							className="px-2.5 py-[10px] text-center text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap"
							style={{ width: 90 }}
						>
							{t("admin.unknownWords.table.count")}
						</TableHead>
						<TableHead
							className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap max-md:hidden"
							style={{ width: 90 }}
						>
							{t("admin.unknownWords.table.first")}
						</TableHead>
						<TableHead
							className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap max-md:hidden"
							style={{ width: 90 }}
						>
							{t("admin.unknownWords.table.last")}
						</TableHead>
						<TableHead style={{ width: 90 }} />
					</TableRow>
				</TableHeader>
				<TableBody>
					{words.map((word) => {
					  const handleCheckboxClick: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  const handleToggleChange: NonNullable<ComponentProps<"input">["onChange"]> = () => onToggleRow(word.id);
					  const handleCountClick: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  const handleActionsClick: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  const handleAddToDictionary: NonNullable<ComponentProps<typeof UnknownWordRowActions>["onAddToDictionary"]> = () => onAddToDictionary(word);
					  const handleLinkToLemma: NonNullable<ComponentProps<typeof UnknownWordRowActions>["onLinkToLemma"]> = () => onLinkToLemma(word);
					  const handleViewContexts: NonNullable<ComponentProps<typeof UnknownWordRowActions>["onViewContexts"]> = () => onViewContexts(word);
					  return (
						<TableRow
							key={word.id}
							className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
						>
							<TableCell
								className="px-2.5 py-[10px] pl-3.5"
								onClick={handleCheckboxClick}
							>
								<input
									type="checkbox"
									checked={selectedIds.has(word.id)}
									onChange={handleToggleChange}
									aria-label={word.word}
									className="size-3.5 cursor-pointer accent-acc"
								/>
							</TableCell>

							{/* Word */}
							<TableCell className="px-2.5 py-[10px]">
								<div className="flex flex-col gap-0.5">
									<Typography tag="span" className="font-display text-[13.5px] font-semibold text-t-1">
										{word.word}
									</Typography>
									{word.normalized !== word.word && (
										<Typography tag="span" className="text-[11px] text-t-3">{word.normalized}</Typography>
									)}
								</div>
							</TableCell>

							{/* Context */}
							<TableCell className="max-w-[260px] px-2.5 py-[10px]">
								{word.firstContext?.snippet ? (
									<div className="line-clamp-2 text-[12px] leading-normal text-t-2">
										{word.firstContext.snippet}
									</div>
								) : (
									<Typography tag="span" className="text-[11px] text-t-4">—</Typography>
								)}
								{word.firstContext?.textTitle && (
									<div className="mt-0.5 text-[11px] text-t-3">
										«{word.firstContext.textTitle}»{word.firstContext.pageNumber ? `, с. ${word.firstContext.pageNumber}` : ""}
									</div>
								)}
							</TableCell>

							{/* Count */}
							<TableCell className="px-2.5 py-[10px] text-center" onClick={handleCountClick}>
								<CountBadge count={word.seenCount} />
							</TableCell>

							{/* First seen */}
							<TableCell className="px-2.5 py-[10px] text-[11.5px] text-t-3 whitespace-nowrap max-md:hidden">
								{formatShortDate(word.firstSeen)}
							</TableCell>

							{/* Last seen */}
							<TableCell className="px-2.5 py-[10px] text-[11.5px] text-t-3 whitespace-nowrap max-md:hidden">
								{formatShortDate(word.lastSeen)}
							</TableCell>

							{/* Actions */}
							<TableCell className="px-2.5 py-[10px]" onClick={handleActionsClick}>
								<UnknownWordRowActions
									word={word}
									mutations={mutations}
									onAddToDictionary={handleAddToDictionary}
									onLinkToLemma={handleLinkToLemma}
									onViewContexts={handleViewContexts}
								/>
							</TableCell>
						</TableRow>
					);
					})}
				</TableBody>
			</Table>
		</div>
	);
};
