"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordListItem } from "@/entities/unknown-word";
import type { useUnknownWordMutations } from "@/entities/unknown-word/model/use-unknown-word-mutations";
import { CountBadge } from "./unknown-words-count-badge";
import { UnknownWordRowActions } from "./unknown-words-row-actions";
import { formatShortDate } from "../lib/format-date";

interface UnknownWordsTableProps {
	words: UnknownWordListItem[];
	selectedIds: Set<string>;
	allSelected: boolean;
	onToggleAll: () => void;
	onToggleRow: (id: string) => void;
	mutations: ReturnType<typeof useUnknownWordMutations>;
	isLoading: boolean;
	onAddToDictionary: (word: UnknownWordListItem) => void;
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
}: UnknownWordsTableProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
				<table className="w-full border-collapse text-[12.5px]">
					<tbody>
						{Array.from({ length: 8 }).map((_, i) => (
							<tr key={i} className="border-b border-bd-1">
								<td className="px-2.5 py-[10px] pl-3.5" style={{ width: 32 }}>
									<div className="size-3.5 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-[10px]">
									<div className="space-y-1">
										<div className="h-3.5 w-24 animate-pulse rounded bg-surf-3" />
										<div className="h-2.5 w-16 animate-pulse rounded bg-surf-3" />
									</div>
								</td>
								<td className="px-2.5 py-[10px]">
									<div className="h-3 w-48 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-[10px]" style={{ width: 90 }}>
									<div className="h-5 w-8 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-[10px]" style={{ width: 80 }}>
									<div className="h-3 w-14 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-[10px]" style={{ width: 80 }}>
									<div className="h-3 w-14 animate-pulse rounded bg-surf-3" />
								</td>
								<td style={{ width: 90 }} />
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-bd-3 max-sm:hidden">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr className="border-b border-bd-1 bg-surf-2">
						<th className="px-2.5 py-[10px] pl-3.5" style={{ width: 32 }}>
							<input
								type="checkbox"
								checked={allSelected}
								onChange={onToggleAll}
								className="size-3.5 cursor-pointer accent-acc"
							/>
						</th>
						<th className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap">
							{t("admin.unknownWords.table.word")}
						</th>
						<th className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
							{t("admin.unknownWords.table.context")}
						</th>
						<th
							className="px-2.5 py-[10px] text-center text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap"
							style={{ width: 90 }}
						>
							{t("admin.unknownWords.table.count")}
						</th>
						<th
							className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap max-md:hidden"
							style={{ width: 90 }}
						>
							{t("admin.unknownWords.table.first")}
						</th>
						<th
							className="px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap max-md:hidden"
							style={{ width: 90 }}
						>
							{t("admin.unknownWords.table.last")}
						</th>
						<th style={{ width: 90 }} />
					</tr>
				</thead>
				<tbody>
					{words.map((word) => (
						<tr
							key={word.id}
							className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
						>
							<td
								className="px-2.5 py-[10px] pl-3.5"
								onClick={(e) => e.stopPropagation()}
							>
								<input
									type="checkbox"
									checked={selectedIds.has(word.id)}
									onChange={() => onToggleRow(word.id)}
									className="size-3.5 cursor-pointer accent-acc"
								/>
							</td>

							{/* Word */}
							<td className="px-2.5 py-[10px]">
								<div className="flex flex-col gap-0.5">
									<span className="font-display text-[13.5px] font-semibold text-t-1">
										{word.word}
									</span>
									{word.normalized !== word.word && (
										<span className="text-[11px] text-t-3">{word.normalized}</span>
									)}
								</div>
							</td>

							{/* Context */}
							<td className="max-w-[260px] px-2.5 py-[10px]">
								{word.snippet ? (
									<div
										className="line-clamp-2 text-[12px] leading-[1.5] text-t-2"
										dangerouslySetInnerHTML={{ __html: word.snippet }}
									/>
								) : (
									<span className="text-[11px] text-t-4">—</span>
								)}
								{word.texts?.[0] && (
									<div className="mt-0.5 text-[11px] text-t-3">
										«{word.texts[0].title}»
									</div>
								)}
							</td>

							{/* Count */}
							<td className="px-2.5 py-[10px] text-center" onClick={(e) => e.stopPropagation()}>
								<CountBadge count={word.seenCount} />
							</td>

							{/* First seen */}
							<td className="px-2.5 py-[10px] text-[11.5px] text-t-3 whitespace-nowrap max-md:hidden">
								{formatShortDate(word.firstSeen)}
							</td>

							{/* Last seen */}
							<td className="px-2.5 py-[10px] text-[11.5px] text-t-3 whitespace-nowrap max-md:hidden">
								{formatShortDate(word.lastSeen)}
							</td>

							{/* Actions */}
							<td className="px-2.5 py-[10px]" onClick={(e) => e.stopPropagation()}>
								<UnknownWordRowActions
									word={word}
									mutations={mutations}
									onAddToDictionary={() => onAddToDictionary(word)}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
