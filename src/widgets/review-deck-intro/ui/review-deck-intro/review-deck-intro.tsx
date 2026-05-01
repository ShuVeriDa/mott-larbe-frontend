"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { DeckStats } from "@/entities/deck";

export interface ReviewDeckIntroProps {
	stats: DeckStats | undefined;
	loading: boolean;
	error: boolean;
	premiumLocked: boolean;
	hasDue: boolean;
	onStart: () => void;
	onUpgrade: () => void;
}

interface DeckRowConfig {
	key: string;
	icon: string;
	title: string;
	desc: string;
	count: number;
	max: number;
	bg: string;
	bar: string;
	border?: string;
}

export const ReviewDeckIntro = ({
	stats,
	loading,
	error,
	premiumLocked,
	hasDue,
	onStart,
	onUpgrade,
}: ReviewDeckIntroProps) => {
	const { t } = useI18n();

	const deckMaxSize = stats?.deckMaxSize ?? 90;
	const currentNum = stats?.currentNumberedDeck ?? 1;
	const numberedCount =
		stats?.numbered.find((n) => n.deckNumber === currentNum)?.count ?? 0;

	const rows: DeckRowConfig[] = [
		{
			key: "new",
			icon: "🆕",
			title: t("review.deck.intro.row.new"),
			desc: t("review.deck.intro.row.newDesc"),
			count: stats?.new ?? 0,
			max: deckMaxSize,
			bg: "bg-acc-bg",
			bar: "bg-acc",
			border: "border-acc/20",
		},
		{
			key: "old",
			icon: "📦",
			title: t("review.deck.intro.row.old"),
			desc: t("review.deck.intro.row.oldDesc"),
			count: stats?.old ?? 0,
			max: deckMaxSize,
			bg: "bg-amb-bg",
			bar: "bg-amb",
		},
		{
			key: "retired",
			icon: "🗂️",
			title: t("review.deck.intro.row.retired"),
			desc: t("review.deck.intro.row.retiredDesc"),
			count: stats?.retired ?? 0,
			max: deckMaxSize,
			bg: "bg-pur-bg",
			bar: "bg-pur",
		},
		{
			key: "numbered",
			icon: "🔄",
			title: t("review.deck.intro.row.numbered", { n: currentNum }),
			desc: t("review.deck.intro.row.numberedDesc", {
				total: stats?.maxNumberedDeck ?? 7,
			}),
			count: numberedCount,
			max: deckMaxSize,
			bg: "bg-grn-bg",
			bar: "bg-grn",
			border: "border-grn/25",
		},
	];

	return (
		<section className="flex flex-1 flex-col items-center justify-center px-5 py-7 max-md:justify-start max-md:px-4 max-md:pt-6">
			<Typography
				tag="h1"
				className="mb-1 text-center font-display text-[20px] font-normal text-t-1"
			>
				{t("review.deck.intro.title")}
			</Typography>
			<Typography className="mb-5 max-w-[400px] text-center text-[13px] leading-[1.6] text-t-3">
				{loading
					? t("review.deck.intro.loading")
					: error
						? t("review.deck.intro.error")
						: t("review.deck.intro.subtitle")}
			</Typography>

			<ul className="mb-5 flex w-full max-w-[500px] flex-col gap-1.5">
				{rows.map(({ key, ...row }) => (
					<DeckRow key={key} {...row} />
				))}
			</ul>

			<Button
				variant="action"
				size="lg"
				onClick={onStart}
				disabled={loading || premiumLocked || !hasDue}
				className="w-full max-w-[400px]"
			>
				{t("review.deck.intro.start")}
			</Button>

			{premiumLocked ? (
				<div className="mt-4 flex w-full max-w-[340px] flex-col items-center gap-2 rounded-card border-hairline border-pur/20 bg-pur-bg p-4 text-center">
					<span className="text-[20px]" aria-hidden="true">🔒</span>
					<Typography
						tag="h2"
						className="text-[13px] font-semibold text-pur-t"
					>
						{t("review.deck.intro.premium.title")}
					</Typography>
					<Typography className="text-[12px] leading-normal text-t-3">
						{t("review.deck.intro.premium.subtitle")}
					</Typography>
					<button
						type="button"
						onClick={onUpgrade}
						className="h-8 cursor-pointer rounded-base bg-pur px-4 text-[12px] font-semibold text-white transition-opacity hover:opacity-[0.88]"
					>
						{t("review.deck.intro.premium.cta")}
					</button>
				</div>
			) : null}
		</section>
	);
};

const DeckRow = ({
	icon,
	title,
	desc,
	count,
	max,
	bg,
	bar,
	border,
}: DeckRowConfig) => {
	const { t } = useI18n();
	const pct = max > 0 ? Math.min((count / max) * 100, 100) : 0;

	return (
		<li
			className={`flex items-center gap-3 rounded-card border-hairline ${border ?? "border-bd-2"} bg-surf px-3.5 py-3 shadow-sm`}
		>
			<div
				className={`flex size-8 shrink-0 items-center justify-center rounded-base text-[14px] ${bg}`}
				aria-hidden="true"
			>
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<div className="text-[13px] font-semibold text-t-1">{title}</div>
				<div className="mt-px text-[11px] text-t-3">{desc}</div>
				<div className="mt-1 h-1 w-[52px] overflow-hidden rounded-full bg-surf-3 max-md:hidden">
					<div
						className={`h-full rounded-full ${bar}`}
						style={{ width: `${pct}%` }}
					/>
				</div>
			</div>
			<div className="text-right">
				<div className="text-[12.5px] font-semibold text-t-2 tabular-nums">
					{count}
				</div>
				<div className="text-[10px] text-t-3 tabular-nums">
					{t("review.deck.intro.row.of", { max })}
				</div>
			</div>
		</li>
	);
};
