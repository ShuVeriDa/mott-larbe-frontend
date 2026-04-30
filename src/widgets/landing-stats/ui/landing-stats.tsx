"use client";

import { useI18n } from "@/shared/lib/i18n";

interface StatItem {
	prefixKey: string;
	emKey: string;
	labelKey: string;
}

const ITEMS: StatItem[] = [
	{
		prefixKey: "landing.stats.textsPrefix",
		emKey: "landing.stats.textsValue",
		labelKey: "landing.stats.texts",
	},
	{
		prefixKey: "landing.stats.wordsPrefix",
		emKey: "landing.stats.wordsValue",
		labelKey: "landing.stats.words",
	},
	{
		prefixKey: "landing.stats.levelsPrefix",
		emKey: "landing.stats.levelsValue",
		labelKey: "landing.stats.levels",
	},
	{
		prefixKey: "landing.stats.systemsPrefix",
		emKey: "landing.stats.systemsValue",
		labelKey: "landing.stats.systems",
	},
];

export const LandingStats = () => {
	const { t } = useI18n();
	return (
		<section
			className="border-hairline border-y border-bd-1 bg-surf-2 py-7"
			aria-label="Stats"
		>
			<div className="mx-auto w-full max-w-[1120px] px-7 max-[900px]:px-[22px] max-[640px]:px-[18px]">
				<div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[900px]:gap-6 max-[380px]:grid-cols-1">
					{ITEMS.map((item) => (
						<div key={item.labelKey} className="text-center">
							<div className="font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.5px] text-t-1 max-[900px]:text-[26px]">
								{t(item.prefixKey)}
								<em className="not-italic text-acc-t">
									{t(item.emKey)}
								</em>
							</div>
							<div className="mt-1.5 text-[11.5px] uppercase tracking-[0.8px] text-t-3">
								{t(item.labelKey)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
