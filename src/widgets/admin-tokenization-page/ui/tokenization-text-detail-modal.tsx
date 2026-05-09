"use client";

import { ComponentProps } from 'react';
import type {
	ProcessingStatus,
	TokenSource,
	TokenStatus,
	useTokenizationMutations,
} from "@/entities/token";
import { tokenizationApi, tokenizationKeys } from "@/entities/token";
import { useI18n } from "@/shared/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { TokenizationLevelBadge } from "./tokenization-level-badge";
import { TokenizationStatusBadge } from "./tokenization-status-badge";

interface TokenizationTextDetailModalProps {
	textId: string | null;
	onClose: () => void;
	mutations: ReturnType<typeof useTokenizationMutations>;
}

const SOURCE_STYLES: Record<TokenSource, string> = {
	ADMIN: "bg-acc-bg text-acc-t",
	CACHE: "bg-grn-bg text-grn-t",
	MORPHOLOGY: "bg-pur-bg text-pur-t",
	ONLINE: "bg-surf-3 text-t-2",
};

const TOKEN_STATUS_STYLES: Record<TokenStatus, string> = {
	ANALYZED: "bg-grn-bg text-grn-t",
	AMBIGUOUS: "bg-amb-bg text-amb-t",
	NOT_FOUND: "bg-red-bg text-red-t",
};

