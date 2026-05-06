"use client";

import { QuoteIcon } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface TestimonialItem {
	text: string;
	name: string;
	role: string;
	level: string;
}

export const LandingTestimonials = () => {
	const { t, dict } = useI18n();

	const items =
		(
			dict as unknown as {
				landing?: { testimonials?: { items?: TestimonialItem[] } };
			}
		).landing?.testimonials?.items ?? [];

	return (
		<section
			className="border-hairline border-y border-bd-1 bg-surf-2 px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="testimonials-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 text-center max-[640px]:mb-9">
					<Typography
						tag="span"
						className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t"
					>
						{t("landing.testimonials.eyebrow")}
					</Typography>
					<Typography
						tag="h2"
						id="testimonials-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.testimonials.title")}
					</Typography>
					<Typography className="mx-auto mt-3.5 max-w-[540px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.testimonials.sub")}
					</Typography>
				</header>

				<div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1 max-[900px]:gap-4">
					{items.map((item, idx) => (
						<article
							key={idx}
							className="flex flex-col rounded-[14px] border-hairline border-bd-2 bg-surf p-6"
						>
							<QuoteIcon
								size={20}
								strokeWidth={1.5}
								className="mb-4 shrink-0 text-acc-t opacity-50"
							/>
							<Typography className="flex-1 text-[14.5px] leading-[1.6] text-t-1">
								{item.text}
							</Typography>
							<div className="mt-5 flex items-center justify-between">
								<div>
									<div className="text-[13.5px] font-semibold text-t-1">
										{item.name}
									</div>
									<div className="text-[12.5px] text-t-3">{item.role}</div>
								</div>
								<span className="rounded-full bg-acc-bg px-2.5 py-0.5 text-[11.5px] font-semibold text-acc-t">
									{item.level}
								</span>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
};
