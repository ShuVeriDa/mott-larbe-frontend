"use client";

import type { DashboardStats } from "@/entities/dashboard";
import type { UserProfile } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import type { ReactNode } from "react";
import { GreetingIntro } from "./greeting-intro";

interface GreetingSectionProps {
	user: UserProfile | undefined;
	lang: string;
	stats: DashboardStats;
}

export const GreetingSection = ({ user, lang, stats }: GreetingSectionProps) => {
	const { t } = useI18n();

	return (
		<div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-3">
			<GreetingIntro user={user} lang={lang} />

			<div className="flex shrink-0 items-center gap-2 max-sm:w-full max-sm:flex-wrap">
				<StatPill
					value={stats.textsRead}
					label={t("dashboard.stats.textsRead")}
					bgClass="bg-acc-bg"
					valueClass="text-acc-t"
					icon={<BookIcon />}
				/>
				<StatPill
					value={stats.wordsInDictionary}
					label={t("dashboard.stats.words")}
					bgClass="bg-grn-bg"
					valueClass="text-grn-t"
					icon={<WordsIcon />}
				/>
				<StatPill
					value={stats.streak}
					label={t("dashboard.stats.streak")}
					bgClass="bg-amb-bg"
					valueClass="text-amb-t"
					icon={<StreakIcon />}
				/>
				{stats.dueToday.total > 0 && (
					<Link
						href={`/${lang}/review`}
						className="flex items-center gap-2 rounded-lg border border-pur-bg bg-pur-bg px-3 py-1.5 transition-all duration-150 hover:border-pur-t/20 hover:brightness-95"
					>
						<ReviewIcon />
						<div className="flex items-baseline gap-1">
							<Typography tag="span" className="text-[13px] font-bold leading-none text-pur-t">
								{stats.dueToday.total}
							</Typography>
							<Typography tag="span" className="text-[10.5px] text-pur-t/70">
								{t("dashboard.stats.dueToday")}
							</Typography>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};

interface StatPillProps {
	value: number;
	label: string;
	bgClass: string;
	valueClass: string;
	icon: ReactNode;
}

const StatPill = ({ value, label, bgClass, valueClass, icon }: StatPillProps) => (
	<div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${bgClass}`}>
		{icon}
		<div className="flex items-baseline gap-1">
			<Typography tag="span" className={`text-[13px] font-bold leading-none ${valueClass}`}>
				{value.toLocaleString()}
			</Typography>
			<Typography tag="span" className="text-[10.5px] text-t-3">
				{label}
			</Typography>
		</div>
	</div>
);

const BookIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[13px] shrink-0 text-acc-t" aria-hidden="true">
		<path d="M7 3v9M2 2.5h4a1 1 0 0 1 1 1v7a1 1 0 0 0-1-1H2V2.5z" />
		<path d="M7 3.5h4a1 1 0 0 1 1 1v7a1 1 0 0 0-1-1H7" />
	</svg>
);

const WordsIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[13px] shrink-0 text-grn-t" aria-hidden="true">
		<path d="M2 4h10M2 7h7M2 10h5" strokeLinecap="round" />
	</svg>
);

const StreakIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" className="size-[13px] shrink-0 text-amb-t" aria-hidden="true">
		<polygon points="7,1.5 8.5,5 12,5.3 9.5,7.7 10.2,11.5 7,9.7 3.8,11.5 4.5,7.7 2,5.3 5.5,5" />
	</svg>
);

const ReviewIcon = () => (
	<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-[13px] shrink-0 text-pur-t" aria-hidden="true">
		<circle cx="7" cy="7" r="5" />
		<path d="M7 4.5v3l1.5 1.5" strokeLinecap="round" />
	</svg>
);
