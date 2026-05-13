"use client";

import type { UserProfile } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { formatGreetingDate, getGreetingKey } from "../lib/greeting";

interface GreetingIntroProps {
	user: UserProfile | undefined;
	lang: string;
}

export const GreetingIntro = ({ user, lang }: GreetingIntroProps) => {
	const { t } = useI18n();

	const firstName = user?.name ?? user?.username ?? "";
	const greeting = t(getGreetingKey());
	const displayName = firstName ? `${greeting}, ${firstName}` : greeting;

	return (
		<div>
			<Typography tag="h1" className="mb-1 font-display text-[21px] font-normal tracking-[-0.3px] text-t-1 max-sm:text-[19px]">
				{displayName}
			</Typography>
			<div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-t-2">
				<Typography tag="span">{formatGreetingDate(lang)}</Typography>
				{user?.level ? (
					<>
						<Typography tag="span" className="size-[3px] rounded-full bg-t-4" />
						<Typography tag="span">{t("dashboard.greeting.level")} {t(`shared.cefrLevel.${user.level}`)}</Typography>
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
	);
};
