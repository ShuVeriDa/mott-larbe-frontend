"use client";

import { Button } from "@/shared/ui/button";

import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface ResetStepExpiredProps {
	loginHref: string;
	onRequestReset: () => void;
}

export const ResetStepExpired = ({
	loginHref,
	onRequestReset,
}: ResetStepExpiredProps) => {
	const { t } = useI18n();

	return (
		<section aria-labelledby="reset-step-expired-title">
			<div className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-red-bg text-red">
				<AlertCircle size={24} strokeWidth={1.7} />
			</div>
			<Typography
				tag="h1"
				id="reset-step-expired-title"
				className="mb-2 font-display text-[26px] font-medium leading-[1.2] tracking-[-0.4px] text-t-1 max-[640px]:text-[22px]"
			>
				{t("auth.resetPassword.expired.title")}{" "}
				<Typography tag="em" className="font-normal italic text-red">
					{t("auth.resetPassword.expired.titleEm")}
				</Typography>
			</Typography>
			<Typography className="mb-6 text-[13.5px] leading-[1.55] text-t-2">
				{t("auth.resetPassword.expired.sub")}
			</Typography>

			<Button
				onClick={onRequestReset}
				className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[9px] bg-acc text-[13.5px] font-semibold text-white transition-opacity hover:opacity-[0.92] active:translate-y-px"
			>
				<RefreshCw size={14} strokeWidth={2} />
				<Typography tag="span">
					{t("auth.resetPassword.expired.request")}
				</Typography>
			</Button>

			<Link
				href={loginHref}
				className="mt-[18px] inline-flex items-center gap-1.5 text-[12.5px] font-medium text-t-2 transition-colors hover:text-t-1"
			>
				<ArrowLeft size={12} strokeWidth={2} />
				<Typography tag="span">
					{t("auth.resetPassword.expired.backToLogin")}
				</Typography>
			</Link>
		</section>
	);
};
