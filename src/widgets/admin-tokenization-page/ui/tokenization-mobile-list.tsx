"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { ProcessingStatus, TokenizationTextItem } from "@/entities/token";
import { TokenizationLevelBadge } from "./tokenization-level-badge";
import { TokenizationStatusBadge } from "./tokenization-status-badge";

interface TokenizationMobileListProps {
	items: TokenizationTextItem[];
	onRowClick: (id: string) => void;
}

export const TokenizationMobileList = ({ items, onRowClick }: TokenizationMobileListProps) => {
	const { t } = useI18n();
	const formatCount = (value: number | null | undefined) =>
		typeof value === "number" && Number.isFinite(value) ? value.toLocaleString() : "0";

	const statusLabels: Record<ProcessingStatus, string> = {
		IDLE: t("admin.tokenization.status.IDLE"),
		RUNNING: t("admin.tokenization.status.RUNNING"),
		COMPLETED: t("admin.tokenization.status.COMPLETED"),
		ERROR: t("admin.tokenization.status.ERROR"),
	};

	return (
		<div className="hidden max-sm:block">
			{items.map((item) => (
				<div
					key={item.id}
					onClick={() => onRowClick(item.id)}
					className="cursor-pointer border-b border-bd-1 px-3.5 py-3 last:border-b-0 active:bg-surf-2"
				>
					<div className="mb-2 flex items-start gap-2.5">
						<TokenizationLevelBadge level={item.level} />
						<div className="min-w-0 flex-1">
							<div className="truncate text-[13px] font-medium text-t-1">
								{item.title}
							</div>
							<div className="mt-0.5">
								<TokenizationStatusBadge
									status={item.processingStatus}
									label={statusLabels[item.processingStatus]}
									progress={item.processingProgress}
								/>
							</div>
						</div>
						<button className="flex size-8 shrink-0 items-center justify-center rounded-[7px] bg-surf-2 text-t-2">
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
								<path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					</div>
					<div className="flex items-center gap-3 text-[11px] text-t-3">
						<span>
							{t("admin.tokenization.table.tokens")}:{" "}
							<strong className="text-t-2">{formatCount(item.totalTokens)}</strong>
						</span>
						{item.notFoundCount > 0 && (
							<span className="text-red-t font-semibold">
								—{item.notFoundCount}
							</span>
						)}
						{item.ambiguousCount > 0 && (
							<span className="text-amb-t font-semibold">
								~{item.ambiguousCount}
							</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
};
