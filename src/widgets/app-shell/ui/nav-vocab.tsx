"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useDictionaryList } from "@/entities/dictionary";

const STATUS_CLASS: Record<string, string> = {
	KNOWN: "bg-grn-bg text-grn-t",
	LEARNING: "bg-amb-bg text-amb-t",
	NEW: "bg-surf-3 text-t-3",
};

export const NavVocab = () => {
	const { t, lang } = useI18n();
	const { data } = useDictionaryList({ sort: "added", limit: 5 });
	const items = data?.items ?? [];

	if (items.length === 0) return null;

	return (
		<div className="px-3.5 pb-2.5 pt-1">
			<div className="mb-1.5 flex items-center justify-between">
				<span className="text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
					{t("nav.recentWords")}
				</span>
				<Link
					href={`/${lang}/vocabulary`}
					className="text-[10.5px] text-acc transition-colors hover:underline"
				>
					{t("nav.recentWordsAll")}
				</Link>
			</div>

			<div className="flex flex-col">
				{items.map((item) => (
					<div
						key={item.id}
						className="flex items-center gap-1.5 py-[2.5px]"
					>
						<span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-t-1">
							{item.word}
						</span>
						<span className="max-w-[58px] truncate text-[10.5px] text-t-3">
							{item.translation}
						</span>
						<span
							className={cn(
								"shrink-0 rounded-[3px] px-[5px] py-[1.5px] text-[9px] font-semibold uppercase",
								STATUS_CLASS[item.wordProgressStatus] ?? "bg-surf-3 text-t-3",
							)}
						>
							{t(`nav.wordStatus.${item.wordProgressStatus}`)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
