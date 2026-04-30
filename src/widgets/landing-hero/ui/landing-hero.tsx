"use client";

import Link from "next/link";
import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { ReaderMock } from "./reader-mock";

interface LandingHeroProps {
	startHref: string;
}

export const LandingHero = ({ startHref }: LandingHeroProps) => {
	const { t } = useI18n();

	return (
		<section
			className="relative overflow-hidden px-7 pb-24 pt-[72px] max-[900px]:px-[22px] max-[900px]:pb-16 max-[900px]:pt-12 max-[640px]:px-[18px] max-[640px]:pb-14 max-[640px]:pt-9"
			aria-labelledby="hero-title"
		>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0"
				style={{
					background:
						"radial-gradient(circle at 20% 10%, rgba(34,84,211,0.12), transparent 45%), radial-gradient(circle at 85% 85%, rgba(109,78,212,0.08), transparent 50%)",
				}}
			/>

			<div className="relative z-[1] mx-auto grid w-full max-w-[1120px] grid-cols-[1.05fr_1fr] items-center gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-14">
				<div>
					<span className="mb-[22px] inline-flex items-center gap-1.5 rounded-full border-hairline border-acc/25 bg-acc-bg px-[11px] py-[5px] text-[11.5px] font-semibold text-acc-t">
						<span className="h-1.5 w-1.5 rounded-full bg-acc" />
						{t("landing.hero.eyebrow")}
					</span>

					<h1
						id="hero-title"
						className="mb-[22px] font-display text-[56px] font-semibold leading-[1.05] tracking-[-1px] text-t-1 max-[900px]:text-[44px] max-[640px]:text-[34px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.hero.titleStart")}{" "}
						<em className="not-italic font-medium text-acc-t italic">
							{t("landing.hero.titleEm")}
						</em>{" "}
						{t("landing.hero.titleEnd")}
					</h1>

					<p className="mb-8 max-w-[520px] text-[17px] leading-[1.55] text-t-2 max-[900px]:text-base max-[640px]:text-[15px]">
						{t("landing.hero.sub")}
					</p>

					<div className="flex flex-wrap gap-2.5 max-[640px]:flex-col">
						<Link
							href={startHref}
							className="inline-flex h-[46px] items-center gap-1.5 rounded-[9px] bg-acc px-[22px] text-[14.5px] font-semibold text-white shadow-[0_2px_6px_rgba(34,84,211,0.25)] transition-opacity hover:opacity-[0.92] max-[640px]:w-full max-[640px]:justify-center"
						>
							{t("landing.hero.start")}
							<ArrowRight size={14} strokeWidth={1.8} />
						</Link>
						<Link
							href="#how"
							className="inline-flex h-[46px] items-center gap-1.5 rounded-[9px] border-hairline border-bd-2 bg-transparent px-5 text-[14px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-2 max-[640px]:w-full max-[640px]:justify-center"
						>
							<PlayCircle size={14} strokeWidth={1.5} />
							{t("landing.hero.how")}
						</Link>
					</div>

					<div className="mt-[26px] flex flex-wrap items-center gap-[18px] text-[12.5px] text-t-3 max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-2">
						<span className="flex items-center gap-1.5">
							<Check size={13} strokeWidth={2} className="text-grn" />
							{t("landing.hero.meta.free")}
						</span>
						<span className="flex items-center gap-1.5">
							<Check size={13} strokeWidth={2} className="text-grn" />
							{t("landing.hero.meta.noCard")}
						</span>
						<span className="flex items-center gap-1.5">
							<Check size={13} strokeWidth={2} className="text-grn" />
							{t("landing.hero.meta.fast")}
						</span>
					</div>
				</div>

				<div className="max-[900px]:mx-auto max-[900px]:w-full max-[900px]:max-w-[540px]">
					<ReaderMock />
				</div>
			</div>
		</section>
	);
};
