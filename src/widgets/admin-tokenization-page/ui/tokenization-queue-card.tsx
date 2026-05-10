"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type { TokenizationQueue } from "@/entities/token";
import { useI18n } from "@/shared/lib/i18n";
import { Play } from "lucide-react";

interface TokenizationQueueCardProps {
	queue: TokenizationQueue | undefined;
	onRun: () => void;
}

export const TokenizationQueueCard = ({
	queue,
	onRun,
}: TokenizationQueueCardProps) => {
	const { t } = useI18n();

	return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			<div className="flex items-center border-b border-bd-1 px-3.5 py-[11px]">
				<Typography tag="span" className="text-[11px] font-semibold uppercase tracking-[0.4px] text-t-2">
					{t("admin.tokenization.sidePanel.queue")}
				</Typography>
				{queue && queue.count > 0 && (
					<Typography tag="span" className="ml-2 rounded bg-amb-bg px-1 py-px text-[10px] font-semibold text-amb-t">
						{queue.count}
					</Typography>
				)}
			</div>

			{!queue ? (
				<div className="flex flex-col gap-2 px-3.5 py-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex items-center gap-2.5">
							<div className="h-2.5 flex-1 animate-pulse rounded bg-surf-3" />
							<div className="h-2 w-8 animate-pulse rounded bg-surf-3" />
						</div>
					))}
				</div>
			) : queue.items.length === 0 ? (
				<div className="px-3.5 py-4 text-center text-[12px] text-t-3">
					{t("admin.tokenization.sidePanel.queueEmpty")}
				</div>
			) : (
				<div className="py-1">
					{queue.items.slice(0, 5).map((item, i) => (
						<div
							key={item.textId}
							className="flex items-center gap-2.5 border-b border-bd-1 px-3.5 py-[7px] text-[12px] last:border-b-0 hover:bg-surf-2 transition-colors"
						>
							<Typography tag="span" className="text-[10.5px] text-t-4 tabular-nums w-4 shrink-0">
								{i + 1}
							</Typography>
							<Typography tag="span" className="flex-1 min-w-0 truncate text-t-1">
								{item.title}
							</Typography>
							<div className="flex items-center gap-1.5 shrink-0">
								<div className="h-1 w-12 overflow-hidden rounded-full bg-surf-3">
									<div
										className="h-full rounded-full bg-acc transition-all"
										style={{ width: `${item.progress}%` }}
									/>
								</div>
								<Typography tag="span" className="text-[10.5px] text-t-3 tabular-nums w-7 text-right">
									{item.progress}%
								</Typography>
							</div>
						</div>
					))}
				</div>
			)}

			<div className="border-t border-bd-1 p-3.5">
				<Button
					onClick={onRun}
					className="flex h-[34px] w-full items-center justify-center gap-1.5 rounded-base bg-acc text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
				>
					<Play className="size-[13px]" />
					{t("admin.tokenization.sidePanel.runBtn")}
				</Button>
			</div>
		</div>
	);
};
