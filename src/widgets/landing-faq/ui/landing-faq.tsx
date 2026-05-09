"use client";

import { ComponentProps } from 'react';
import { FaqItem, useFaq } from "@/features/landing-faq";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface FaqDictItem {
	q: string;
	a: string;
}

export const LandingFaq = () => {
	const { t, dict } = useI18n();
	const { openIndex, toggle } = useFaq(0);

	const items =
		(
			dict as unknown as {
				landing?: { faq?: { items?: FaqDictItem[] } };
			}
		).landing?.faq?.items ?? [];

	return (
		<section
			id="faq"
			className="px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="faq-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 text-center max-[640px]:mb-9">
					<Typography
						tag="span"
						className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t"
					>
						{t("landing.faq.eyebrow")}
					</Typography>
					<Typography
						tag="h2"
						id="faq-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.faq.title")}
					</Typography>
				</header>

				<div className="mx-auto max-w-[760px]">
					{items.map((item, idx) => {
					  const handleToggle: NonNullable<ComponentProps<typeof FaqItem>["onToggle"]> = () => toggle(idx);
					  return (
						<FaqItem
							key={`faq-${idx}`}
							id={`faq-${idx}`}
							question={item.q}
							answer={item.a}
							open={openIndex === idx}
							onToggle={handleToggle}
						/>
					);
					})}
				</div>
			</div>
		</section>
	);
};
