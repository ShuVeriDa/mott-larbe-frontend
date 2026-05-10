"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { Download, FileText } from "lucide-react";


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
					<Download className="size-3" />
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.payments.topbar.exportCsv")}
					</Typography>
				</Button>

				<Button
					disabled
					title={t("admin.payments.topbar.reportUnavailable")}
					className="flex h-[30px] cursor-not-allowed items-center gap-1.5 rounded-base border border-bd-1 bg-transparent px-2.5 text-[12px] font-medium text-t-4 opacity-50 max-sm:px-2"
				>
					<FileText className="size-3" />
					<Typography tag="span" className="max-sm:hidden">
						{t("admin.payments.topbar.report")}
					</Typography>
				</Button>
			</div>
		</header>
	);
};
