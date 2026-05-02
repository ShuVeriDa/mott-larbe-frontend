"use client";

import { useI18n } from "@/shared/lib/i18n";

interface TokenizationTopbarProps {
	onRun: () => void;
	onBatchRun: () => void;
}

export const TokenizationTopbar = ({ onRun, onBatchRun }: TokenizationTopbarProps) => {
	const { t } = useI18n();

	return (
		<div className="flex items-center gap-3 border-b border-bd-1 bg-panel px-5 py-3.5 sticky top-0 z-10">
			<div className="min-w-0">
				<h1 className="font-display text-base text-t-1">
					{t("admin.tokenization.title")}
				</h1>
				<p className="mt-px text-[12px] text-t-3 max-sm:hidden">
					{t("admin.tokenization.subtitle")}
				</p>
			</div>
			<div className="ml-auto flex items-center gap-2 shrink-0">
				<button
					onClick={onBatchRun}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
				>
					<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
						<path d="M5.5 8l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span className="max-sm:hidden">{t("admin.tokenization.batchBtn")}</span>
				</button>
				<button
					onClick={onRun}
					className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
				>
					<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
						<path d="M5 3l8 5-8 5V3z" fill="currentColor" />
					</svg>
					{t("admin.tokenization.runBtn")}
				</button>
			</div>
		</div>
	);
};
