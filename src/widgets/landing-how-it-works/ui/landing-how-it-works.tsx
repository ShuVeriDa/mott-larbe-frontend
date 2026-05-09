"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

const STEPS = ["choose", "read", "review"] as const;

export const LandingHowItWorks = () => {
	const { t } = useI18n();

	return (
		<section
			id="how"
			className="border-hairline border-y border-bd-1 bg-surf-2 px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="how-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 text-center max-[640px]:mb-9">
					<Typography
						tag="span"
						className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t"
					>
						{t("landing.how.eyebrow")}
					</Typography>
					<Typography
						tag="h2"
						id="how-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.how.title")}
					</Typography>
					<Typography className="mx-auto mt-3.5 max-w-[620px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.how.sub")}
					</Typography>
				</header>

				<ol className="relative grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-8">
					<Typography tag="span"
						aria-hidden="true"
						className="pointer-events-none absolute left-[12%] right-[12%] top-7 h-px max-[900px]:hidden"
						style={{
							background:
								"linear-gradient(90deg, transparent, var(--bd-2) 15%, var(--bd-2) 85%, transparent)",
						}}
					/>
					{STEPS.map((step, idx) => (
						<Typography
							tag="li"
							key={step}
							className="relative z-[1] px-3 text-center max-[900px]:px-0"
						>
							<div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full border-hairline border-bd-2 bg-surf font-display text-[22px] font-semibold text-acc-t shadow-sm">
								{idx + 1}
							</div>
							<Typography
								tag="h3"
								className="mb-2 font-display text-[19px] font-semibold text-t-1"
							>
								{t(`landing.how.steps.${step}.title`)}
							</Typography>
							<Typography className="mx-auto max-w-[280px] text-[13.5px] leading-[1.55] text-t-2">
								{t(`landing.how.steps.${step}.desc`)}
							</Typography>
						</Typography>
					))}
				</ol>
			</div>
		</section>
	);
};
