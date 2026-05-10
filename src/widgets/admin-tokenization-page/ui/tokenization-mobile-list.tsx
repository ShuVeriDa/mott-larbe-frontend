"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import type { ProcessingStatus, TokenizationTextItem } from "@/entities/token";
import { useI18n } from "@/shared/lib/i18n";
import { TokenizationLevelBadge } from "./tokenization-level-badge";
import { TokenizationStatusBadge } from "./tokenization-status-badge";
import { ChevronRight } from "lucide-react";

interface TokenizationMobileListProps {
	items: TokenizationTextItem[];
	onRowClick: (id: string) => void;
}

export const TokenizationMobileList = ({
	items,
	onRowClick,
}: TokenizationMobileListProps) => {
	const { t } = useI18n();
	const formatCount = (value: number | null | undefined) =>
		typeof value === "number" && Number.isFinite(value)
			? value.toLocaleString()
			: "0";

	const statusLabels: Record<ProcessingStatus, string> = {
		IDLE: t("admin.tokenization.status.IDLE"),
		RUNNING: t("admin.tokenization.status.RUNNING"),
		COMPLETED: t("admin.tokenization.status.COMPLETED"),
		ERROR: t("admin.tokenization.status.ERROR"),
	};

	return (
		<div className="hidden max-sm:block">
			{items.map(item => {
			  const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = () => onRowClick(item.id);
			  return (
				<div
					key={item.id}
					onClick={handleClick}
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
						<Button className="flex size-8 shrink-0 items-center justify-center rounded-base bg-surf-2 text-t-2">
							<ChevronRight className="size-[14px]" />
						</Button>
					</div>
					<div className="flex items-center gap-3 text-[11px] text-t-3">
						<Typography tag="span">
							{t("admin.tokenization.table.tokens")}:{" "}
							<Typography tag="strong" className="text-t-2">
								{formatCount(item.totalTokens)}
							</Typography>
						</Typography>
						{item.notFoundCount > 0 && (
							<Typography tag="span" className="text-red-t font-semibold">
								—{item.notFoundCount}
							</Typography>
						)}
						{item.ambiguousCount > 0 && (
							<Typography tag="span" className="text-amb-t font-semibold">
								~{item.ambiguousCount}
							</Typography>
						)}
					</div>
				</div>
			);
			})}
		</div>
	);
};
