"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { CefrBadge } from "@/entities/dictionary";
import type { AdminDictListItem } from "@/entities/dictionary";
import { PosBadge } from "./pos-badge";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

const SkeletonRow = () => (
	<tr>
		{Array.from({ length: 7 }).map((_, i) => (
			<td key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</td>
		))}
	</tr>
);

const IconEye = () => (
	<svg className="size-[13px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
		<ellipse cx="8" cy="8" rx="5.5" ry="4" />
		<circle cx="8" cy="8" r="1.5" />
	</svg>
);

const IconTrash = () => (
	<svg className="size-[13px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
		<path d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4" strokeLinecap="round" />
		<path d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5" strokeLinecap="round" />
	</svg>
);

interface DictionaryTableProps {
	items: AdminDictListItem[];
	isLoading: boolean;
	lang: string;
	selectedIds: Set<string>;
	onSelectId: (id: string) => void;
	onSelectAll: () => void;
	onDelete: (entry: AdminDictListItem) => void;
	t: (key: string, params?: Record<string, unknown>) => string;
}

export const DictionaryTable = ({
	items,
	isLoading,
	lang,
	selectedIds,
	onSelectId,
	onSelectAll,
	onDelete,
	t,
}: DictionaryTableProps) => {
	const allSelected = items.length > 0 && items.every((it) => selectedIds.has(it.id));
	const someSelected = items.some((it) => selectedIds.has(it.id));

	const thCls =
		"pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1";

	return (
		<div className="overflow-x-auto max-sm:hidden">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr>
						<th className="w-9 pb-2 pl-3.5 border-b border-bd-1">
							<input
								type="checkbox"
								checked={allSelected}
								ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
								onChange={onSelectAll}
								className="size-[13px] cursor-pointer accent-acc"
							/>
						</th>
						<th className={thCls}>{t("admin.dictionary.table.headword")}</th>
						<th className={cn(thCls, "w-[80px]")}>{t("admin.dictionary.table.pos")}</th>
						<th className={cn(thCls, "w-[80px]")}>{t("admin.dictionary.table.meanings")}</th>
						<th className={cn(thCls, "w-[72px]")}>{t("admin.dictionary.table.level")}</th>
						<th className={cn(thCls, "w-[70px]")}>{t("admin.dictionary.table.frequency")}</th>
						<th className={cn(thCls, "w-[68px]")}>{t("admin.dictionary.table.forms")}</th>
						<th className={cn(thCls, "w-[88px]")}>{t("admin.dictionary.table.added")}</th>
						<th className="w-[72px] pb-2 pr-3.5 border-b border-bd-1" />
					</tr>
				</thead>
				<tbody>
					{isLoading
						? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
						: items.map((item) => (
							<tr
								key={item.id}
								className={cn(
									"border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2",
									selectedIds.has(item.id) && "bg-acc-bg/30",
								)}
							>
								<td className="pl-3.5 py-3">
									<input
										type="checkbox"
										checked={selectedIds.has(item.id)}
										onChange={() => onSelectId(item.id)}
										className="size-[13px] cursor-pointer accent-acc"
									/>
								</td>
								<td className="py-3 pl-3.5">
									<Link
										href={`/${lang}/admin/dictionary/${item.id}`}
										className="font-medium text-t-1 hover:text-acc transition-colors"
									>
										{item.baseForm}
									</Link>
									{item.translation && (
										<p className="mt-0.5 text-[11.5px] text-t-3 line-clamp-1">
											{item.translation}
										</p>
									)}
								</td>
								<td className="py-3 pl-3.5">
									<PosBadge
										pos={item.partOfSpeech}
										label={item.partOfSpeech
											? t(`admin.dictionary.pos.${item.partOfSpeech.toLowerCase()}`)
											: undefined}
									/>
								</td>
								<td className="py-3 pl-3.5">
									{item.sensesCount > 0 ? (
										<span className="text-t-1">{item.sensesCount}</span>
									) : (
										<span className="text-red-t text-[11.5px]">0</span>
									)}
								</td>
								<td className="py-3 pl-3.5">
									{item.level ? (
										<CefrBadge level={item.level as import("@/shared/types").CefrLevel} />
									) : (
										<span className="text-[11px] text-t-4">—</span>
									)}
								</td>
								<td className="py-3 pl-3.5 text-[12px] text-t-3">
									{item.frequency != null ? item.frequency.toLocaleString() : <span className="text-t-4">—</span>}
								</td>
								<td className="py-3 pl-3.5 text-[12px] text-t-2">{item.formsCount}</td>
								<td className="py-3 pl-3.5 text-[11.5px] text-t-3">
									{formatDate(item.createdAt ?? "")}
								</td>
								<td className="py-3 pr-3.5">
									<div className="flex items-center justify-end gap-1">
										<Link
											href={`/${lang}/admin/dictionary/${item.id}`}
											className="flex size-[26px] items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
											title={t("admin.dictionary.row.view")}
										>
											<IconEye />
										</Link>
										<button
											type="button"
											onClick={() => onDelete(item)}
											className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
											title={t("admin.dictionary.row.delete")}
										>
											<IconTrash />
										</button>
									</div>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};
