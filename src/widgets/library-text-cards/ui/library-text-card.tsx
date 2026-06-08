"use client";

import { Typography } from "@/shared/ui/typography";

import type { LibraryTextListItem } from "@/entities/library-text";
import type { LibraryView } from "@/features/library-filters";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { CefrBadge } from "@/shared/ui/cefr-badge";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { type CSSProperties } from "react";

interface LibraryTextCardProps {
	item: LibraryTextListItem;
	view: LibraryView;
	index: number;
}

const getLevelBar = (level: CefrLevel | null): string => {
	if (!level) return "from-t-4";
	if (level === "A") return "from-grn";
	if (level === "B") return "from-amb";
	return "from-red";
};

type LevelCover = { cov: string; stripe: string; glow: string };

const LEVEL_COVER: Record<CefrLevel, LevelCover> = {
	A: { cov: "bg-grn-bg", stripe: "var(--grn)", glow: "#22c55e" },
	B: { cov: "bg-pur-bg", stripe: "var(--pur)", glow: "#6d4ed4" },
	C: { cov: "bg-amb-bg", stripe: "var(--amb)", glow: "#f59e0b" },
};

const getLevelCover = (level: CefrLevel | null): LevelCover =>
	LEVEL_COVER[(level as CefrLevel) ?? ""] ?? LEVEL_COVER.B;

const LEVEL_PROGRESS: Record<
	CefrLevel,
	{ fill: string; color: string; badgeBg: string; badgeText: string }
> = {
	A: {
		fill: "bg-grn",
		color: "var(--grn)",
		badgeBg: "bg-grn-bg",
		badgeText: "text-grn-t",
	},
	B: {
		fill: "bg-pur",
		color: "var(--pur)",
		badgeBg: "bg-pur-bg",
		badgeText: "text-pur-t",
	},
	C: {
		fill: "bg-amb",
		color: "var(--amb)",
		badgeBg: "bg-amb-bg",
		badgeText: "text-amb-t",
	},
};

const getLevelProgress = (level: CefrLevel | null) =>
	LEVEL_PROGRESS[(level as CefrLevel) ?? ""] ?? LEVEL_PROGRESS.B;

const getProgressConfig = (percent: number, status: string) => {
	if (status === "COMPLETED") return { fill: "bg-grn", label: "done" };
	if (percent > 0) return { fill: "bg-acc", label: "reading" };
	return { fill: "bg-bd-2", label: "new" };
};

const formatWords = (n: number) =>
	n < 1000 ? `${n}` : `${(n / 1000).toFixed(1)}k`;

