"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { ProcessingStatus, TokenizationTextItem } from "@/entities/token";
import type { useTokenizationMutations } from "@/entities/token";
import { TokenizationLevelBadge } from "./tokenization-level-badge";
import { TokenizationStatusBadge } from "./tokenization-status-badge";

interface TokenizationTableProps {
	items: TokenizationTextItem[];
	selectedIds: Set<string>;
	allSelected: boolean;
	isLoading: boolean;
	onToggleAll: () => void;
	onToggleRow: (id: string) => void;
	onRowClick: (id: string) => void;
	mutations: ReturnType<typeof useTokenizationMutations>;
}

const TokenBar = ({
	value,
	max,
	color,
}: {
	value: number | null | undefined;
	max: number | null | undefined;
	color: string;
}) => {
	const normalizedValue = typeof value === "number" && Number.isFinite(value) ? value : 0;
	const normalizedMax = typeof max === "number" && Number.isFinite(max) ? max : 0;
	const pct = normalizedMax > 0 ? Math.round((normalizedValue / normalizedMax) * 100) : 0;
	return (
		<div className="flex items-center gap-1.5">
			<span className="tabular-nums text-[12.5px] text-t-1">
				{normalizedValue.toLocaleString()}
			</span>
			<div className="h-1.5 w-14 overflow-hidden rounded-full bg-surf-3">
				<div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
			</div>
		</div>
	);
};

