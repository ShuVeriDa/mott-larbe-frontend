"use client";

import type { AdminTextListItem } from "@/entities/admin-text";
import { adminTextApi, useAdminTexts } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { CheckSquare, Download, Search, Square, X } from "lucide-react";
import {
	ChangeEvent,
	ComponentProps,
	useMemo,
	useState,
} from "react";

const EMPTY: AdminTextListItem[] = [];

type ExportFormat = "json" | "csv";

interface ExportTextsModalProps {
	preselectedIds: string[];
	onClose: () => void;
}

export const ExportTextsModal = ({
	preselectedIds,
	onClose,
}: ExportTextsModalProps) => {
	const { t } = useI18n();
	const [format, setFormat] = useState<ExportFormat>("json");
	const [search, setSearch] = useState("");
	const [manualCheckedIds, setCheckedIds] = useState<Set<string> | null>(
		preselectedIds.length > 0 ? new Set(preselectedIds) : null,
	);
	const [isExporting, setIsExporting] = useState(false);
	const [error, setError] = useState("");

	const { data, isLoading } = useAdminTexts({
		limit: 100,
		sortBy: "createdAt",
		sortOrder: "desc",
	});
	const allTexts: AdminTextListItem[] = data?.items ?? EMPTY;

	const checkedIds: Set<string> =
		manualCheckedIds ?? (!isLoading ? new Set(allTexts.map(t => t.id)) : new Set());

	const filtered = useMemo(
		() =>
			search.trim()
				? allTexts.filter(t =>
						t.title.toLowerCase().includes(search.trim().toLowerCase()),
					)
				: allTexts,
		[allTexts, search],
	);

	const allFilteredChecked =
		filtered.length > 0 && filtered.every(t => checkedIds.has(t.id));
	const someFilteredChecked = filtered.some(t => checkedIds.has(t.id));

	const handleToggleAll = () => {
		setCheckedIds(prev => {
			const next = new Set(prev);
			if (allFilteredChecked) {
				for (const t of filtered) next.delete(t.id);
			} else {
				for (const t of filtered) next.add(t.id);
			}
			return next;
		});
	};

	const handleToggleOne = (id: string) => {
		setCheckedIds(prev => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.currentTarget.value);
	};

	const handleExport = async () => {
		setIsExporting(true);
		setError("");
		try {
			const ids = Array.from(checkedIds);
			await adminTextApi.exportTexts(
				{},
				format,
				ids.length > 0 ? ids : undefined,
			);
			onClose();
		} catch {
			setError(t("admin.texts.export.error"));
		} finally {
			setIsExporting(false);
		}
	};

	const handleBackdropMouseDown: NonNullable<
		ComponentProps<"div">["onMouseDown"]
	> = e => {
		if (e.target === e.currentTarget) onClose();
	};

	const checkedCount = checkedIds.size;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onMouseDown={handleBackdropMouseDown}
		>
			<div className="flex w-full max-w-[480px] flex-col rounded-[12px] border border-bd-2 bg-surf shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-bd-1 px-5 py-4">
					<Typography tag="h2" className="text-[14px] font-semibold text-t-1">
						{t("admin.texts.export.title")}
					</Typography>
					<Button
						onClick={onClose}
						title={t("admin.texts.export.cancel")}
						className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<X className="size-[14px]" />
					</Button>
				</div>

				{/* Body */}
				<div className="flex flex-col gap-4 p-5">
					{/* Format */}
					<div className="flex flex-col gap-2">
						<Typography tag="p" className="text-[12px] font-medium text-t-2">
							{t("admin.texts.export.formatLabel")}
						</Typography>
						<div className="flex gap-2">
							{(["json", "csv"] as ExportFormat[]).map(f => (
								<Button
									key={f}
									type="button"
									onClick={() => setFormat(f)}
									title={f.toUpperCase()}
									className={`flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[7px] border text-[12.5px] font-medium transition-colors ${
										format === f
											? "border-acc bg-acc/10 text-acc"
											: "border-bd-2 bg-transparent text-t-2 hover:border-bd-3 hover:bg-surf-2"
									}`}
								>
									{f.toUpperCase()}
								</Button>
							))}
						</div>
					</div>

					{/* Texts list */}
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<Typography tag="p" className="text-[12px] font-medium text-t-2">
								{t("admin.texts.export.textsLabel")}
							</Typography>
							{!isLoading && allTexts.length > 0 && (
								<Typography tag="span" className="text-[11px] text-t-4">
									{t("admin.texts.export.checkedCount", {
										count: checkedCount,
										total: allTexts.length,
									})}
								</Typography>
							)}
						</div>

						<div className="overflow-hidden rounded-[8px] border border-bd-1 bg-surf-2">
							{/* Search */}
							<div className="flex items-center gap-2 border-b border-bd-1 px-3 py-2">
								<Search className="size-3.5 shrink-0 text-t-4" />
								<input
									type="text"
									value={search}
									onChange={handleSearchChange}
									placeholder={t("admin.texts.export.searchPlaceholder")}
									className="w-full bg-transparent text-[12.5px] text-t-1 placeholder:text-t-4 outline-none"
								/>
							</div>

							{/* Select all row */}
							{!isLoading && filtered.length > 0 && (
								<Button
									type="button"
									onClick={handleToggleAll}
									title={allFilteredChecked ? t("admin.texts.export.deselectAll") : t("admin.texts.export.selectAll")}
									className="flex w-full cursor-pointer items-center gap-2.5 border-b border-bd-1 px-3 py-2 transition-colors hover:bg-surf-3"
								>
									{allFilteredChecked ? (
										<CheckSquare className="size-3.5 shrink-0 text-acc" />
									) : someFilteredChecked ? (
										<CheckSquare className="size-3.5 shrink-0 text-t-3" />
									) : (
										<Square className="size-3.5 shrink-0 text-t-3" />
									)}
									<Typography
										tag="span"
										className="text-[12px] font-medium text-t-2"
									>
										{allFilteredChecked
											? t("admin.texts.export.deselectAll")
											: t("admin.texts.export.selectAll")}
									</Typography>
								</Button>
							)}

							{/* Items */}
							<div className="max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:w-0">
								{isLoading ? (
									<div className="flex flex-col gap-0">
										{Array.from({ length: 5 }).map((_, i) => (
											<div
												key={i}
												className="flex items-center gap-2.5 px-3 py-2.5"
											>
												<div className="size-3.5 shrink-0 animate-pulse rounded-[3px] bg-surf-3" />
												<div className="h-3 w-3/4 animate-pulse rounded-md bg-surf-3" />
											</div>
										))}
									</div>
								) : filtered.length === 0 ? (
									<Typography
										tag="p"
										className="px-3 py-4 text-center text-[12px] text-t-4"
									>
										{t("admin.texts.export.noTexts")}
									</Typography>
								) : (
									filtered.map(text => (
										<TextCheckRow
											key={text.id}
											text={text}
											checked={checkedIds.has(text.id)}
											onToggle={handleToggleOne}
										/>
									))
								)}
							</div>
						</div>
					</div>

					{error && (
						<Typography
							tag="p"
							className="rounded-[6px] bg-red-bg px-3 py-2 text-[12px] text-red-t"
						>
							{error}
						</Typography>
					)}
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 border-t border-bd-1 px-5 py-4">
					<Button
						onClick={onClose}
						disabled={isExporting}
						title={t("admin.texts.export.cancel")}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-4 text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50"
					>
						{t("admin.texts.export.cancel")}
					</Button>
					<Button
						onClick={handleExport}
						disabled={isExporting || checkedCount === 0}
						title={isExporting ? t("admin.texts.export.exporting") : t("admin.texts.export.submit")}
						className="flex h-8 cursor-pointer items-center gap-1.5 rounded-base bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<Download className="size-3" />
						{isExporting
							? t("admin.texts.export.exporting")
							: t("admin.texts.export.submit")}
					</Button>
				</div>
			</div>
		</div>
	);
};

interface TextCheckRowProps {
	text: AdminTextListItem;
	checked: boolean;
	onToggle: (id: string) => void;
}

const TextCheckRow = ({ text, checked, onToggle }: TextCheckRowProps) => {
	const handleClick = () => onToggle(text.id);

	return (
		<Button
			type="button"
			onClick={handleClick}
			title={text.title}
			className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-surf-3"
		>
			{checked ? (
				<CheckSquare className="size-3.5 shrink-0 text-acc" />
			) : (
				<Square className="size-3.5 shrink-0 text-t-3" />
			)}
			<Typography
				tag="span"
				className="min-w-0 flex-1 truncate text-[12.5px] text-t-1"
			>
				{text.title}
			</Typography>
			{text.level && (
				<Typography tag="span" className="shrink-0 text-[10.5px] text-t-4">
					{text.level}
				</Typography>
			)}
		</Button>
	);
};
