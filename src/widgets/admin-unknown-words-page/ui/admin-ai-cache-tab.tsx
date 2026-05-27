"use client";

import type { AiCacheEntry, AiCacheStatus } from "@/entities/ai-translation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	Check,
	Search,
	ThumbsDown,
	ThumbsUp,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import { type ComponentProps } from "react";
import { useAdminAiCacheTab } from "../model/use-admin-ai-cache-tab";
import { AiCacheExportConfirmDialog } from "./ai-cache-export-confirm-dialog";
import { AiCacheExportHistory } from "./ai-cache-export-history";

const STATUS_TABS: AiCacheStatus[] = ["PENDING", "APPROVED", "REJECTED"];

const statusTabKey = (s: AiCacheStatus) => {
	if (s === "PENDING") return "aiTranslation.admin.tabPending";
	if (s === "APPROVED") return "aiTranslation.admin.tabApproved";
	return "aiTranslation.admin.tabRejected";
};

const AiCacheStatusTabs = ({
	status,
	pendingCount,
	onChange,
}: {
	status: AiCacheStatus;
	pendingCount: number | undefined;
	onChange: (s: AiCacheStatus) => void;
}) => {
	const { t } = useI18n();

	return (
		<div className="mb-2.5 overflow-x-auto [&::-webkit-scrollbar]:h-0">
			<div className="flex w-fit gap-0.5 rounded-[9px] border border-bd-1 bg-surf-2 p-[3px]">
				{STATUS_TABS.map(s => {
					const handleClick: NonNullable<
						ComponentProps<"button">["onClick"]
					> = () => onChange(s);
					return (
						<Button
							key={s}
							onClick={handleClick}
							className={cn(
								"flex h-7 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-base border-none px-[11px] font-sans text-[12.5px] transition-colors",
								status === s
									? "bg-surf font-medium text-t-1 shadow-sm"
									: "bg-transparent text-t-2 hover:bg-surf-3 hover:text-t-1",
							)}
						>
							{t(statusTabKey(s))}
							{s === "PENDING" && pendingCount !== undefined && (
								<Typography
									tag="span"
									className={cn(
										"min-w-[18px] rounded px-1 py-px text-center text-[10px] font-semibold",
										pendingCount > 0
											? "bg-red-bg text-red-t"
											: "bg-surf-3 text-t-3",
									)}
								>
									{pendingCount.toLocaleString("ru-RU")}
								</Typography>
							)}
						</Button>
					);
				})}
			</div>
		</div>
	);
};

const AiCacheRow = ({
	entry,
	onApprove,
	onReject,
	onDelete,
	isPendingApprove,
	isPendingReject,
	isPendingDelete,
}: {
	entry: AiCacheEntry;
	onApprove: () => void;
	onReject: () => void;
	onDelete: () => void;
	isPendingApprove: boolean;
	isPendingReject: boolean;
	isPendingDelete: boolean;
}) => {
	const { t } = useI18n();

	return (
		<div className="border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
			<div className="flex items-start gap-3">
				<div className="min-w-0 flex-1">
					<div className="mb-1 flex flex-wrap items-center gap-2">
						<span className="font-semibold text-[14px] text-t-1">
							{entry.lemma}
						</span>
						<span
							className={cn(
								"shrink-0 rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.4px] border-[0.5px]",
								entry.status === "APPROVED"
									? "border-grn/30 bg-grn/10 text-grn"
									: entry.status === "REJECTED"
										? "border-red/30 bg-red/10 text-red"
										: "border-pur/30 bg-pur-bg text-pur-t",
							)}
						>
							{t(statusTabKey(entry.status))}
						</span>
						{entry.status === "APPROVED" && entry.exportedAt && (
							<span className="shrink-0 rounded-[4px] border-[0.5px] border-grn/30 bg-grn/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.4px] text-grn">
								{t("aiTranslation.admin.exported")}
							</span>
						)}
						{entry.requestCount >= 10 && (
							<span className="shrink-0 rounded-[4px] border-[0.5px] border-red/30 bg-red-bg px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.4px] text-red-t">
								{t("aiTranslation.admin.hot")}
							</span>
						)}
					</div>
					<div className="mb-1 text-[13px] text-t-2">{entry.translation}</div>
					{entry.partOfSpeech && (
						<div className="text-[11.5px] text-t-3">{entry.partOfSpeech}</div>
					)}
					<div className="mt-1.5 flex items-center gap-3 text-[11px] text-t-3">
						<span>
							{t("aiTranslation.admin.requestCount")}:{" "}
							<strong className="text-t-2">{entry.requestCount}</strong>
						</span>
						<span className="flex items-center gap-0.5">
							<ThumbsUp className="size-3" strokeWidth={1.5} />
							{entry.thumbsUp}
						</span>
						<span className="flex items-center gap-0.5">
							<ThumbsDown className="size-3" strokeWidth={1.5} />
							{entry.thumbsDown}
						</span>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-1">
					{entry.status !== "APPROVED" && (
						<Button
							size="bare"
							onClick={onApprove}
							disabled={isPendingApprove}
							aria-label={t("aiTranslation.admin.approve")}
							title={t("aiTranslation.admin.approve")}
							className="inline-flex h-7 w-7 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-grn transition-colors hover:bg-grn/10 disabled:opacity-50"
						>
							<Check className="size-3.5" strokeWidth={1.8} />
						</Button>
					)}
					{entry.status !== "REJECTED" && (
						<Button
							size="bare"
							onClick={onReject}
							disabled={isPendingReject}
							aria-label={t("aiTranslation.admin.reject")}
							title={t("aiTranslation.admin.reject")}
							className="inline-flex h-7 w-7 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:bg-red/10 hover:text-red disabled:opacity-50"
						>
							<X className="size-3.5" strokeWidth={1.8} />
						</Button>
					)}
					<Button
						size="bare"
						onClick={onDelete}
						disabled={isPendingDelete}
						aria-label="Delete"
						className="inline-flex h-7 w-7 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:bg-red/10 hover:text-red disabled:opacity-50"
					>
						<Trash2 className="size-3.5" strokeWidth={1.6} />
					</Button>
				</div>
			</div>
		</div>
	);
};

