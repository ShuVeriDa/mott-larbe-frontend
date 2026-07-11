"use client";

import type { UserProfile } from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { formatGreetingDate, getGreetingKey } from "../lib/greeting";
import { GREETING_LANGUAGE_I18N_KEY } from "../lib/greeting-language-i18n-key";
import { useGreetingIntro } from "../model/use-greeting-intro";

interface GreetingIntroProps {
	user: UserProfile | undefined;
	lang: string;
}

export const GreetingIntro = ({ user, lang }: GreetingIntroProps) => {
	const { t } = useI18n();
	const { chechenDate, hijriDate } = useGreetingIntro();

	const firstName = user?.name ?? user?.username ?? "";
	const greeting = t(getGreetingKey());
	const displayName = firstName ? `${greeting}, ${firstName}` : greeting;

	return (
		<div>
			<Typography
				tag="h1"
				className="mb-1 font-display text-[21px] font-normal tracking-[-0.3px] text-t-1 max-sm:text-[19px]"
			>
				{displayName}
			</Typography>
			<div className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-t-2">
				<Typography tag="span">{formatGreetingDate(lang)}</Typography>
				{user?.level ? (
					<>
						<Typography tag="span" className="size-[3px] rounded-full bg-t-4" />
						<Typography tag="span">
							{t("dashboard.greeting.level")}{" "}
							{t(`shared.cefrLevel.${user.level}`)}
						</Typography>
					</>
				) : null}
				{user?.language ? (
					<>
						<Typography tag="span" className="size-[3px] rounded-full bg-t-4" />
						<Typography tag="span">
							{t(GREETING_LANGUAGE_I18N_KEY[user.language])}
						</Typography>
					</>
				) : null}
			</div>
			{hijriDate ? (
				<Typography tag="span" className="mt-1 block text-[12.5px] text-t-2">
					{hijriDate}
				</Typography>
			) : null}
			<Typography tag="span" className="mt-0.5 block text-[12.5px] text-t-2">
				{chechenDate}
			</Typography>
		</div>
	);
};
