"use client";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { CefrBadge } from "@/entities/dictionary";
import type { AdminDictListItem, AdminDictSort } from "@/entities/dictionary";
import { PosBadge } from "./pos-badge";

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

const IconChevronDown = () => (
	<svg className="size-[11px]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
		<path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const IconSortable = ({ active, dir }: { active: boolean; dir?: "asc" | "desc" }) => (
	<svg className={cn("ml-1 size-[10px]", active ? "text-acc" : "text-t-4")} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4">
		{(!active || dir === "asc") && <path d="M5 1v8M2 4l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" opacity={active && dir === "asc" ? 1 : 0.5} />}
		{(!active || dir === "desc") && <path d="M5 9V1M2 6l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" opacity={active && dir === "desc" ? 1 : 0.5} />}
	</svg>
);

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
			<button
				type="button"
				onClick={handleClick}
				className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
				title={t("admin.dictionary.row.more")}
			>
				<IconChevronDown />
			</button>
			{open && (
				<div className="absolute right-0 top-full z-50 mt-1 w-[160px] rounded-[9px] border border-bd-2 bg-surf py-1 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
					<Link
						href={`/${lang}/admin/dictionary/${item.id}`}
						className="flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
						onClick={handleClick2}
					>
						{t("admin.dictionary.row.openEntry")}
					</Link>
					<button
						type="button"
						onClick={handleClick3}
						className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						{t("admin.dictionary.row.addSense")}
					</button>
					<button
						type="button"
						onClick={handleClick4}
						className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						{t("admin.dictionary.row.addExample")}
					</button>
					<div className="my-1 h-px bg-bd-1" />
					<button
						type="button"
						onClick={handleClick5}
						className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12.5px] text-red-t transition-colors hover:bg-red-bg"
					>
						{t("admin.dictionary.row.delete")}
					</button>
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

	const SortableTh = ({
		label,
		sortAsc,
		sortDesc,
		className,
	}: {
		label: string;
		sortAsc?: AdminDictSort;
		sortDesc?: AdminDictSort;
		className?: string;
	}) => {
		const isActive = sort === sortAsc || sort === sortDesc;
		const dir = sort === sortAsc ? "asc" : sort === sortDesc ? "desc" : undefined;

		const handleClick = () => {
			if (!sortAsc && !sortDesc) return;
			if (sortAsc && sortDesc) {
				onSortChange(sort === sortAsc ? sortDesc : sortAsc);
			} else {
				onSortChange((sortAsc ?? sortDesc)!);
			}
		};

		return (
			<th
				className={cn(thCls, "cursor-pointer select-none hover:text-t-2", className)}
				onClick={handleClick}
			>
				<span className="inline-flex items-center">
					{label}
					<IconSortable active={isActive} dir={dir} />
				</span>
			</th>
		);
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
						<SortableTh
							label={t("admin.dictionary.table.headword")}
							sortAsc="alpha"
						/>
						<th className={cn(thCls, "w-[80px]")}>{t("admin.dictionary.table.pos")}</th>
						<th className={cn(thCls, "w-[80px]")}>{t("admin.dictionary.table.meanings")}</th>
						<th className={cn(thCls, "w-[72px]")}>{t("admin.dictionary.table.level")}</th>
						<SortableTh
							label={t("admin.dictionary.table.frequency")}
							sortDesc="frequency_desc"
							className="w-[100px]"
						/>
						<th className={cn(thCls, "w-[68px]")}>{t("admin.dictionary.table.forms")}</th>
						<SortableTh
							label={t("admin.dictionary.table.added")}
							sortDesc="newest"
							sortAsc="oldest"
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
								<td className="py-3 pl-3.5">
									{item.frequency != null ? (
										<div className="flex flex-col gap-0.5">
											<span className="text-[12px] text-t-2">{item.frequency.toLocaleString()}</span>
											<div className="h-[3px] w-full rounded-full bg-surf-3">
												<div
													className="h-full rounded-full bg-acc/60"
													style={{ width: `${Math.round((item.frequency / maxFrequency) * 100)}%` }}
												/>
											</div>
										</div>
									) : (
										<span className="text-t-4">—</span>
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
											<IconEye />
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
