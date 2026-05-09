"use client";

import { Typography } from "@/shared/ui/typography";

import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { DashboardContinueItem } from "@/entities/dashboard";

interface ContinueReadingProps {
	items: DashboardContinueItem[];
	lang: string;
}

const LANGUAGE_DOT_COLOR: Record<string, string> = {
	CHE: "#e53935",
	RU: "#3b82f6",
	EN: "#0ea5e9",
};

const LANGUAGE_LABEL: Record<string, Record<string, string>> = {
	en: { CHE: "Chechen", RU: "Russian", EN: "English" },
	ru: { CHE: "Чеченский", RU: "Русский", EN: "Английский" },
	che: { CHE: "Нохчийн", RU: "Оьрсийн", EN: "Ингалсан" },
};

interface ContinueCardProps {
	item: DashboardContinueItem;
	lang: string;
}

const ContinueCard = ({ item, lang }: ContinueCardProps) => {
	const { t } = useI18n();
	const pct = Math.round(item.progressPercent);
	const isAlmostDone = pct >= 80;
	const dotColor = LANGUAGE_DOT_COLOR[item.language] ?? "#6b6a62";
	const langLabel = LANGUAGE_LABEL[lang]?.[item.language] ?? item.language;

	return (
		<Link
			href={`/${lang}/reader/${item.id}/p/${item.lastPageNumber}`}
			className="group flex flex-col overflow-hidden rounded-card border-hairline border border-bd-1 bg-surf transition-all hover:-translate-y-px hover:border-bd-2 hover:shadow-md"
		>
			<div className="relative h-[5px] w-full bg-surf-3">
				<div
					className="absolute left-0 top-0 h-full rounded-r-[3px] transition-[width]"
					style={{
						width: `${pct}%`,
						background: isAlmostDone ? "var(--grn)" : "var(--acc)",
					}}
				/>
			</div>

			<div className="flex flex-1 flex-col p-[13px_14px_14px]">
				<div className="mb-2 flex items-center gap-[5px]">
					<Typography tag="span"
						className="size-[6px] shrink-0 rounded-full"
						style={{ background: dotColor }}
					/>
					<Typography tag="span" className="text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
						{langLabel}
					</Typography>
				</div>

				<div className="mb-[3px] flex-1 text-[13px] font-semibold leading-[1.35] text-t-1">
					{item.title}
				</div>
				<div className="mb-3 text-[11px] text-t-3">
					{t("dashboard.continueReading.pageOf", {
						current: item.lastPageNumber,
						total: item.totalPages,
					})}
					{item.level ? ` · ${item.level}` : ""}
				</div>

				<div className="flex items-center justify-between">
					<Typography tag="span"
						className={cn(
							"text-[12px] font-semibold",
							isAlmostDone ? "text-grn" : "text-acc",
						)}
					>
						{pct}%
					</Typography>
					<Typography tag="span"
						className={cn(
							"rounded-[5px] border-none px-[9px] py-[3px] text-[11px] font-semibold transition-opacity group-hover:opacity-80",
							isAlmostDone
								? "bg-grn-bg text-grn-t"
								: "bg-acc-bg text-acc-t",
						)}
					>
						{isAlmostDone
							? t("dashboard.continueReading.almostDone")
							: t("dashboard.continueReading.continue")}
					</Typography>
				</div>
			</div>
		</Link>
	);
};

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
