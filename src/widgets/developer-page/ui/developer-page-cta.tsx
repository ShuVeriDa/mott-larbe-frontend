"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

export const DeveloperPageCta = () => {
	const { t } = useI18n();

	return (
		<section className="border-t border-[0.5px] border-bd-1 py-16 max-[640px]:py-12">
			<div className="mx-auto w-full max-w-[760px] px-7 max-[640px]:px-[18px]">
				<div className="rounded-2xl bg-surf-2 p-8 text-center max-[640px]:p-6">
					<Typography
						tag="h2"
						className="font-display text-[28px] font-semibold leading-[1.2] tracking-[-0.5px] text-t-1 max-[640px]:text-[22px]"
					>
						{t("landing.aboutPage.cta.title")}
					</Typography>
					<Typography className="mt-3 text-[15px] leading-[1.6] text-t-2">
						{t("landing.aboutPage.cta.sub")}
					</Typography>
					<Link
						href="https://t.me/shuverida"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 inline-flex items-center gap-2.5 rounded-base bg-acc px-7 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-2"
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
			</div>
		</section>
	);
};
