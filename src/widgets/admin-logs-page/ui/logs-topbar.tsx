"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Play, Pause, Download } from "lucide-react";

interface LogsTopbarProps {
	isLive: boolean;
	onToggleLive: () => void;
	onExport: () => void;
}

export const LogsTopbar = ({
	isLive,
	onToggleLive,
	onExport,
}: LogsTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors">
			<div className="min-w-0 flex-1">
				<div className="font-display text-base font-medium text-t-1">
					{t("admin.logs.title")}
				</div>
				<div className="text-[11px] text-t-3">{t("admin.logs.subtitle")}</div>
			</div>

			<div className="ml-auto flex items-center gap-2">
				<Typography tag="span"
					className={cn(
						"inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold transition-opacity",
						"bg-grn-bg text-grn-t",
						!isLive && "opacity-40",
					)}
				>
					<Typography tag="span"
						className={cn(
							"size-1.5 rounded-full bg-grn",
							isLive && "animate-[pulse_1.6s_ease-in-out_infinite]",
						)}
					/>
					<Typography tag="span">{t("admin.logs.live")}</Typography>
				</Typography>

				<Button
					onClick={onToggleLive}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					{isLive ? <Pause className="size-[13px] shrink-0" /> : <Play className="size-[13px] shrink-0" />}
					{isLive ? t("admin.logs.pause") : t("admin.logs.resume")}
				</Button>

				<Button
					onClick={onExport}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
				>
					<Download className="size-[13px] shrink-0" />
					{t("admin.logs.export")}
				</Button>
			</div>
		</header>
	);
};