export const LibraryTextCard = ({
	item,
	view,
	index,
}: LibraryTextCardProps) => {
	const { t, lang } = useI18n();
	const levelBar = getLevelBar(item.level);
	const levelProgress = getLevelProgress(item.level);
	const progressConfig = getProgressConfig(
		item.progressPercent,
		item.progressStatus,
	);
	const href = `/${lang}/texts/${item.id}`;
	const delay = Math.min(index * 30, 330);

	if (view === "list") {
		return (
			<Link
				href={href}
				className="animate-in fade-in slide-in-from-bottom-1 motion-reduce:animate-none group relative flex items-center gap-3 overflow-hidden rounded-base border border-bd-1 bg-surf px-3.5 py-3 transition-colors duration-150 hover:border-bd-2 hover:bg-surf-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-1"
				style={{
					animationDelay: `${delay}ms`,
					animationFillMode: "both",
					animationDuration: "220ms",
				}}
			>
				<Typography
					tag="span"
					aria-hidden="true"
					className={cn(
						"absolute left-0 bottom-[5px] top-[5px] w-[2px] rounded-r-[2px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 bg-linear-to-b",
						levelBar,
						"to-transparent",
					)}
				/>
				<div className="min-w-0 flex-1">
					<Typography
						tag="p"
						className="truncate text-[13px] font-medium leading-[1.4] tracking-[-0.12px] text-t-1"
					>
						{item.title}
					</Typography>
					<div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-t-3">
						<CefrBadge level={item.level} />
						<Typography
							tag="span"
							className="h-[2px] w-[2px] rounded-full bg-t-4"
						/>
						<Typography tag="span">
							{t(`shared.lang.${item.language}`)}
						</Typography>
						<Typography
							tag="span"
							className="h-[2px] w-[2px] rounded-full bg-t-4"
						/>
						<Typography tag="span">
							{formatWords(item.wordCount)}&nbsp;{t("library.card.wordsUnit")}
						</Typography>
						<Typography
							tag="span"
							className="h-[2px] w-[2px] rounded-full bg-t-4"
						/>
						<Typography tag="span">
							≈{item.readingTime}&nbsp;{t("library.card.minUnit")}
						</Typography>
					</div>
				</div>

				{item.progressPercent > 0 && (
					<div className="w-[140px] shrink-0 max-sm:hidden">
						<div className="mb-1 flex justify-between text-[10px] text-t-3">
							<Typography tag="span">{t("library.card.progress")}</Typography>
							<Typography tag="span">{item.progressPercent}%</Typography>
						</div>
						<div className="h-[3px] overflow-hidden rounded-full bg-surf-3">
							<div
								className={cn(
									"h-full rounded-full transition-[width] duration-500",
									progressConfig.fill,
								)}
								style={{ width: `${item.progressPercent}%` }}
							/>
						</div>
					</div>
				)}

				<div className="flex shrink-0 flex-col items-end gap-1.5">
					{item.progressStatus === "COMPLETED" && (
						<Typography
							tag="span"
							className="rounded px-1.5 py-px text-[10px] font-medium bg-grn-bg text-grn-t"
						>
							✓&nbsp;{t("library.card.done")}
						</Typography>
					)}
					{item.isNew && (
						<Typography
							tag="span"
							className="rounded px-1 py-px text-[9px] font-bold uppercase tracking-wide bg-acc-bg text-acc-t"
						>
							{t("library.card.badgeNew")}
						</Typography>
					)}
				</div>
			</Link>
		);
	}

	const cover = getLevelCover(item.level);

	return (
		<Link
			href={href}
			className="animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none group relative flex w-[224px] max-sm:w-[calc(50%-6px)] max-[380px]:w-full flex-col overflow-hidden rounded-card border border-bd-1 bg-surf transition-[border-color,transform,box-shadow] duration-200 hover:border-bd-2 hover:[box-shadow:0_4px_14px_2px_var(--card-glow)] active:translate-y-0 [@media(hover:none)]:hover:translate-y-0 [@media(hover:none)]:hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc focus-visible:ring-offset-1"
			style={
				{
					animationDelay: `${delay}ms`,
					animationFillMode: "both",
					animationDuration: "250ms",
					"--card-glow": `${cover.glow}90`,
				} as CSSProperties
			}
		>
			{/* Cover */}
			<div
				className={cn(
					"relative flex h-[160px] items-center justify-center sm:h-[260px]",
					cover.cov,
				)}
			>
				<div
					aria-hidden="true"
					className="absolute bottom-0 left-0 top-0 w-[3px]"
					style={{ background: cover.stripe }}
				/>
				<BookOpen
					size={28}
					aria-hidden="true"
					className="opacity-60 sm:size-8"
					style={{ color: cover.stripe }}
				/>
				{item.isNew && (
					<Typography
						tag="span"
						className="absolute right-2 top-2 rounded bg-acc-bg px-[5px] py-px text-[9px] font-bold uppercase tracking-wider text-acc-t"
					>
						{t("library.card.badgeNew")}
					</Typography>
				)}
			</div>

			{/* Body */}
			<div className="flex flex-col gap-2 p-3">
				<div className="flex items-start justify-between gap-1">
					<Typography
						tag="p"
						className="line-clamp-2 text-[13.5px] font-medium leading-[1.4] tracking-[-0.15px] text-t-1"
					>
						{item.title}
					</Typography>
					<CefrBadge level={item.level} />
				</div>

				<div>
					<div className="mt-1 flex flex-wrap items-center gap-1 text-[11px] text-t-3">
						<Typography tag="span">
							{formatWords(item.wordCount)}&nbsp;{t("library.card.wordsUnit")}
						</Typography>
						<Typography
							tag="span"
							className="h-[2px] w-[2px] shrink-0 rounded-full bg-t-4"
						/>
						<Typography tag="span">
							≈{item.readingTime}&nbsp;{t("library.card.minUnit")}
						</Typography>
					</div>
				</div>

				<div>
					<div className="mb-1 flex justify-between text-[10px] text-t-3">
						{item.progressStatus === "COMPLETED" ? (
							<Typography
								tag="span"
								className={cn(
									"rounded px-1.5 py-px text-[10px] font-medium",
									levelProgress.badgeBg,
									levelProgress.badgeText,
								)}
							>
								✓&nbsp;{t("library.card.done")}
							</Typography>
						) : (
							<Typography tag="span" style={{ color: levelProgress.color }}>
								{t("library.card.progress")}
							</Typography>
						)}
						<Typography tag="span" style={{ color: levelProgress.color }}>
							{item.progressStatus === "COMPLETED"
								? "100%"
								: `${item.progressPercent}%`}
						</Typography>
					</div>
					<div className="h-[2px] overflow-hidden rounded-full bg-surf-3">
						<div
							className="h-full rounded-full transition-[width] duration-500"
							style={{
								width: `${item.progressPercent}%`,
								background:
									item.progressPercent > 0
										? levelProgress.color
										: "transparent",
							}}
						/>
					</div>
				</div>
			</div>
		</Link>
	);
};
