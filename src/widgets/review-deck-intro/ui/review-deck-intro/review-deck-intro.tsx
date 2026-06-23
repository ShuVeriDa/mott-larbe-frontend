"use client";

import type { DeckStats } from "@/entities/deck";
import { ModeSelector, type SessionMode } from "@/features/session-mode";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { DeckDailyWords } from "../deck-daily-words";
import { DeckGuide } from "../deck-guide";
import { DeckSettingsPanel } from "../deck-settings-panel";
import { motion } from "framer-motion";
import { variants } from "@/shared/lib/animation";

export interface ReviewDeckIntroProps {
	stats: DeckStats | undefined;
	loading: boolean;
	error: boolean;
	premiumLocked: boolean;
	hasDue: boolean;
	sessionMode: SessionMode;
	onModeChange: (mode: SessionMode) => void;
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
	sessionMode,
	onModeChange,
	onStart,
	onUpgrade,
}: ReviewDeckIntroProps) => {
	const { t } = useI18n();

	const deckMaxSize = stats?.deckMaxSize ?? 90;
	const currentNum = stats?.currentNumberedDeck ?? 1;
	const numberedCount =
		stats?.numbered.find(n => n.deckNumber === currentNum)?.count ?? 0;
	const repeatCount = stats?.repeat ?? 0;

	const rows: DeckRowConfig[] = [
		...(repeatCount > 0
			? [
					{
						key: "repeat",
						icon: "🔁",
						title: t("review.deck.intro.row.repeat"),
						desc: t("review.deck.intro.row.repeatDesc"),
						count: repeatCount,
						max: deckMaxSize,
						bg: "bg-red-bg",
						bar: "bg-red",
						border: "border-red/25",
					} satisfies DeckRowConfig,
				]
			: []),
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
		<motion.section
			className="flex flex-1 flex-col items-center justify-center px-5 py-7 max-md:justify-start max-md:px-4 max-md:pt-6"
			variants={variants.staggerContainer}
			initial="hidden"
			animate="visible"
		>
			<motion.div variants={variants.staggerItem}>
				<Typography
					tag="h2"
					className="mb-1 text-center font-display text-[20px] font-normal text-t-1"
				>
					{t("review.deck.intro.title")}
				</Typography>
				{!loading && !error ? (
					<p className="mb-5 w-full max-w-[500px] whitespace-pre-line text-center text-[13px] leading-[1.75] text-t-2">
						{t("review.deck.intro.subtitle")}
					</p>
				) : (
					<p className="mb-5 text-[13px] text-t-3">
						{loading
							? t("review.deck.intro.loading")
							: t("review.deck.intro.error")}
					</p>
				)}
			</motion.div>

			<motion.div className="mb-4 w-full max-w-[500px]" variants={variants.staggerItem}>
				{!premiumLocked ? (
					<div className="mb-2 flex items-center justify-between">
						<span className="text-[11px] uppercase tracking-wide text-t-3">
							{t("review.deck.intro.decksLabel")}
						</span>
						<div className="flex items-center gap-1.5">
							<DeckGuide />
							<DeckSettingsPanel />
						</div>
					</div>
				) : null}
				<motion.ul
					className="flex flex-col gap-1.5"
					variants={variants.staggerContainer}
				>
					{rows.map(({ key, ...row }) => (
						<DeckRow key={key} {...row} />
					))}
				</motion.ul>
				{stats != null && !premiumLocked ? (
					<Typography className="mt-2 text-center text-[11.5px] text-t-3">
						{t("review.deck.intro.totalWords", { count: stats.total })}
					</Typography>
				) : null}
			</motion.div>

			{!premiumLocked ? (
				<motion.div className="mb-4 w-full max-w-[500px]" variants={variants.staggerItem}>
					<DeckDailyWords />
				</motion.div>
			) : null}

			{!premiumLocked ? (
				<motion.div className="mb-4 w-full max-w-[420px]" variants={variants.staggerItem}>
					<ModeSelector value={sessionMode} onChange={onModeChange} />
				</motion.div>
			) : null}

			<motion.div className="w-full max-w-[400px]" variants={variants.staggerItem}>
				<Button
					variant="action"
					size="lg"
					onClick={onStart}
					disabled={loading || premiumLocked || !hasDue}
					className="w-full"
				>
					{t("review.deck.intro.start")}
				</Button>
			</motion.div>

			{premiumLocked ? (
				<div className="mt-4 flex w-full max-w-[340px] flex-col items-center gap-2 rounded-card border-[0.5px] border-pur/20 bg-pur-bg p-4 text-center">
					<Typography tag="span" className="text-[20px]" aria-hidden="true">
						🔒
					</Typography>
					<Typography tag="h2" className="text-[13px] font-semibold text-pur-t">
						{t("review.deck.intro.premium.title")}
					</Typography>
					<Typography className="text-[12px] leading-normal text-t-3">
						{t("review.deck.intro.premium.subtitle")}
					</Typography>
					<Button
						onClick={onUpgrade}
						className="h-8 cursor-pointer rounded-base bg-pur px-4 text-[12px] font-semibold text-white transition-opacity hover:opacity-[0.88]"
					>
						{t("review.deck.intro.premium.cta")}
					</Button>
				</div>
			) : null}
		</motion.section>
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
		<motion.li
			className={`flex items-center gap-3 rounded-card border-[0.5px] ${border ?? "border-bd-2"} bg-surf px-3.5 py-3 shadow-sm`}
			variants={variants.staggerItem}
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
					<motion.div
						className={`h-full rounded-full ${bar}`}
						initial={{ width: 0 }}
						animate={{ width: `${pct}%` }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
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
		</motion.li>
	);
};
