"use client";

import { useUpdatePreferences, type UpdatePreferencesDto } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/locale-list";

export interface ReviewDisabledScreenProps {
	settingLabel: string;
	enableKey: keyof UpdatePreferencesDto;
}

export const ReviewDisabledScreen = ({ settingLabel, enableKey }: ReviewDisabledScreenProps) => {
	const { t } = useI18n();
	const params = useParams<{ lang: string }>();
	const lang = params.lang ?? DEFAULT_LOCALE;
	const { mutate: updatePrefs, isPending } = useUpdatePreferences();

	const handleEnable = () => {
		updatePrefs({ [enableKey]: true } as UpdatePreferencesDto);
	};

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
			<div className="flex size-14 items-center justify-center rounded-full bg-surf-2">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					className="size-7 text-t-3"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
					<path
						d="M12 8v4M12 16h.01"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			</div>

			<div className="flex flex-col gap-1.5">
				<Typography tag="h2" className="text-[15px] font-semibold text-t-1">
					{t("review.disabled.title")}
				</Typography>
				<Typography className="max-w-[340px] text-[13px] text-t-2">
					{t("review.disabled.subtitle", { setting: settingLabel })}
				</Typography>
			</div>

			<div className="flex flex-col items-center gap-2.5">
				<Button
					variant="action"
					disabled={isPending}
					onClick={handleEnable}
				>
					{t("review.disabled.enableButton", { setting: settingLabel })}
				</Button>
				<Button asChild variant="ghost">
					<Link href={`/${lang}/settings?tab=learning`}>
						{t("review.disabled.goToSettings")}
					</Link>
				</Button>
			</div>
		</div>
	);
};
