"use client";

import { ArrowLeft, Clock, ExternalLink, Mail } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface ResetStepEmailSentProps {
	email: string;
	resendSecondsLeft: number;
	resendActive: boolean;
	resendPending: boolean;
	onResend: () => void | Promise<void>;
	onChangeEmail: () => void;
}

export const ResetStepEmailSent = ({
	email,
	resendSecondsLeft,
	resendActive,
	resendPending,
	onResend,
	onChangeEmail,
}: ResetStepEmailSentProps) => {
	const { t } = useI18n();

	return (
		<section aria-labelledby="reset-step-email-sent-title">
			<div className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-acc-bg text-acc">
				<Mail size={24} strokeWidth={1.7} />
			</div>
			<Typography
				tag="h1"
				id="reset-step-email-sent-title"
				className="mb-2 font-display text-[26px] font-medium leading-[1.2] tracking-[-0.4px] text-t-1 max-[640px]:text-[22px]"
			>
				{t("auth.resetPassword.step2.title")}{" "}
				<Typography tag="em" className="font-normal italic text-acc">
					{t("auth.resetPassword.step2.titleEm")}
				</Typography>
			</Typography>
			<Typography className="mb-6 text-[13.5px] leading-[1.55] text-t-2">
				{t("auth.resetPassword.step2.sub1")}{" "}
				<Typography tag="strong" className="font-semibold text-t-1">
					{email}
				</Typography>
				. {t("auth.resetPassword.step2.sub2")}
			</Typography>

			<div className="mb-[22px] flex items-center gap-2.5 rounded-[9px] border border-bd-2 bg-surf-2 px-[14px] py-[11px] text-[13px] text-t-1">
				<Clock size={14} strokeWidth={1.8} className="shrink-0 text-t-3" />
				<Typography tag="span">
					{t("auth.resetPassword.step2.valid")}
				</Typography>
			</div>

			<a
				href="mailto:"
				className="inline-flex h-[42px] w-full items-center justify-center gap-1.5 rounded-[9px] border border-bd-2 bg-surf text-[13px] font-medium text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-2"
			>
				<ExternalLink size={14} strokeWidth={2} />
				<Typography tag="span">
					{t("auth.resetPassword.step2.openMail")}
				</Typography>
			</a>

			<div className="mt-1 flex items-center justify-center gap-1.5 pt-3 text-[12.5px] text-t-3">
				<Typography tag="span">
					{t("auth.resetPassword.step2.notReceived")}
				</Typography>
				<button
					type="button"
					onClick={() => void onResend()}
					disabled={resendActive || resendPending}
					className="bg-transparent font-semibold text-acc-t transition-opacity hover:underline disabled:cursor-not-allowed disabled:font-medium disabled:text-t-3 disabled:no-underline"
				>
					{resendActive
						? t("auth.resetPassword.step2.resendIn", {
								seconds: resendSecondsLeft,
							})
						: t("auth.resetPassword.step2.resend")}
				</button>
			</div>

			<button
				type="button"
				onClick={onChangeEmail}
				className="mt-[18px] inline-flex items-center gap-1.5 bg-transparent text-[12.5px] font-medium text-t-2 transition-colors hover:text-t-1"
			>
				<ArrowLeft size={12} strokeWidth={2} />
				<Typography tag="span">
					{t("auth.resetPassword.step2.changeEmail")}
				</Typography>
			</button>
		</section>
	);
};
