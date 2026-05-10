"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { CefrBadge } from "@/entities/dictionary";
import type { AdminDictListItem, AdminDictSort } from "@/entities/dictionary";
import { PosBadge } from "./pos-badge";
import { Eye, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

const SkeletonRow = () => (
	<tr>
		{Array.from({ length: 9 }).map((_, i) => (
			<td key={i} className="px-3.5 py-3">
				<div className="h-3 animate-pulse rounded bg-surf-3" />
			</td>
		))}
	</tr>
);

const IconSortable = ({ active, dir }: { active: boolean; dir?: "asc" | "desc" }) => {
	if (active && dir === "asc") return <ArrowUp className={cn("ml-1 size-[10px] text-acc")} />;
	if (active && dir === "desc") return <ArrowDown className={cn("ml-1 size-[10px] text-acc")} />;
	return <ArrowUpDown className={cn("ml-1 size-[10px] text-t-4")} />;
};

interface RowDropdownProps {
	item: AdminDictListItem;
	lang: string;
	onDelete: (entry: AdminDictListItem) => void;
	onAddSense: (entry: AdminDictListItem) => void;
	onAddExample: (entry: AdminDictListItem) => void;
	t: (key: string) => string;
}

const RowDropdown = ({ item, lang, onDelete, onAddSense, onAddExample, t }: RowDropdownProps) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node /* intentional: outside-click target */)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setOpen((p) => !p);
	const handleClick2: NonNullable<ComponentProps<typeof Link>["onClick"]> = () => setOpen(false);
	const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => { setOpen(false); onAddSense(item); };
	const handleClick4: NonNullable<ComponentProps<"button">["onClick"]> = () => { setOpen(false); onAddExample(item); };
	const handleClick5: NonNullable<ComponentProps<"button">["onClick"]> = () => { setOpen(false); onDelete(item); };
return (
		<div ref={ref} className="relative">
			<Button
				onClick={handleClick}
				className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
				title={t("admin.dictionary.row.more")}
			>
				<ChevronDown className="size-[11px]" />
			</Button>
			{open && (
				<div className="absolute right-0 top-full z-50 mt-1 w-[160px] rounded-[9px] border border-bd-2 bg-surf py-1 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
					<Link
						href={`/${lang}/admin/dictionary/${item.id}`}
						className="flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
						onClick={handleClick2}
					>
						{t("admin.dictionary.row.openEntry")}
					</Link>
					<Button
						onClick={handleClick3}
						className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						{t("admin.dictionary.row.addSense")}
					</Button>
					<Button
						onClick={handleClick4}
						className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						{t("admin.dictionary.row.addExample")}
					</Button>
					<div className="my-1 h-px bg-bd-1" />
					<Button
						onClick={handleClick5}
						className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-red-t transition-colors hover:bg-red-bg"
					>
						{t("admin.dictionary.row.delete")}
					</Button>
				</div>
			)}
		</div>
	);
};

