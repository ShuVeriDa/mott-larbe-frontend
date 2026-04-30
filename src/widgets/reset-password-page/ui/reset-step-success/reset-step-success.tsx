"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface ResetStepSuccessProps {
	loginHref: string;
}

const SUCCESS_ITEMS: ReadonlyArray<{ key: string; labelKey: string }> = [
	{ key: "encrypted", labelKey: "auth.resetPassword.step4.item1" },
	{ key: "sessions", labelKey: "auth.resetPassword.step4.item2" },
];

export const ResetStepSuccess = ({ loginHref }: ResetStepSuccessProps) => {
	const { t } = useI18n();

	return (
		<section aria-labelledby="reset-step-success-title">
			<div className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-grn-bg text-grn">
				<Check size={24} strokeWidth={2} />
			</div>
			<Typography
				tag="h1"
				id="reset-step-success-title"
				className="mb-2 font-display text-[26px] font-medium leading-[1.2] tracking-[-0.4px] text-t-1 max-[640px]:text-[22px]"
			>
				{t("auth.resetPassword.step4.title")}{" "}
				<Typography tag="em" className="font-normal italic text-acc">
					{t("auth.resetPassword.step4.titleEm")}
				</Typography>
			</Typography>
			<Typography className="mb-6 text-[13.5px] leading-[1.55] text-t-2">
				{t("auth.resetPassword.step4.sub")}
			</Typography>

			<ul className="mb-[22px] flex flex-col gap-2.5">
				{SUCCESS_ITEMS.map(({ key, labelKey }) => (
					<Typography
						tag="li"
						key={key}
						className="flex items-start gap-2.5 rounded-[9px] border border-bd-1 bg-surf-2 px-3 py-2.5 text-[13px] text-t-1"
					>
						<Check
							size={14}
							strokeWidth={2.2}
							className="mt-0.5 shrink-0 text-grn"
						/>
						<Typography tag="span">{t(labelKey)}</Typography>
					</Typography>
				))}
			</ul>

			<Link
				href={loginHref}
				className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[9px] bg-acc text-[13.5px] font-semibold text-white transition-opacity hover:opacity-[0.92] active:translate-y-px"
			>
				<Typography tag="span">
					{t("auth.resetPassword.step4.goLogin")}
				</Typography>
				<ArrowRight size={14} strokeWidth={2} />
			</Link>
		</section>
	);
};
