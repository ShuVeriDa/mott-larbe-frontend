"use client";

import {
	BookmarkIcon,
	CompassIcon,
	LayoutGridIcon,
	LineChartIcon,
	RotateCcwIcon,
	ScrollTextIcon,
} from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { FeatureCard, type FeatureIconColor } from "./feature-card";

interface FeatureDef {
	key: string;
	icon: React.ReactNode;
	color: FeatureIconColor;
}

const FEATURES: FeatureDef[] = [
	{
		key: "click",
		icon: <BookmarkIcon size={19} strokeWidth={1.6} />,
		color: "acc",
	},
	{
		key: "morphology",
		icon: <CompassIcon size={19} strokeWidth={1.6} />,
		color: "pur",
	},
	{
		key: "dictionary",
		icon: <LayoutGridIcon size={19} strokeWidth={1.6} />,
		color: "grn",
	},
	{
		key: "srs",
		icon: <RotateCcwIcon size={19} strokeWidth={1.6} />,
		color: "amb",
	},
	{
		key: "texts",
		icon: <ScrollTextIcon size={19} strokeWidth={1.6} />,
		color: "red",
	},
	{
		key: "progress",
		icon: <LineChartIcon size={19} strokeWidth={1.6} />,
		color: "neutral",
	},
];

export const LandingFeatures = () => {
	const { t } = useI18n();

	return (
		<section
			id="features"
			className="px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="features-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 max-[640px]:mb-9">
					<Typography
						tag="span"
						className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t"
					>
						{t("landing.features.eyebrow")}
					</Typography>
					<Typography
						tag="h2"
						id="features-title"
						className="max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.features.title")}
					</Typography>
					<Typography className="mt-3.5 max-w-[620px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.features.sub")}
					</Typography>
				</header>

				<div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3">
					{FEATURES.map((feature) => (
						<FeatureCard
							key={feature.key}
							title={t(`landing.features.items.${feature.key}.title`)}
							description={t(`landing.features.items.${feature.key}.desc`)}
							icon={feature.icon}
							iconColor={feature.color}
						/>
					))}
				</div>
			</div>
		</section>
	);
};