const AiCachePagination = ({
	page,
	total,
	limit,
	onPageChange,
}: {
	page: number;
	total: number;
	limit: number;
	onPageChange: (p: number) => void;
}) => {
	const totalPages = Math.ceil(total / limit);
	if (totalPages <= 1) return null;

	const handlePrev: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onPageChange(page - 1);
	const handleNext: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onPageChange(page + 1);

	return (
		<div className="flex items-center justify-center gap-2 px-4 py-3 text-[12.5px] text-t-2">
			<Button
				size="bare"
				onClick={handlePrev}
				disabled={page <= 1}
				className="rounded-base border-[0.5px] border-bd-1 bg-surf-2 px-3 py-1 text-[12.5px] transition-colors hover:bg-surf-3 disabled:opacity-40"
			>
				←
			</Button>
			<span>
				{page} / {totalPages}
			</span>
			<Button
				size="bare"
				onClick={handleNext}
				disabled={page >= totalPages}
				className="rounded-base border-[0.5px] border-bd-1 bg-surf-2 px-3 py-1 text-[12.5px] transition-colors hover:bg-surf-3 disabled:opacity-40"
			>
				→
			</Button>
		</div>
	);
};

export const AdminAiCacheTab = () => {
	const { t } = useI18n();
	const {
		status,
		q,
		page,
		data,
		stats,
		isLoading,
		exportRuns,
		approve,
		reject,
		remove,
		exportToDictionary,
		confirmDialogOpen,
		handleOpenConfirmDialog,
		handleCloseConfirmDialog,
		handleConfirmExport,
		handleStatusChange,
		handleQChange,
		handlePageChange,
	} = useAdminAiCacheTab();

	const handleSearchChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = e => handleQChange(e.currentTarget.value);

	return (
		<div>
			<div className="mb-2.5 flex items-center justify-between gap-2">
				<AiCacheStatusTabs
					status={status}
					pendingCount={stats?.pending}
					onChange={handleStatusChange}
				/>
				<Button
					size="bare"
					onClick={handleOpenConfirmDialog}
					disabled={exportToDictionary.isPending}
					title={t("aiTranslation.admin.exportButton")}
					className="flex shrink-0 items-center gap-1.5 rounded-base border-[0.5px] border-bd-1 bg-surf-2 px-3 py-1.5 text-[12.5px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 disabled:opacity-50"
				>
					<Upload className="size-3.5" strokeWidth={1.6} />
					{t("aiTranslation.admin.exportButton")}
					{stats && stats.approvedNotExported > 0 && (
						<span className="min-w-[18px] rounded bg-amber-100 px-1 py-px text-center text-[10px] font-semibold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
							{stats.approvedNotExported}
						</span>
					)}
				</Button>
			</div>

			{/* Search */}
			<div className="mb-3 flex items-center gap-2 rounded-card border border-bd-1 bg-surf px-3 py-2">
				<Search className="size-3.5 shrink-0 text-t-3" strokeWidth={1.5} />
				<input
					type="text"
					value={q}
					onChange={handleSearchChange}
					placeholder={t("aiTranslation.admin.tabPending")}
					className="min-w-0 flex-1 bg-transparent text-[13px] text-t-1 outline-none placeholder:text-t-3"
				/>
			</div>

			{/* Table */}
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
				{isLoading && (
					<div className="flex items-center justify-center gap-2 py-10">
						<div className="size-[18px] animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
					</div>
				)}
				{!isLoading && !data?.items?.length && (
					<div className="flex flex-col items-center gap-2 py-12 text-center">
						<Typography className="text-[13px] text-t-3">—</Typography>
					</div>
				)}
				{!isLoading &&
					data?.items?.map(entry => (
						<AiCacheRow
							key={entry.id}
							entry={entry}
							onApprove={() => approve.mutate(entry.id)}
							onReject={() => reject.mutate(entry.id)}
							onDelete={() => remove.mutate(entry.id)}
							isPendingApprove={approve.isPending}
							isPendingReject={reject.isPending}
							isPendingDelete={remove.isPending}
						/>
					))}
				{data && (
					<AiCachePagination
						page={page}
						total={data.total}
						limit={data.limit}
						onPageChange={handlePageChange}
					/>
				)}
			</div>

			<AiCacheExportHistory runs={exportRuns} />

			<AiCacheExportConfirmDialog
				open={confirmDialogOpen}
				approvedNotExported={stats?.approvedNotExported ?? 0}
				isPending={exportToDictionary.isPending}
				onConfirm={handleConfirmExport}
				onClose={handleCloseConfirmDialog}
			/>
		</div>
	);
};
