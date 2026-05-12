"use client";

import type { DashboardContinueItem } from "@/entities/dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { ContinueCard } from "./continue-card";

interface ContinueReadingProps {
	items: DashboardContinueItem[];
	lang: string;
}

export const ContinueReading = ({ items, lang }: ContinueReadingProps) => {
	const { t } = useI18n();

	if (items.length === 0) return null;

	return (
		<section>
			<div className="mb-2.5 flex items-center justify-between">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("dashboard.continueReading.title")}
				</Typography>
				<Link
					href={`/${lang}/texts?status=IN_PROGRESS`}
					className="text-[11.5px] text-acc transition-colors hover:underline"
				>
					{t("dashboard.continueReading.viewAll")}
				</Link>
			</div>
			<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-[repeat(3,220px)] max-sm:overflow-x-auto max-sm:pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden">
				{items.slice(0, 3).map((item) => (
					<ContinueCard key={item.id} item={item} lang={lang} />
				))}
			</div>
		</section>
	);
};