interface DictionaryTableProps {
	items: AdminDictListItem[];
	isLoading: boolean;
	lang: string;
	sort: AdminDictSort;
	selectedIds: Set<string>;
	onSelectId: (id: string) => void;
	onSelectAll: () => void;
	onSortChange: (sort: AdminDictSort) => void;
	onDelete: (entry: AdminDictListItem) => void;
	onAddSense: (entry: AdminDictListItem) => void;
	onAddExample: (entry: AdminDictListItem) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

interface SortableHeaderCellProps {
	label: string;
	isActive: boolean;
	dir?: "asc" | "desc";
	className?: string;
	onClick: () => void;
}

const SortableHeaderCell = ({
	label,
	isActive,
	dir,
	className,
	onClick,
}: SortableHeaderCellProps) => (
	<th
		className={cn(
			"pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1",
			"cursor-pointer select-none hover:text-t-2",
			className,
		)}
		onClick={onClick}
	>
		<Typography tag="span" className="inline-flex items-center">
			{label}
			<IconSortable active={isActive} dir={dir} />
		</Typography>
	</th>
);

export const DictionaryTable = ({
	items,
	isLoading,
	lang,
	sort,
	selectedIds,
	onSelectId,
	onSelectAll,
	onSortChange,
	onDelete,
	onAddSense,
	onAddExample,
	t,
}: DictionaryTableProps) => {
	const allSelected = items.length > 0 && items.every((it) => selectedIds.has(it.id));
	const someSelected = items.some((it) => selectedIds.has(it.id));

	const maxFrequency = Math.max(...items.map((it) => it.frequency ?? 0), 1);

	const thCls =
		"pb-2 pl-3.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 border-b border-bd-1";

	const getSortableHeaderProps = (
		sortAsc: AdminDictSort | undefined,
		sortDesc: AdminDictSort | undefined,
	) => {
		const isActive = sort === sortAsc || sort === sortDesc;
		const dir = sort === sortAsc ? "asc" : sort === sortDesc ? "desc" : undefined;
		const handleClick = () => {
			if (!sortAsc && !sortDesc) return;
			if (sortAsc && sortDesc) {
				onSortChange(sort === sortAsc ? sortDesc : sortAsc);
				return;
			}
			onSortChange((sortAsc ?? sortDesc)!);
		};
		return { isActive, dir, handleClick };
	};

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
						<SortableHeaderCell
							label={t("admin.dictionary.table.headword")}
							{...getSortableHeaderProps("alpha", undefined)}
						/>
						<th className={cn(thCls, "w-[80px]")}>{t("admin.dictionary.table.pos")}</th>
						<th className={cn(thCls, "w-[80px]")}>{t("admin.dictionary.table.meanings")}</th>
						<th className={cn(thCls, "w-[72px]")}>{t("admin.dictionary.table.level")}</th>
						<SortableHeaderCell
							label={t("admin.dictionary.table.frequency")}
							{...getSortableHeaderProps(undefined, "frequency_desc")}
							className="w-[100px]"
						/>
						<th className={cn(thCls, "w-[68px]")}>{t("admin.dictionary.table.forms")}</th>
						<SortableHeaderCell
							label={t("admin.dictionary.table.added")}
							{...getSortableHeaderProps("oldest", "newest")}
							className="w-[88px]"
						/>
						<th className="w-[60px] pb-2 pr-3.5 border-b border-bd-1" />
					</tr>
				</thead>
				<tbody>
					{isLoading
						? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
						: items.map((item) => {
						  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = () => onSelectId(item.id);
						  return (
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
										onChange={handleChange}
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
										<Typography tag="p" className="mt-0.5 text-[11.5px] text-t-3 line-clamp-1">
											{item.translation}
										</Typography>
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
										<Typography tag="span" className="text-t-1">{item.sensesCount}</Typography>
									) : (
										<Typography tag="span" className="text-red-t text-[11.5px]">0</Typography>
									)}
								</td>
								<td className="py-3 pl-3.5">
									{item.level ? (
										<CefrBadge level={item.level as import("@/shared/types").CefrLevel} />
									) : (
										<Typography tag="span" className="text-[11px] text-t-4">—</Typography>
									)}
								</td>
								<td className="py-3 pl-3.5">
									{item.frequency != null ? (
										<div className="flex flex-col gap-0.5">
											<Typography tag="span" className="text-[12px] text-t-2">{item.frequency.toLocaleString()}</Typography>
											<div className="h-[3px] w-full rounded-full bg-surf-3">
												<div
													className="h-full rounded-full bg-acc/60"
													style={{ width: `${Math.round((item.frequency / maxFrequency) * 100)}%` }}
												/>
											</div>
										</div>
									) : (
										<Typography tag="span" className="text-t-4">—</Typography>
									)}
								</td>
								<td className="py-3 pl-3.5 text-[12px] text-t-2">{item.formsCount}</td>
								<td className="py-3 pl-3.5 text-[11.5px] text-t-3">
									{formatDate(item.createdAt ?? "")}
								</td>
								<td className="py-3 pr-3.5">
									<div className="flex items-center justify-end gap-0.5">
										<Link
											href={`/${lang}/admin/dictionary/${item.id}`}
											className="flex size-[26px] items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
											title={t("admin.dictionary.row.view")}
										>
											<Eye className="size-[13px]" />
										</Link>
										<RowDropdown
											item={item}
											lang={lang}
											onDelete={onDelete}
											onAddSense={onAddSense}
											onAddExample={onAddExample}
											t={t}
										/>
									</div>
								</td>
							</tr>
						);
						})}
				</tbody>
			</table>
		</div>
	);
};
