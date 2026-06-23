"use client";

import { useUpdatePreferences, type UpdatePreferencesDto } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/locale-list";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { variants, spring } from "@/shared/lib/animation";

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
		<motion.div
			className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center"
			variants={variants.staggerContainer}
			initial="hidden"
			animate="visible"
		>
			<motion.div
				className="flex size-14 items-center justify-center rounded-full bg-surf-2"
				initial={{ scale: 0.6, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={spring.bouncy}
			>
				<Info className="size-7 text-t-3" aria-hidden="true" />
			</motion.div>

			<motion.div className="flex flex-col gap-1.5" variants={variants.staggerItem}>
				<Typography tag="h2" className="text-[15px] font-semibold text-t-1">
					{t("review.disabled.title")}
				</Typography>
				<Typography className="max-w-[340px] text-[13px] text-t-2">
					{t("review.disabled.subtitle", { setting: settingLabel })}
				</Typography>
			</motion.div>

			<motion.div className="flex flex-col items-center gap-2.5" variants={variants.staggerItem}>
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
			</motion.div>
		</motion.div>
	);
};
