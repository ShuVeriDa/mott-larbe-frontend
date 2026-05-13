"use client";

import { Typography } from "@/shared/ui/typography";

import type { LibraryTextListItem } from "@/entities/library-text";
import type { LibraryView } from "@/features/library-filters";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { CefrBadge } from "@/shared/ui/cefr-badge";
import Link from "next/link";
import { ComponentProps } from "react";

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
	const progressConfig = getProgressConfig(
		item.progressPercent,
		item.progressStatus,
	);
	const href = `/${lang}/reader/${item.id}/p/1`;
	const delay = Math.min(index * 30, 330);

	if (view === "list") {
		return (
			<Link
				href={href}
				className="animate-in fade-in slide-in-from-bottom-1 group relative flex items-center gap-3 overflow-hidden rounded-base border border-bd-1 bg-surf px-3.5 py-2.5 transition-colors duration-150 hover:border-bd-2 hover:bg-surf-2"
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
					<div className="mt-0.5 flex items-center gap-1 text-[11px] text-t-3">
						<CefrBadge level={item.level} />
						<Typography
							tag="span"
							className="h-[2px] w-[2px] rounded-full bg-t-4"
						/>
						<Typography tag="span">
							{t(`library.lang.${item.language}`)}
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
					<div className="w-[140px] shrink-0">
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
					<ActionButton status={item.progressStatus} t={t} />
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

	const handleMenuClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = e => {
		e.preventDefault();
		e.stopPropagation();
	};
	return (
		<Link
			href={href}
			className="animate-in fade-in slide-in-from-bottom-2 group relative flex flex-col gap-2.5 overflow-hidden rounded-card border border-bd-1 bg-surf px-4 py-3.5 transition-[border-color,background-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-bd-2 hover:bg-surf-2 hover:shadow-md active:translate-y-0 [@media(hover:none)]:hover:translate-y-0 [@media(hover:none)]:hover:shadow-none [@media(hover:none)]:active:bg-surf-2"
			style={{
				animationDelay: `${delay}ms`,
				animationFillMode: "both",
				animationDuration: "250ms",
			}}
		>
			<Typography
				tag="span"
				aria-hidden="true"
				className={cn(
					"absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-150 group-hover:opacity-100 bg-linear-to-r",
					levelBar,
					"to-transparent",
				)}
			/>

			<div className="flex items-start justify-between gap-2">
				<div className="flex items-center gap-1">
					<CefrBadge level={item.level} />
					{/* <Typography
						tag="span"
						className="rounded border border-bd-1 bg-surf-2 px-[7px] py-[2px] text-[10px] text-t-3"
					>
						{t(`library.lang.${item.language}`)}
					</Typography> */}
					{item.tags[0] &&
						item.tags.slice(0, 3).map(tag => (
							<Typography
								key={tag.id}
								tag="span"
								className="rounded border border-bd-2 bg-surf px-[7px] py-[2px] text-[10px] text-t-2 "
							>
								#{tag.name}
							</Typography>
						))}

					{item.isNew && (
						<Typography
							tag="span"
							className="rounded bg-acc-bg px-[5px] py-px text-[9px] font-bold uppercase tracking-wider text-acc-t"
						>
							{t("library.card.badgeNew")}
						</Typography>
					)}
				</div>
				{/* <Button
					onClick={handleMenuClick}
					size={"bare"}
					className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] text-t-4 transition-colors duration-100 hover:bg-surf-3 hover:text-t-2"
					aria-label="Меню"
				>
					<DotsIcon />
				</Button> */}
			</div>

			<div>
				<Typography
					tag="p"
					className="text-[14px] font-medium leading-[1.4] tracking-[-0.15px] text-t-1"
				>
					{item.title}
				</Typography>
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
					<Typography
						tag="span"
						className="h-[2px] w-[2px] shrink-0 rounded-full bg-t-4"
					/>
					<Typography tag="span">{item.language}</Typography>
				</div>
			</div>

			{item.progressPercent > 0 && (
				<div>
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

			<div className="mt-0.5 flex items-center justify-between">
				<ActionButton status={item.progressStatus} t={t} />
				<Typography tag="span" className="text-[10px] text-t-4 max-sm:hidden">
					{item.wordCount.toLocaleString()}&nbsp;{t("library.card.tokens")}
				</Typography>
			</div>
		</Link>
	);
};

const ActionButton = ({
	status,
	t,
}: {
	status: string;
	t: (key: string) => string;
}) => {
	if (status === "COMPLETED") {
		return (
			<Typography
				tag="span"
				className="inline-flex h-7 items-center rounded-base border border-grn/20 bg-grn-bg px-3 text-[11px] font-medium text-grn-t"
			>
				✓&nbsp;{t("library.card.done")}
			</Typography>
		);
	}
	if (status === "IN_PROGRESS") {
		return (
			<Typography
				tag="span"
				className="inline-flex h-7 items-center rounded-base border border-bd-2 bg-surf-2 px-3 text-[11px] font-medium text-t-2"
			>
				{t("library.card.continue")}
			</Typography>
		);
	}
	return (
		<Typography
			tag="span"
			className="inline-flex h-7 items-center rounded-base border border-acc/22 bg-acc-bg px-3 text-[11px] font-medium text-acc-t"
		>
			{t("library.card.start")}
		</Typography>
	);
};

const DotsIcon = () => (
	<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
		<circle cx="6" cy="2" r=".9" />
		<circle cx="6" cy="6" r=".9" />
		<circle cx="6" cy="10" r=".9" />
	</svg>
);
