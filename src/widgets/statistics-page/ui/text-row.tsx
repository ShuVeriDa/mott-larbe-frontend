"use client";
import type { TextProgressItem } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

const colorForPercent = (percent: number): { bar: string; pct: string } => {
	if (percent === 0) return { bar: "bg-acc", pct: "text-t-3" };
	if (percent >= 80) return { bar: "bg-grn", pct: "text-grn" };
	if (percent >= 50) return { bar: "bg-pur", pct: "text-pur" };
	return { bar: "bg-acc", pct: "text-acc" };
};

interface TextRowProps {
	item: TextProgressItem;
	lang: string;
}

export const TextRow = ({ item, lang }: TextRowProps) => {
	const { t } = useI18n();
	const { bar, pct } = colorForPercent(item.progressPercent);
	const isNew = item.progressPercent === 0;

	return (
		<Link
			href={`/${lang}/texts/${item.id}`}
			className="flex items-center gap-3 border-b border-bd-1 py-2 transition-colors last:border-b-0 hover:rounded-base hover:bg-surf-2 hover:px-1.5 hover:-mx-1.5 max-[480px]:gap-2"
		>
			<div
				className="flex size-[34px] shrink-0 items-center justify-center rounded-base bg-acc-bg max-[480px]:size-6"
				aria-hidden="true"
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 28 28"
					fill="none"
					stroke="var(--acc)"
					strokeWidth="1.6"
				>
					<path
						d="M5 22L14 7l9 15"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path d="M8 17h12" strokeLinecap="round" />
				</svg>
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-baseline justify-between gap-2">
					<Typography
						tag="p"
						className="truncate text-[12.5px] font-medium text-t-1 max-[480px]:text-[11.5px]"
					>
						{item.title}
					</Typography>
					<span className={cn("shrink-0 text-[11px] font-medium max-[480px]:text-[10.5px]", pct)}>
						{isNew ? t("statistics.texts.new") : `${Math.round(item.progressPercent)}%`}
					</span>
				</div>
				<div className="mt-0.5 mb-0.5 h-1 overflow-hidden rounded-[2px] bg-surf-3">
					<div
						className={cn("h-full rounded-[2px] transition-[width]", bar)}
						style={{ width: `${item.progressPercent}%` }}
					/>
				</div>
				<div className="flex items-center gap-1.5 text-[10.5px] text-t-3">
					<Typography tag="span">
						{item.level ? t(`shared.cefrLevel.${item.level}`) : "—"}
					</Typography>
					<Typography tag="span" aria-hidden="true" className="max-[480px]:hidden">·</Typography>
					<Typography tag="span" className="max-[480px]:hidden">{item.language}</Typography>
					<Typography tag="span" aria-hidden="true">·</Typography>
					<Typography tag="span">
						{t("statistics.texts.wordsOf", {
							known: item.knownWords,
							total: item.wordCount,
						})}
					</Typography>
				</div>
			</div>
		</Link>
	);
};
