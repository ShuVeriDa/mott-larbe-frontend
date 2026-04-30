"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";

interface LandingCtaProps {
	startHref: string;
	loginHref: string;
}

export const LandingCta = ({ startHref, loginHref }: LandingCtaProps) => {
	const { t } = useI18n();

	return (
		<section
			className="px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="cta-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<div className="relative overflow-hidden rounded-[18px] border-hairline border-bd-2 bg-surf px-12 py-16 text-center max-[640px]:rounded-[14px] max-[640px]:px-[22px] max-[640px]:py-9">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-0 z-0"
						style={{
							background:
								"radial-gradient(circle at 15% 20%, rgba(34,84,211,0.12), transparent 40%), radial-gradient(circle at 85% 80%, rgba(109,78,212,0.1), transparent 45%)",
						}}
					/>
					<div className="relative z-[1]">
						<h2
							id="cta-title"
							className="mb-3.5 font-display text-[42px] font-semibold leading-[1.15] tracking-[-0.8px] text-t-1 max-[900px]:text-[34px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
						>
							{t("landing.cta.titleStart")}{" "}
							<em className="font-medium text-acc-t italic">
								{t("landing.cta.titleEm")}
							</em>
						</h2>
						<p className="mx-auto mb-7 max-w-[540px] text-base text-t-2 max-[640px]:text-[14.5px]">
							{t("landing.cta.sub")}
						</p>
						<div className="flex flex-wrap justify-center gap-2.5 max-[640px]:flex-col">
							<Link
								href={startHref}
								className="inline-flex h-12 items-center justify-center gap-1.5 rounded-[10px] bg-acc px-6 text-[14.5px] font-semibold text-white shadow-[0_2px_6px_rgba(34,84,211,0.25)] transition-opacity hover:opacity-[0.92] max-[640px]:w-full"
							>
								{t("landing.cta.primary")}
								<ArrowRight size={14} strokeWidth={1.8} />
							</Link>
							<Link
								href={loginHref}
								className="inline-flex h-12 items-center justify-center gap-1.5 rounded-[10px] border-hairline border-bd-2 bg-transparent px-[22px] text-[14px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-2 max-[640px]:w-full"
							>
								{t("landing.cta.secondary")}
							</Link>
						</div>
						<p className="mt-[22px] text-[12px] text-t-3">
							{t("landing.cta.foot")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};
