"use client";

import Link from "next/link";
import type { TextProgressItem } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface TextsProgressProps {
	items: TextProgressItem[];
	lang: string;
}

const colorForPercent = (percent: number): { bar: string; pct: string } => {
	if (percent === 0) return { bar: "bg-acc", pct: "text-t-3" };
	if (percent >= 80) return { bar: "bg-grn", pct: "text-grn" };
	if (percent >= 50) return { bar: "bg-pur", pct: "text-pur" };
	return { bar: "bg-acc", pct: "text-acc" };
};

const TextRow = ({
	item,
	lang,
}: {
	item: TextProgressItem;
	lang: string;
}) => {
	const { t } = useI18n();
	const { bar, pct } = colorForPercent(item.progressPercent);
	const isNew = item.progressPercent === 0;

	return (
		<Link
			href={`/${lang}/texts/${item.id}`}
			className="flex items-center gap-3 border-b border-bd-1 py-2 transition-colors last:border-b-0 hover:rounded-base hover:bg-surf-2 hover:px-1.5 hover:-mx-1.5"
		>
			<div
				className="flex size-[34px] shrink-0 items-center justify-center rounded-base bg-acc-bg max-md:size-7"
				aria-hidden="true"
			>
				<svg
					width="16"
					height="16"
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
				<Typography
					tag="p"
					className="mb-0.5 truncate text-[12.5px] font-medium text-t-1"
				>
					{item.title}
				</Typography>
				<div className="flex items-center gap-1.5 text-[11px] text-t-3">
					<Typography tag="span">{item.level}</Typography>
					<Typography tag="span" aria-hidden="true">·</Typography>
					<Typography tag="span">{item.language}</Typography>
					<Typography tag="span" aria-hidden="true">·</Typography>
					<Typography tag="span">
						{t("statistics.texts.wordsOf", {
							known: item.knownWords,
							total: item.wordCount,
						})}
					</Typography>
				</div>
			</div>

			<div className="w-[100px] shrink-0 max-md:w-20 max-[480px]:w-[60px]">
				<div className="mb-0.5 h-1 overflow-hidden rounded-[2px] bg-surf-3">
					<div
						className={cn("h-full rounded-[2px] transition-[width]", bar)}
						style={{ width: `${item.progressPercent}%` }}
					/>
				</div>
				<div className={cn("text-right text-[11px] font-medium", pct)}>
					{isNew
						? t("statistics.texts.new")
						: `${Math.round(item.progressPercent)}%`}
				</div>
			</div>
		</Link>
	);
};

export const TextsProgress = ({ items, lang }: TextsProgressProps) => {
	const { t } = useI18n();

	return (
		<section className="rounded-card border-hairline border-bd-1 bg-surf p-4">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.texts.title")}
				</Typography>
				<Link
					href={`/${lang}/texts`}
					className="text-[11.5px] text-acc hover:underline"
				>
					{t("statistics.texts.all")}
				</Link>
			</header>

			{items.length === 0 ? (
				<div className="py-6 text-center text-[11px] text-t-3">
					{t("statistics.texts.empty")}
				</div>
			) : (
				<div className="flex flex-col">
					{items.map((item) => (
						<TextRow key={item.id} item={item} lang={lang} />
					))}
				</div>
			)}
		</section>
	);
};
