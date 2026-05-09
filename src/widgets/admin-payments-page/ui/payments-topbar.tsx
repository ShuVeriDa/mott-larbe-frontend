"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { useI18n } from "@/shared/lib/i18n";

interface Props {
	onExportCsv: () => void;
}

export const PaymentsTopbar = ({ onExportCsv }: Props) => {
	const { t } = useI18n();

	return (
		<header className=" flex items-center gap-3 border-b border-bd-1 bg-surf px-[22px] py-3.5 transition-colors max-sm:px-3.5">
			<div className="min-w-0 flex-1">
				<div className="font-display text-[16px] text-t-1">
					{t("admin.payments.title")}
				</div>
				<div className="mt-px text-[12px] text-t-3">
					{t("admin.payments.subtitle")}
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-2">
				<Button
					onClick={onExportCsv}
					className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 max-sm:px-2"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M6 1v7M3 5l3 3 3-3M1 9v1.5A.5.5 0 001.5 11h9a.5.5 0 00.5-.5V9" />
					</svg>
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.payments.topbar.exportCsv")}
					</Typography>
				</Button>

				<Button
					disabled
					title={t("admin.payments.topbar.reportUnavailable")}
					className="flex h-[30px] cursor-not-allowed items-center gap-1.5 rounded-base border border-bd-1 bg-transparent px-2.5 text-[12px] font-medium text-t-4 opacity-50 max-sm:px-2"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
						<path d="M4 5h4M4 7.5h2.5" strokeLinecap="round" />
					</svg>
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.payments.topbar.report")}
					</Typography>
				</Button>
			</div>
		</header>
	);
};
