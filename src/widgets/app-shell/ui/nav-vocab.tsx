"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";

import { useDictionaryList } from "@/entities/dictionary";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";

const STATUS_CLASS: Record<string, string> = {
	KNOWN: "bg-grn-bg text-grn-t",
	LEARNING: "bg-acc-bg text-acc-t",
	NEW: "bg-amb-bg text-t-3",
};

export const NavVocab = () => {
	const { t, lang } = useI18n();
	const { data } = useDictionaryList({ sort: "added", limit: 5 });
	const items = data?.items ?? [];

	if (items.length === 0) return null;

	return (
		<div className="flex flex-col w-full px-3.5 pb-2.5 pt-1.5 border-t-[0.5px] border-t-[bd]">
			<div className="mb-1.5 flex items-center justify-between ">
				<SectionLabel className="mb-0">
					{t("nav.recentWords")}
				</SectionLabel>
				<Link
					href={`/${lang}/vocabulary`}
					className="text-[10.5px] text-acc transition-colors hover:underline"
				>
					{t("nav.recentWordsAll")}
				</Link>
			</div>

			<div className="flex flex-col w-full">
				{items.map(item => (
					<div
						key={item.id}
						className="flex items-center justify-between w-full gap-1.5 py-[4.5px] border-b-[0.5px] border-b-[bd]"
					>
						<div className="flex flex-col w-full">
							<Typography
								tag="span"
								className="min-w-0 flex-1 truncate text-[12px] font-medium text-t-1"
							>
								{item.word}
							</Typography>
							<Typography
								tag="span"
								className="max-w-[150px] truncate text-[10.5px] text-t-3"
							>
								{item.translation}
							</Typography>
						</div>
						<div>
							<Typography
								tag="span"
								className={cn(
									"shrink-0 rounded-[3px] px-1.5 py-0.5 text-[10px] font-semibold uppercase",
									STATUS_CLASS[item.wordProgressStatus] ?? "bg-surf-3 text-t-3",
								)}
							>
								{t(`nav.wordStatus.${item.wordProgressStatus}`)}
							</Typography>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
