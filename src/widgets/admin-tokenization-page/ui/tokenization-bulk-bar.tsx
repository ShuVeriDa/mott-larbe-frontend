"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";

interface TokenizationBulkBarProps {
	selectedCount: number;
	onRun: () => void;
	onReset: () => void;
	isLoading: boolean;
}

export const TokenizationBulkBar = ({
	selectedCount,
	onRun,
	onReset,
	isLoading,
}: TokenizationBulkBarProps) => {
	const { t } = useI18n();

	if (selectedCount === 0) return null;

	return (
		<div className="flex items-center gap-2.5 border-b border-bd-1 bg-acc-bg px-4 py-2">
			<Typography tag="span" className="text-[12px] font-semibold text-acc-t whitespace-nowrap">
				{t("admin.tokenization.bulk.selected").replace("{count}", String(selectedCount))}
			</Typography>
			<div className="ml-auto flex gap-1.5">
				<Button
					onClick={onRun}
					disabled={isLoading}
					className="h-[26px] rounded-[6px] bg-acc px-2.5 text-[11.5px] font-medium text-white disabled:opacity-50"
				>
					{t("admin.tokenization.bulk.run")}
				</Button>
				<Button
					onClick={onReset}
					disabled={isLoading}
					className="h-[26px] rounded-[6px] border border-bd-2 bg-surf px-2.5 text-[11.5px] text-t-2 hover:bg-surf-2 hover:text-t-1 disabled:opacity-50"
				>
					{t("admin.tokenization.bulk.reset")}
				</Button>
			</div>
		</div>
	);
};
