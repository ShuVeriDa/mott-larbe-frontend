"use client";

import type { AdminTextListItem } from "@/entities/admin-text";
import { adminTextApi, useAdminTexts } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { CheckSquare, Download, Files, FileText, Search, Square } from "lucide-react";
import {
	ChangeEvent,
	ComponentProps,
	useState,
} from "react";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useMutation } from "@tanstack/react-query";

const EMPTY: AdminTextListItem[] = [];

type ExportFormat = "json" | "csv";
type OutputMode = "combined" | "separate";

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
	const [outputMode, setOutputMode] = useState<OutputMode>("combined");
	const [search, setSearch] = useState("");
	const [manualCheckedIds, setCheckedIds] = useState<Set<string> | null>(
		preselectedIds.length > 0 ? new Set(preselectedIds) : null,
	);
	const [error, setError] = useState("");

	const { data, isLoading } = useAdminTexts({
		limit: 100,
		sortBy: "createdAt",
		sortOrder: "desc",
	});
	const allTexts: AdminTextListItem[] = data?.items ?? EMPTY;

	const checkedIds: Set<string> =
		manualCheckedIds ?? (!isLoading ? new Set(allTexts.map(t => t.id)) : new Set());

	const filtered = search.trim()
		? allTexts.filter(t =>
				t.title.toLowerCase().includes(search.trim().toLowerCase()),
			)
		: allTexts;

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

	const exportMutation = useMutation({
		mutationFn: async () => {
			const ids = Array.from(checkedIds);
			const selectedTexts = allTexts.filter(t => checkedIds.has(t.id));

			if (outputMode === "separate") {
				await adminTextApi.exportTextsIndividually(selectedTexts, format);
			} else {
				await adminTextApi.exportTexts(
					{},
					format,
					ids.length > 0 ? ids : undefined,
				);
			}
		},
		onSuccess: () => {
			onClose();
		},
		onError: () => {
			setError(t("admin.texts.export.error"));
		},
	});

	const handleExport = () => {
		setError("");
		exportMutation.mutate();
	};

	const checkedCount = checkedIds.size;

	const handleOutputModeCombined = () => setOutputMode("combined");
	const handleOutputModeSeparate = () => setOutputMode("separate");

	return (
		<Modal
			open
			onClose={onClose}
			title={t("admin.texts.export.title")}
			className="max-w-[500px]"
		>
			{/* Format */}
			<div className="mb-5 flex flex-col gap-2">
				<Typography tag="p" className="text-[12px] font-medium text-t-2">
					{t("admin.texts.export.formatLabel")}
				</Typography>
				<div className="flex gap-2">
					{(["json", "csv"] as ExportFormat[]).map(f => {
						const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setFormat(f);
						return (
							<Button
								key={f}
								type="button"
								onClick={handleClick}
								title={f.toUpperCase()}
								className={`flex h-[34px] flex-1 cursor-pointer items-center justify-center rounded-lg border text-[12.5px] font-semibold tracking-wide transition-all ${
									format === f
										? "border-acc bg-acc/10 text-acc shadow-[0_0_0_1px_var(--color-acc)_inset]"
										: "border-bd-2 bg-transparent text-t-3 hover:border-bd-3 hover:bg-surf-2 hover:text-t-2"
								}`}
							>
								{f.toUpperCase()}
							</Button>
						);
					})}
				</div>
			</div>

			{/* Output mode */}
			<div className="mb-5 flex flex-col gap-2">
				<Typography tag="p" className="text-[12px] font-medium text-t-2">
					{t("admin.texts.export.outputModeLabel")}
				</Typography>
				<div className="flex gap-2">
					<OutputModeCard
						active={outputMode === "combined"}
						icon={<Files className="size-4 text-inherit" />}
						label={t("admin.texts.export.outputCombined")}
						description={t("admin.texts.export.outputCombinedDesc")}
						onClick={handleOutputModeCombined}
					/>
					<OutputModeCard
						active={outputMode === "separate"}
						icon={<FileText className="size-4 text-inherit" />}
						label={t("admin.texts.export.outputSeparate")}
						description={t("admin.texts.export.outputSeparateDesc")}
						onClick={handleOutputModeSeparate}
					/>
				</div>
			</div>

			{/* Texts list */}
			<div className="mb-5 flex flex-col gap-2">
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

				<div className="overflow-hidden rounded-[10px] border border-bd-1 bg-surf-2">
					{/* Search */}
					<div className="flex items-center gap-2 border-b border-bd-1 px-3 py-2">
						<Search className="size-3.5 shrink-0 text-t-4" />
						<Input
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
					<div className="max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-0">
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
					className="mb-4 rounded-[8px] bg-red-bg px-3 py-2.5 text-[12px] text-red-t"
				>
					{error}
				</Typography>
			)}

			<ModalActions>
				<Button
					onClick={onClose}
					disabled={exportMutation.isPending}
					title={t("admin.texts.export.cancel")}
					variant="ghost"
					className="h-[36px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.texts.export.cancel")}
				</Button>
				<Button
					onClick={handleExport}
					disabled={exportMutation.isPending || checkedCount === 0}
					title={exportMutation.isPending ? t("admin.texts.export.exporting") : t("admin.texts.export.submit")}
					variant="action"
					className="h-[36px] px-5 rounded-lg text-[13px] flex-1 gap-1.5"
				>
					<Download className="size-3.5 shrink-0" />
					{exportMutation.isPending
						? t("admin.texts.export.exporting")
						: t("admin.texts.export.submit")}
				</Button>
			</ModalActions>
		</Modal>
	);
};

interface OutputModeCardProps {
	active: boolean;
	icon: React.ReactNode;
	label: string;
	description: string;
	onClick: () => void;
}

const OutputModeCard = ({ active, icon, label, description, onClick }: OutputModeCardProps) => (
	<button
		type="button"
		onClick={onClick}
		className={`flex flex-1 cursor-pointer flex-col gap-1.5 rounded-[10px] border p-3 text-left transition-all ${
			active
				? "border-acc bg-acc/8 shadow-[0_0_0_1px_var(--color-acc)_inset]"
				: "border-bd-2 bg-surf-1 hover:border-bd-3 hover:bg-surf-2"
		}`}
	>
		<div className={`flex items-center gap-2 ${active ? "text-acc" : "text-t-3"}`}>
			{icon}
			<Typography tag="span" className="text-[12.5px] font-semibold text-inherit">
				{label}
			</Typography>
		</div>
		<Typography tag="p" className="text-[11px] leading-normal text-t-4">
			{description}
		</Typography>
	</button>
);

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
