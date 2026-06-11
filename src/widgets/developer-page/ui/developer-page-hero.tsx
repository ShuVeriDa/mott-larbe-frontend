"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

export const DeveloperPageHero = () => {
	const { t, lang } = useI18n();

	return (
		<section className="pb-16 pt-24 max-[640px]:pb-12 max-[640px]:pt-16">
			<div className="mx-auto w-full max-w-[760px] px-7 max-[640px]:px-[18px]">
				<Typography
					tag="span"
					className="mb-4 block text-[11px] font-bold uppercase tracking-[1.2px] text-acc"
				>
					{t("landing.aboutPage.eyebrow")}
				</Typography>

				<Typography
					tag="h1"
					className="font-display text-[44px] font-semibold leading-[1.1] tracking-[-1.5px] text-t-1 max-[640px]:text-[32px]"
				>
					{t("landing.aboutPage.title")}{" "}
					<em className="not-italic text-acc">
						{t("landing.aboutPage.titleEm")}
					</em>
				</Typography>

				<Typography className="mt-5 max-w-[560px] text-[17px] leading-[1.65] text-t-2 max-[640px]:text-[15px]">
					{t("landing.aboutPage.sub")}
				</Typography>

				<div className="mt-8">
					<Link
						href="https://t.me/shuverida"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2.5 rounded-base bg-acc px-6 py-3 text-[14px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-2"
					>
						<svg
							viewBox="0 0 24 24"
							width="16"
							height="16"
							fill="currentColor"
							aria-hidden="true"
						>
							<path d="M21.94 4.4l-3.04 14.36c-.23 1.02-.83 1.27-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.34-4.74L18.4 6.2c.38-.34-.08-.53-.59-.19L7.07 12.7l-4.69-1.47c-1.02-.32-1.04-1.02.21-1.51L20.65 3.13c.85-.32 1.6.2 1.29 1.27z" />
						</svg>
						{t("landing.aboutPage.cta.button")}
					</Link>
				</div>

				<div className="mt-6">
					<Link
						href={`/${lang}`}
						className="text-[13px] text-t-3 transition-colors hover:text-t-1"
					>
						← {t("landing.aboutPage.backToHome")}
					</Link>
				</div>
			</div>
		</section>
	);
};
