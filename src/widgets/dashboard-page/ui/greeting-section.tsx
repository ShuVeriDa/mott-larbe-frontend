"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { DashboardStats } from "@/entities/dashboard";
import type { UserProfile } from "@/entities/user";

interface GreetingSectionProps {
	user: UserProfile | undefined;
	stats: DashboardStats;
	lang: string;
}

const getGreetingKey = (): string => {
	const h = new Date().getHours();
	if (h < 12) return "dashboard.greeting.morning";
	if (h < 18) return "dashboard.greeting.afternoon";
	return "dashboard.greeting.evening";
};

const formatDate = (lang: string): string => {
	return new Date().toLocaleDateString(
		lang === "che" ? "ru-RU" : lang === "ru" ? "ru-RU" : "en-US",
		{ weekday: "long", day: "numeric", month: "long" },
	);
};

export const GreetingSection = ({ user, stats, lang }: GreetingSectionProps) => {
	const { t } = useI18n();

	const firstName = user?.name ?? user?.username ?? "";
	const greeting = t(getGreetingKey());
	const displayName = firstName ? `${greeting}, ${firstName}` : greeting;

	return (
		<div className="flex items-start justify-between gap-4 max-sm:flex-col max-sm:gap-2.5">
			<div>
				<Typography tag="h1" className="mb-1 font-display text-[21px] font-normal tracking-[-0.3px] text-t-1 max-sm:text-[19px]">
					{displayName}
				</Typography>
				<div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-t-2">
					<Typography tag="span">{formatDate(lang)}</Typography>
					{user?.level ? (
						<>
							<Typography tag="span" className="size-[3px] rounded-full bg-t-4" />
							<Typography tag="span">{t("dashboard.greeting.level")} {user.level}</Typography>
						</>
					) : null}
					{user?.language ? (
						<>
							<Typography tag="span" className="size-[3px] rounded-full bg-t-4" />
							<Typography tag="span">
								{user.language === "CHE"
									? t("dashboard.greeting.langChe")
									: t("dashboard.greeting.langRu")}
							</Typography>
						</>
					) : null}
				</div>
			</div>

			{stats.dueToday.total > 0 ? (
				<div className="flex shrink-0 items-center gap-[5px] rounded-base border-hairline border border-bd-2 bg-surf px-[11px] py-[5px] text-[12px] text-t-2 shadow-sm max-sm:self-start">
					<svg
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						className="size-3 text-t-3"
						aria-hidden="true"
					>
						<circle cx="8" cy="8" r="5.5" />
						<path d="M8 5v3.5l2 2" strokeLinecap="round" />
					</svg>
					{t("dashboard.greeting.dueToday", { count: stats.dueToday.total })}
				</div>
			) : null}
		</div>
	);
};
