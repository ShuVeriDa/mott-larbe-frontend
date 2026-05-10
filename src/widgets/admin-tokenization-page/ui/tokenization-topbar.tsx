"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";
import { CheckCircle2, Play } from "lucide-react";

interface TokenizationTopbarProps {
	onRun: () => void;
	onBatchRun: () => void;
}

export const TokenizationTopbar = ({
	onRun,
	onBatchRun,
}: TokenizationTopbarProps) => {
	const { t } = useI18n();

	return (
		<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 ">
			<div className="min-w-0">
				<Typography tag="h1" className="font-display text-base text-t-1">
					{t("admin.tokenization.title")}
				</Typography>
				<Typography tag="p" className="mt-px text-[12px] text-t-3 max-sm:hidden">
					{t("admin.tokenization.subtitle")}
				</Typography>
			</div>
			<div className="ml-auto flex items-center gap-2 shrink-0">
				<Button
					onClick={onBatchRun}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
				>
					<CheckCircle2 className="size-[13px]" />
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.tokenization.batchBtn")}
					</Typography>
				</Button>
				<Button
					onClick={onRun}
					className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
				>
					<Play className="size-3" />
					{t("admin.tokenization.runBtn")}
				</Button>
			</div>
		</header>
	);
};
