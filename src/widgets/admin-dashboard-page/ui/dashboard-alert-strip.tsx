"use client";

import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface DashboardAlertStripProps {
	unknownWordsCount: number;
}

export const DashboardAlertStrip = ({ unknownWordsCount }: DashboardAlertStripProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();

	if (unknownWordsCount === 0) return null;

	return (
		<div className="mb-4 flex items-start gap-2.5 rounded-[9px] border border-amb/20 bg-amb-bg px-3.5 py-2.5">
			<AlertCircle className="mt-0.5 size-4 shrink-0 text-amb" />
			<div className="flex-1">
				<Typography tag="p" className="text-[12.5px] text-amb-t">
					<Typography tag="strong" className="font-semibold">
						{t("admin.dashboard.alert.unknownWords").replace("{count}", String(unknownWordsCount))}
					</Typography>
				</Typography>
				<Link
					href={`/${params.lang}/admin/unknown-words`}
					className="mt-1 block text-[12px] text-amb-t underline"
				>
					{t("admin.dashboard.alert.viewBtn")}
				</Link>
			</div>
		</div>
	);
};
