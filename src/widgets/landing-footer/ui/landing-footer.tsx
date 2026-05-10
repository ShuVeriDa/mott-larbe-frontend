"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";

interface FooterColumn {
	titleKey: string;
	links: { labelKey: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
	{
		titleKey: "landing.footer.product",
		links: [
			{ labelKey: "landing.footer.links.features", href: "#features" },
			{ labelKey: "landing.footer.links.pricing", href: "#pricing" },
			{ labelKey: "landing.footer.links.faq", href: "#faq" },
			{ labelKey: "landing.footer.links.changelog", href: "#" },
		],
	},
	{
		titleKey: "landing.footer.company",
		links: [
			{ labelKey: "landing.footer.links.about", href: "#" },
			{ labelKey: "landing.footer.links.blog", href: "#" },
			{ labelKey: "landing.footer.links.contacts", href: "#" },
			{ labelKey: "landing.footer.links.support", href: "#" },
		],
	},
	{
		titleKey: "landing.footer.legal",
		links: [
			{ labelKey: "landing.footer.links.terms", href: "#" },
			{ labelKey: "landing.footer.links.privacy", href: "#" },
			{ labelKey: "landing.footer.links.cookies", href: "#" },
		],
	},
];

const SOCIALS = [
	{
		label: "Telegram",
		href: "#",
		path: "M21.94 4.4l-3.04 14.36c-.23 1.02-.83 1.27-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.34-4.74L18.4 6.2c.38-.34-.08-.53-.59-.19L7.07 12.7l-4.69-1.47c-1.02-.32-1.04-1.02.21-1.51L20.65 3.13c.85-.32 1.6.2 1.29 1.27z",
	},
	{
		label: "GitHub",
		href: "#",
		path: "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.87-.38.97 0 1.96.13 2.87.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.05.78 2.12v3.14c0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z",
	},
	{
		label: "X",
		href: "#",
		path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z",
	},
];

export const LandingFooter = () => {
	const { t, lang } = useI18n();

	return (
		<footer className="border-hairline border-t border-bd-1 bg-surf-2 px-7 pb-8 pt-14 max-[900px]:px-[22px] max-[640px]:px-[18px]">
			<div className="mx-auto w-full max-w-[1120px]">
				<div className="mb-9 grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 max-[900px]:grid-cols-2 max-[900px]:gap-8 max-[640px]:gap-7 max-[380px]:grid-cols-1">
					<div>
						<Link
							href={`/${lang}/dashboard`}
							className="flex w-fit max-w-full items-start gap-2.5 rounded-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-acc"
							aria-label={t("landing.brand.name")}
						>
							<BrandMark className="h-[34px] w-[28px] shrink-0" />
							<Typography tag="span" className="flex min-w-0 flex-col">
								<Typography
									tag="span"
									className="font-display text-base font-medium leading-[1.1] tracking-[-0.2px] text-t-1"
								>
									{t("landing.brand.name")}
								</Typography>
								<Typography
									tag="span"
									className="mt-px text-[9.5px] uppercase tracking-[1px] text-t-3"
								>
									{t("landing.brand.sub")}
								</Typography>
							</Typography>
						</Link>
						<Typography className="mt-3.5 max-w-[280px] text-[13px] leading-[1.55] text-t-2">
							{t("landing.footer.about")}
						</Typography>
					</div>
					{COLUMNS.map((col) => (
						<div key={col.titleKey}>
							<Typography
								tag="h3"
								className="mb-3.5 text-[11px] font-bold uppercase tracking-[1px] text-t-3"
							>
								{t(col.titleKey)}
							</Typography>
							<ul>
								{col.links.map((link) => (
									<Typography tag="li" key={link.labelKey}>
										<Link
											href={link.href}
											className="block py-1.5 text-[13.5px] text-t-2 transition-colors hover:text-t-1"
										>
											{t(link.labelKey)}
										</Link>
									</Typography>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="flex flex-wrap items-center justify-between gap-3 border-hairline border-t border-bd-1 pt-6 text-[12px] text-t-3 max-[640px]:flex-col-reverse max-[640px]:items-start max-[640px]:gap-3.5">
					<Typography tag="span">{t("landing.footer.copy")}</Typography>
					<div className="flex gap-1.5">
						{SOCIALS.map((s) => (
							<Link
								key={s.label}
								href={s.href}
								aria-label={s.label}
								className="flex h-8 w-8 items-center justify-center rounded-base border-hairline border-bd-2 bg-surf text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
							>
								<svg
									viewBox="0 0 24 24"
									width="14"
									height="14"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d={s.path} />
								</svg>
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};
