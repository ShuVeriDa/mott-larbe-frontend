"use client";

import type {
	AdminTextListItem,
	ProcessingStatus,
} from "@/entities/admin-text";
import { useAdminTextSSE } from "@/entities/admin-text";
import type { useAdminTextMutations } from "@/entities/admin-text/model/use-admin-text-mutations";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { AlertCircle, TrendingUp } from "lucide-react";
import { ComponentProps } from "react";
import { TextLevelBadge } from "./text-level-badge";
import { TextProcessingBar } from "./text-processing-bar";
import { TextRowActions } from "./text-row-actions";
import { TextStatusBadge } from "./text-status-badge";

interface TextsTableProps {
	texts: AdminTextListItem[];
	selectedIds: Set<string>;
	allSelected: boolean;
	onToggleAll: () => void;
	onToggleRow: (id: string) => void;
	mutations: ReturnType<typeof useAdminTextMutations>;
	isLoading: boolean;
}

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

interface TextTableRowProps {
	text: AdminTextListItem;
	selected: boolean;
	onToggle: () => void;
	mutations: ReturnType<typeof useAdminTextMutations>;
}

const TextTableRow = ({
	text,
	selected,
	onToggle,
	mutations,
}: TextTableRowProps) => {
	const { t } = useI18n();
	const sseData = useAdminTextSSE(text.id, text.processingStatus === "RUNNING");

	const processingStatus: ProcessingStatus =
		sseData?.status && sseData.status !== "NONE"
			? (sseData.status as ProcessingStatus)
			: text.processingStatus;
	const processingProgress = sseData?.progress ?? text.processingProgress;

	const handleCheckboxClick: NonNullable<ComponentProps<"td">["onClick"]> = e =>
		e.stopPropagation();
	const handleActionsClick: NonNullable<ComponentProps<"td">["onClick"]> = e =>
		e.stopPropagation();
	return (
		<tr className="border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2">
			<td className="px-2.5 py-[10px] pl-3.5" onClick={handleCheckboxClick}>
				<input
					type="checkbox"
					checked={selected}
					onChange={onToggle}
					className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
				/>
			</td>

			<td className="px-2.5 py-[10px]">
				<div className="flex flex-col gap-0.5">
					<Typography
						tag="span"
						className="line-clamp-1 text-[13px] font-medium leading-[1.3] text-t-1"
					>
						{text.title}
					</Typography>
					<Typography
						tag="span"
						className="flex flex-wrap items-center gap-1.5 text-[11px] text-t-3"
					>
						{text.processingStatus === "ERROR" ? (
							<Typography
								tag="span"
								className="flex items-center gap-1 text-red-t"
							>
								<AlertCircle className="size-[11px]" />
								{t("admin.texts.table.errorMeta")}
							</Typography>
						) : (
							<Typography tag="span" className="flex items-center gap-1">
								<TrendingUp className="size-[11px]" />
								{text.tokenCount > 0
									? t("admin.texts.table.tokens", { count: text.tokenCount })
									: t("admin.texts.table.notProcessed")}
							</Typography>
						)}
						{text.tags.length > 0 && (
							<Typography tag="span">
								{text.tags.map(tag => tag.name).join(", ")}
							</Typography>
						)}
					</Typography>
				</div>
			</td>

			<td className="px-2.5 py-[10px]">
				<TextLevelBadge level={text.level} />
			</td>

			<td className="px-2.5 py-[10px]">
				<TextStatusBadge status={text.status} />
			</td>

			<td className="px-2.5 py-[10px]">
				<TextProcessingBar
					status={processingStatus}
					progress={processingProgress}
				/>
			</td>

			<td className="px-2.5 py-[10px] text-[12px] text-t-2">
				{text.readCount > 0 ? (
					text.readCount.toLocaleString("ru-RU")
				) : (
					<Typography tag="span" className="text-t-3">
						—
					</Typography>
				)}
			</td>

			<td className="px-2.5 py-[10px] text-[11.5px] text-t-3 max-md:hidden">
				{formatDate(text.createdAt)}
			</td>

			<td className="px-2.5 py-[10px]" onClick={handleActionsClick}>
				<TextRowActions text={text} mutations={mutations} />
			</td>
		</tr>
	);
};

export const TextsTable = ({
	texts,
	selectedIds,
	allSelected,
	onToggleAll,
	onToggleRow,
	mutations,
	isLoading,
}: TextsTableProps) => {
	const { t } = useI18n();

	const thClass =
		"px-2.5 py-[10px] text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap bg-surf-2";

	if (isLoading) {
		return (
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
				<table className="w-full border-collapse text-[12.5px]">
					<tbody>
						{Array.from({ length: 6 }).map((_, i) => (
							<tr key={i} className="border-b border-bd-1">
								<td className="px-2.5 py-2.5 pl-3.5" style={{ width: 30 }}>
									<div className="size-3.5 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-2.5">
									<div className="space-y-1.5">
										<div className="h-3 w-48 animate-pulse rounded bg-surf-3" />
										<div className="h-2.5 w-28 animate-pulse rounded bg-surf-3" />
									</div>
								</td>
								<td className="px-2.5 py-2.5" style={{ width: 50 }}>
									<div className="h-4.5 w-7 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-2.5" style={{ width: 110 }}>
									<div className="h-4 w-20 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-2.5" style={{ width: 150 }}>
									<div className="h-2 w-full animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-2.5" style={{ width: 85 }}>
									<div className="h-3 w-10 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-2.5" style={{ width: 90 }}>
									<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
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
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr className="border-b border-bd-1">
						<th className={`${thClass} pl-3.5`} style={{ width: 30 }}>
							<input
								type="checkbox"
								checked={allSelected}
								onChange={onToggleAll}
								className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
							/>
						</th>
						<th className={thClass}>{t("admin.texts.table.title")}</th>
						<th className={thClass} style={{ width: 50 }}>
							{t("admin.texts.table.level")}
						</th>
						<th className={thClass} style={{ width: 110 }}>
							{t("admin.texts.table.status")}
						</th>
						<th className={thClass} style={{ width: 150 }}>
							{t("admin.texts.table.processing")}
						</th>
						<th className={thClass} style={{ width: 85 }}>
							{t("admin.texts.table.reads")}
						</th>
						<th className={`${thClass} max-md:hidden`} style={{ width: 90 }}>
							{t("admin.texts.table.date")}
						</th>
						<th className={thClass} style={{ width: 90 }} />
					</tr>
				</thead>
				<tbody>
					{texts.map(text => {
						const handleToggle: NonNullable<
							ComponentProps<typeof TextTableRow>["onToggle"]
						> = () => onToggleRow(text.id);
						return (
							<TextTableRow
								key={text.id}
								text={text}
								selected={selectedIds.has(text.id)}
								onToggle={handleToggle}
								mutations={mutations}
							/>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};