export const TokenizationTextDetailModal = ({
	textId,
	onClose,
	mutations,
}: TokenizationTextDetailModalProps) => {
	const { t } = useI18n();

	const { data: detail } = useQuery({
		queryKey: tokenizationKeys.detail(textId ?? ""),
		queryFn: () => tokenizationApi.textDetail(textId!),
		enabled: !!textId,
	});

	const { data: tokens } = useQuery({
		queryKey: tokenizationKeys.tokens(textId ?? "", { limit: 50 }),
		queryFn: () => tokenizationApi.textTokens(textId!, { limit: 50 }),
		enabled: !!textId,
	});

	if (!textId) return null;

	const statusLabels: Record<ProcessingStatus, string> = {
		IDLE: t("admin.tokenization.status.IDLE"),
		RUNNING: t("admin.tokenization.status.RUNNING"),
		COMPLETED: t("admin.tokenization.status.COMPLETED"),
		ERROR: t("admin.tokenization.status.ERROR"),
	};

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => e.stopPropagation();
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => textId && mutations.runText.mutate(textId);
	const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => textId && mutations.resetText.mutate(textId);
return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] max-sm:items-end max-sm:p-0"
			onClick={onClose}
		>
			<div
				className="flex max-h-[90vh] w-full max-w-[580px] flex-col overflow-hidden rounded-[14px] border border-bd-2 bg-surf shadow-md max-sm:max-h-[92vh] max-sm:rounded-b-none"
				onClick={handleClick}
			>
				{/* Header */}
				<div className="flex shrink-0 items-center justify-between border-b border-bd-1 px-4 py-3.5">
					<span className="font-display text-[15px] text-t-1">
						{t("admin.tokenization.detail.title")}
					</span>
					<button
						onClick={onClose}
						className="flex size-[26px] items-center justify-center rounded-[6px] bg-surf-2 text-t-2 hover:bg-surf-3"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path
								d="M4 4l8 8M12 4l-8 8"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-0">
					{!detail ? (
						<div className="space-y-3">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="h-10 animate-pulse rounded-[8px] bg-surf-3"
								/>
							))}
						</div>
					) : (
						<>
							{/* Meta grid */}
							<div className="mb-4 grid grid-cols-2 gap-2">
								{[
									{
										label: t("admin.tokenization.detail.level"),
										value: <TokenizationLevelBadge level={detail.level} />,
									},
									{
										label: t("admin.tokenization.detail.status"),
										value: (
											<TokenizationStatusBadge
												status={detail.processingStatus}
												label={statusLabels[detail.processingStatus]}
												progress={detail.processingProgress}
											/>
										),
									},
									{
										label: t("admin.tokenization.detail.version"),
										value: detail.version ? (
											<span className="font-mono text-[12px] text-t-2">
												v{detail.version.version}
											</span>
										) : (
											<span className="text-t-4">—</span>
										),
									},
									{
										label: t("admin.tokenization.detail.totalTokens"),
										value: (
											<span className="font-medium text-t-1">
												{detail.tokenStats.total.toLocaleString()}
											</span>
										),
									},
									{
										label: t("admin.tokenization.detail.analyzed"),
										value: (
											<span className="font-medium text-grn-t">
												{detail.tokenStats.analyzed.toLocaleString()} (
												{detail.tokenStats.analyzePercent}%)
											</span>
										),
									},
									{
										label: t("admin.tokenization.detail.notFound"),
										value: (
											<span
												className={
													detail.tokenStats.notFound > 0
														? "font-medium text-red-t"
														: "text-t-4"
												}
											>
												{detail.tokenStats.notFound > 0
													? detail.tokenStats.notFound.toLocaleString()
													: "—"}
											</span>
										),
									},
									{
										label: t("admin.tokenization.detail.ambiguous"),
										value: (
											<span
												className={
													detail.tokenStats.ambiguous > 0
														? "font-medium text-amb-t"
														: "text-t-4"
												}
											>
												{detail.tokenStats.ambiguous > 0
													? detail.tokenStats.ambiguous.toLocaleString()
													: "—"}
											</span>
										),
									},
									{
										label: t("admin.tokenization.detail.processedAt"),
										value: detail.version?.processedAt ? (
											<span className="text-[11.5px] text-t-3">
												{new Date(
													detail.version.processedAt,
												).toLocaleDateString()}
											</span>
										) : (
											<span className="text-t-4">—</span>
										),
									},
								].map(({ label, value }) => (
									<div
										key={label}
										className="rounded-[8px] bg-surf-2 px-3 py-2"
									>
										<div className="mb-1 text-[10.5px] text-t-3">{label}</div>
										<div className="text-[13px]">{value}</div>
									</div>
								))}
							</div>

							{/* Tokens table */}
							<div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3">
								{t("admin.tokenization.detail.tokensTitle")}
							</div>
							{!tokens || tokens.data.length === 0 ? (
								<div className="rounded-[8px] border border-bd-1 py-6 text-center text-[12px] text-t-3">
									{t("admin.tokenization.detail.noTokens")}
								</div>
							) : (
								<div className="overflow-hidden rounded-[8px] border border-bd-1">
									<table className="w-full border-collapse text-[12px]">
										<thead>
											<tr className="border-b border-bd-1 bg-surf-2">
												<th className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3">
													{t("admin.tokenization.detail.colOriginal")}
												</th>
												<th className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3 max-sm:hidden">
													{t("admin.tokenization.detail.colNormalized")}
												</th>
												<th className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3">
													{t("admin.tokenization.detail.colSource")}
												</th>
												<th className="px-2.5 py-[7px] text-left text-[10px] font-semibold uppercase tracking-[0.4px] text-t-3 max-sm:hidden">
													{t("admin.tokenization.detail.colPage")}
												</th>
											</tr>
										</thead>
										<tbody>
											{tokens.data.map(token => (
												<tr
													key={token.id}
													className="border-b border-bd-1 last:border-b-0 hover:bg-surf-2"
												>
													<td className="px-2.5 py-2">
														<span
															className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 font-mono text-[11.5px] font-semibold ${TOKEN_STATUS_STYLES[token.status]}`}
														>
															{token.original}
														</span>
													</td>
													<td className="px-2.5 py-2 font-mono text-[11px] text-t-3 max-sm:hidden">
														{token.normalized}
													</td>
													<td className="px-2.5 py-2">
														<span
															className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold ${SOURCE_STYLES[token.source]}`}
														>
															{token.source}
														</span>
													</td>
													<td className="px-2.5 py-2 text-[11px] text-t-3 tabular-nums max-sm:hidden">
														{token.pageNumber}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</>
					)}
				</div>

				{/* Footer actions */}
				<div className="flex shrink-0 gap-2 border-t border-bd-1 px-4 py-3.5">
					<button
						onClick={handleClick2}
						disabled={
							mutations.runText.isPending ||
							detail?.processingStatus === "RUNNING"
						}
						className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
							<path d="M5 3l8 5-8 5V3z" fill="currentColor" />
						</svg>
						{t("admin.tokenization.detail.runBtn")}
					</button>
					<button
						onClick={handleClick3}
						disabled={mutations.resetText.isPending}
						className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-2 disabled:opacity-50"
					>
						{t("admin.tokenization.detail.resetBtn")}
					</button>
					<button
						onClick={onClose}
						className="ml-auto flex h-[30px] items-center px-3 text-[12px] text-t-3 transition-colors hover:text-t-1"
					>
						{t("admin.tokenization.detail.closeBtn")}
					</button>
				</div>
			</div>
		</div>
	);
};