export const TokenizationTable = ({
	items,
	selectedIds,
	allSelected,
	isLoading,
	onToggleAll,
	onToggleRow,
	onRowClick,
	mutations,
}: TokenizationTableProps) => {
	const { t } = useI18n();

	const statusLabels: Record<ProcessingStatus, string> = {
		IDLE: t("admin.tokenization.status.IDLE"),
		RUNNING: t("admin.tokenization.status.RUNNING"),
		COMPLETED: t("admin.tokenization.status.COMPLETED"),
		ERROR: t("admin.tokenization.status.ERROR"),
	};

	if (isLoading) {
		return (
			<div className="overflow-x-auto max-sm:hidden">
				<table className="w-full border-collapse text-[12.5px]">
					<tbody>
						{Array.from({ length: 8 }).map((_, i) => (
							<tr key={i} className="border-b border-bd-1">
								<td className="py-2.5 pl-3.5 pr-2" style={{ width: 30 }}>
									<div className="size-3.5 animate-pulse rounded bg-surf-3" />
								</td>
								<td className="px-2.5 py-2.5">
									<div className="h-3 w-48 animate-pulse rounded bg-surf-3" />
									<div className="mt-1.5 h-2 w-32 animate-pulse rounded bg-surf-3" />
								</td>
								{Array.from({ length: 5 }).map((_, j) => (
									<td key={j} className="px-2.5 py-2.5">
										<div className="h-3 w-14 animate-pulse rounded bg-surf-3" />
									</td>
								))}
								<td style={{ width: 70 }} />
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:rounded bg-surf-4 max-sm:hidden">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr>
						<th className="bg-surf-2 py-2.5 pl-3.5 pr-2 border-b border-bd-1" style={{ width: 30 }}>
							<input
								type="checkbox"
								checked={allSelected}
								onChange={onToggleAll}
								className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
							/>
						</th>
						<th className="bg-surf-2 px-2.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1">
							{t("admin.tokenization.table.textTitle")}
						</th>
						<th className="bg-surf-2 px-2.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1" style={{ width: 44 }}>
							{t("admin.tokenization.table.level")}
						</th>
						<th className="bg-surf-2 px-2.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1" style={{ width: 140 }}>
							{t("admin.tokenization.table.tokens")}
						</th>
						<th className="bg-surf-2 px-2.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1" style={{ width: 90 }}>
							{t("admin.tokenization.table.notFound")}
						</th>
						<th className="bg-surf-2 px-2.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1" style={{ width: 90 }}>
							{t("admin.tokenization.table.ambiguous")}
						</th>
						<th className="bg-surf-2 px-2.5 py-2.5 text-left text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3 whitespace-nowrap border-b border-bd-1" style={{ width: 88 }}>
							{t("admin.tokenization.table.version")}
						</th>
						<th className="bg-surf-2 border-b border-bd-1" style={{ width: 66 }} />
					</tr>
				</thead>
				<tbody>
					{items.map((item) => {
					  const handleClick: NonNullable<ComponentProps<"tr">["onClick"]> = () => onRowClick(item.id);
					  const handleClick2: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = () => onToggleRow(item.id);
					  const handleClick3: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
					  const handleClick4: NonNullable<ComponentProps<"button">["onClick"]> = () => mutations.cancelText.mutate(item.id);
					  const handleClick5: NonNullable<ComponentProps<"button">["onClick"]> = () => mutations.runText.mutate(item.id);
					  const handleClick6: NonNullable<ComponentProps<"button">["onClick"]> = () => mutations.resetText.mutate(item.id);
					  return (
						<tr
							key={item.id}
							onClick={handleClick}
							className="cursor-pointer border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2 group"
						>
							<td className="py-2.5 pl-3.5 pr-2" onClick={handleClick2}>
								<input
									type="checkbox"
									checked={selectedIds.has(item.id)}
									onChange={handleChange}
									className="size-3.5 cursor-pointer rounded border-[1.5px] border-bd-3 accent-acc"
								/>
							</td>
							<td className="px-2.5 py-2.5">
								<div className="text-[13px] font-medium text-t-1 leading-snug line-clamp-1">
									{item.title}
								</div>
								<div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-t-3">
									<TokenizationStatusBadge
										status={item.processingStatus}
										label={statusLabels[item.processingStatus]}
										progress={item.processingProgress}
									/>
									<span>{item.pagesCount} {t("admin.tokenization.table.pages")}</span>
								</div>
							</td>
							<td className="px-2.5 py-2.5">
								<TokenizationLevelBadge level={item.level} />
							</td>
							<td className="px-2.5 py-2.5">
								<TokenBar value={item.totalTokens} max={item.totalTokens} color="bg-acc" />
							</td>
							<td className="px-2.5 py-2.5">
								{item.notFoundCount > 0 ? (
									<span className="font-semibold text-red-t tabular-nums">
										{item.notFoundCount.toLocaleString()}
									</span>
								) : (
									<span className="text-t-4">—</span>
								)}
							</td>
							<td className="px-2.5 py-2.5">
								{item.ambiguousCount > 0 ? (
									<span className="font-semibold text-amb-t tabular-nums">
										{item.ambiguousCount.toLocaleString()}
									</span>
								) : (
									<span className="text-t-4">—</span>
								)}
							</td>
							<td className="px-2.5 py-2.5">
								{item.tokenizationVersion !== null ? (
									<span className="font-mono text-[11.5px] text-t-3">
										v{item.tokenizationVersion}
									</span>
								) : (
									<span className="text-t-4">—</span>
								)}
							</td>
							<td className="px-2 py-2.5" onClick={handleClick3}>
								<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
									{item.processingStatus === "RUNNING" ? (
										<button
											onClick={handleClick4}
											disabled={mutations.cancelText.isPending}
											title={t("admin.tokenization.row.cancel")}
											className="flex size-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
										>
											<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
												<rect x="4" y="4" width="8" height="8" rx="1.5" fill="currentColor" />
											</svg>
										</button>
									) : (
										<button
											onClick={handleClick5}
											disabled={mutations.runText.isPending}
											title={t("admin.tokenization.row.run")}
											className="flex size-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
										>
											<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
												<path d="M5 3l8 5-8 5V3z" fill="currentColor" />
											</svg>
										</button>
									)}
									<button
										onClick={handleClick6}
										disabled={mutations.resetText.isPending}
										title={t("admin.tokenization.row.reset")}
										className="flex size-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
									>
										<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
											<path d="M2.5 8A5.5 5.5 0 0114 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
											<path d="M2.5 8L4.5 5.5M2.5 8L5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
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
