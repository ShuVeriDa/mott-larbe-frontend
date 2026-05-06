"use client";

import { Loader } from "lucide-react";
import { useResetFlow } from "@/features/reset-password";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { AuthTopbar } from "./auth-topbar";
import { ResetStepEmailSent } from "./reset-step-email-sent";
import { ResetStepExpired } from "./reset-step-expired";
import { ResetStepIndicator } from "./reset-step-indicator";
import { ResetStepNewPassword } from "./reset-step-new-password";
import { ResetStepRequest } from "./reset-step-request";
import { ResetStepSuccess } from "./reset-step-success";

export const ResetPasswordPage = () => {
	const { t, lang } = useI18n();
	const flow = useResetFlow();
	const loginHref = `/${lang}/auth`;

	const isValidatingToken =
		flow.step === 3 && Boolean(flow.tokenFromUrl) && flow.tokenValidation.isLoading;

	return (
		<div className="relative flex min-h-dvh flex-col bg-panel">
			<div
				aria-hidden="true"
				className="pointer-events-none fixed inset-0 z-0"
				style={{
					background:
						"radial-gradient(circle at 12% 88%, rgba(34,84,211,0.12), transparent 45%), radial-gradient(circle at 88% 12%, rgba(34,84,211,0.12), transparent 40%)",
				}}
			/>

			<AuthTopbar loginHref={loginHref} />

			<main className="relative z-1 flex flex-1 items-center justify-center px-6 py-10 max-[640px]:px-4 max-[640px]:py-6">
				<div className="w-full max-w-[460px] rounded-[16px] border border-bd-2 bg-surf p-9 shadow-lg max-[640px]:rounded-[14px] max-[640px]:p-[22px]">
					{flow.isExpired ? (
						<ResetStepExpired
							loginHref={loginHref}
							onRequestReset={flow.goRequestReset}
						/>
					) : (
						<>
							<ResetStepIndicator step={flow.step} />

							{flow.step === 1 && (
								<ResetStepRequest
									loginHref={loginHref}
									isPending={flow.requestState.isPending}
									error={flow.requestState.error}
									onSubmit={flow.submitEmail}
								/>
							)}

							{flow.step === 2 && (
								<ResetStepEmailSent
									email={flow.email}
									resendSecondsLeft={flow.resendTimer.secondsLeft}
									resendActive={flow.resendTimer.isActive}
									resendPending={flow.requestState.isPending}
									onResend={flow.resend}
									onChangeEmail={flow.changeEmail}
								/>
							)}

							{flow.step === 3 &&
								(isValidatingToken ? (
									<div className="flex flex-col items-center justify-center gap-3 py-10 text-t-2">
										<Loader
											size={20}
											strokeWidth={1.8}
											className="animate-spin text-acc"
										/>
										<Typography tag="span" className="text-[13px]">
											{t("auth.resetPassword.validating")}
										</Typography>
									</div>
								) : (
									<ResetStepNewPassword
										isPending={flow.confirmState.isPending}
										error={flow.confirmState.error}
										expiresAt={flow.expiresAt}
										onExpire={flow.goExpired}
										onSubmit={flow.submitNewPassword}
									/>
								))}

							{flow.step === 4 && <ResetStepSuccess loginHref={loginHref} />}
						</>
					)}
				</div>
			</main>
		</div>
	);
};
