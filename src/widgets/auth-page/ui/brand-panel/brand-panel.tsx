"use client";

import { useI18n } from "@/shared/lib/i18n";
import { BrandMark } from "@/shared/ui/brand-mark";
import { Typography } from "@/shared/ui/typography";
import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { FeatureItem } from "./feature-item";

interface BrandPanelProps {
	homeHref: string;
	termsHref: string;
	privacyHref: string;
}

export const BrandPanel = ({
	homeHref,
	termsHref,
	privacyHref,
}: BrandPanelProps) => {
	const { t } = useI18n();

	return (
		<aside className="relative flex flex-col  overflow-hidden border-r-[0.5px] border-bd-2 bg-surf px-12 py-10 max-[900px]:border-b-[0.5px] max-[900px]:border-r-0 max-[900px]:px-8 max-[900px]:pb-9 max-[900px]:pt-7 max-[640px]:px-5 max-[640px]:pb-7 max-[640px]:pt-[22px]">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-85"
				style={{
					background:
						"radial-gradient(circle at 18% 100%, var(--acc-bg), transparent 55%), radial-gradient(circle at 95% 8%, var(--acc-bg), transparent 50%)",
				}}
			/>

			<div className="relative z-1 mb-20 flex items-center justify-between max-[900px]:mb-7 max-[640px]:mb-[22px] max-[380px]:flex-col max-[380px]:items-start max-[380px]:gap-3.5">
				<Link
					href={homeHref}
					className="inline-flex items-center gap-2.5"
					aria-label={t("auth.brand.name")}
				>
					<BrandMark className="h-9 w-[30px] shrink-0" />
					<Typography tag="span" className="flex flex-col gap-0 leading-none">
						<Typography
							tag="span"
							className="font-display text-[18px] font-medium tracking-[-0.3px] text-t-1"
						>
							{t("auth.brand.name")}
						</Typography>
						<Typography
							tag="span"
							className="mt-0.5 text-[9px] font-medium uppercase tracking-[1px] text-t-3 opacity-70"
						>
							{t("auth.brand.tagline")}
						</Typography>
					</Typography>
				</Link>
			</div>

			<div className="relative z-1 flex max-w-[460px] flex-1 flex-col justify-center max-[900px]:max-w-none">
				<Typography
					tag="span"
					className="mb-3.5 inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[1.2px] text-acc-t max-[640px]:mb-2.5 max-[640px]:text-[10px]"
				>
					<span className="block h-px w-[18px] bg-acc opacity-55" />
					{t("auth.brand.eyebrow")}
				</Typography>

				<Typography
					tag="h1"
					className="mb-4 font-display text-[42px] font-medium leading-[1.1] tracking-[-0.8px] text-t-1 max-[900px]:text-[30px] max-[640px]:mb-2.5 max-[640px]:text-[24px] max-[640px]:tracking-[-0.5px]"
				>
					{t("auth.brand.titleStart")}{" "}
					<Typography tag="em" className="font-normal italic text-acc">
						{t("auth.brand.titleEm")}
					</Typography>
				</Typography>

				<Typography className="mb-9 max-w-[420px] text-[14px] leading-[1.55] text-t-2 max-[900px]:mb-5 max-[900px]:text-[13.5px] max-[640px]:mb-[18px] max-[640px]:text-[13px]">
					{t("auth.brand.subtitle")}
				</Typography>

				<ul className="flex flex-col gap-3.5 max-[900px]:flex-row max-[900px]:flex-wrap max-[900px]:gap-2.5 max-[640px]:gap-2">
					<FeatureItem
						icon={BookOpen}
						title={t("auth.brand.features.click.title")}
						description={t("auth.brand.features.click.desc")}
					/>
					<FeatureItem
						icon={CheckCircle2}
						title={t("auth.brand.features.srs.title")}
						description={t("auth.brand.features.srs.desc")}
					/>
					<FeatureItem
						icon={GraduationCap}
						title={t("auth.brand.features.levels.title")}
						description={t("auth.brand.features.levels.desc")}
					/>
				</ul>
			</div>

			<footer className="relative z-1 mt-10 flex items-center gap-3.5 text-[11.5px] text-t-3 max-[900px]:mt-6 max-[640px]:mt-5 max-[640px]:flex-wrap max-[640px]:gap-2 max-[640px]:text-[11px]">
				<Typography tag="span">{t("auth.brand.copyright")}</Typography>
				<span className="size-[3px] rounded-full bg-t-4" />
				<Link
					href={termsHref}
					className="text-t-2 transition-colors hover:text-t-1"
				>
					{t("auth.brand.terms")}
				</Link>
				<span className="size-[3px] rounded-full bg-t-4" />
				<Link
					href={privacyHref}
					className="text-t-2 transition-colors hover:text-t-1"
				>
					{t("auth.brand.privacy")}
				</Link>
			</footer>
		</aside>
	);
};
