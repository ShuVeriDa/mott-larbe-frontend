"use client";

import { AlertCircle, Check, Shield } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import {
	allRequirementsMet,
	checkPasswordRequirements,
	scorePassword,
	type ResetErrorReason,
} from "@/features/reset-password";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { PasswordField } from "./password-field";
import { PasswordRequirementsList } from "./password-requirements-list";
import { PasswordStrengthBar } from "./password-strength-bar";

interface ResetStepNewPasswordProps {
	isPending: boolean;
	error: ResetErrorReason | null;
	onSubmit: (password: string) => void | Promise<void>;
}

const ERROR_KEY_MAP: Record<ResetErrorReason, string> = {
	weak_password: "auth.resetPassword.step3.errors.weakPassword",
	token_invalid: "auth.resetPassword.step3.errors.tokenInvalid",
	token_expired: "auth.resetPassword.step3.errors.tokenExpired",
	token_used: "auth.resetPassword.step3.errors.tokenUsed",
	account_unavailable: "auth.resetPassword.step3.errors.accountUnavailable",
	generic: "auth.resetPassword.step3.errors.generic",
};

export const ResetStepNewPassword = ({
	isPending,
	error,
	onSubmit,
}: ResetStepNewPasswordProps) => {
	const { t } = useI18n();
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");

	const requirements = useMemo(
		() => checkPasswordRequirements(password),
		[password],
	);
	const score = useMemo(() => scorePassword(password), [password]);
	const reqsMet = allRequirementsMet(requirements);
	const matches = password.length > 0 && password === confirm;
	const showMismatch = confirm.length > 0 && password !== confirm;
	const canSubmit = reqsMet && matches && !isPending;

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!canSubmit) return;
		void onSubmit(password);
	};

	const apiErrorMessage = error ? t(ERROR_KEY_MAP[error]) : null;

	return (
		<section aria-labelledby="reset-step-new-password-title">
			<div className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-acc-bg text-acc">
				<Shield size={24} strokeWidth={1.7} />
			</div>
			<Typography
				tag="h1"
				id="reset-step-new-password-title"
				className="mb-2 font-display text-[26px] font-medium leading-[1.2] tracking-[-0.4px] text-t-1 max-[640px]:text-[22px]"
			>
				{t("auth.resetPassword.step3.title")}{" "}
				<Typography tag="em" className="font-normal italic text-acc">
					{t("auth.resetPassword.step3.titleEm")}
				</Typography>
			</Typography>
			<Typography className="mb-6 text-[13.5px] leading-[1.55] text-t-2">
				{t("auth.resetPassword.step3.sub")}
			</Typography>

			<form onSubmit={handleSubmit} noValidate>
				<div className="mb-[14px]">
					<PasswordField
						id="reset-new-password"
						label={t("auth.resetPassword.step3.newLabel")}
						value={password}
						onChange={setPassword}
					/>
					<PasswordStrengthBar score={score} visible={password.length > 0} />
					<PasswordRequirementsList requirements={requirements} />
				</div>

				<div className="mb-[14px]">
					<PasswordField
						id="reset-confirm-password"
						label={t("auth.resetPassword.step3.confirmLabel")}
						value={confirm}
						onChange={setConfirm}
						hasError={showMismatch}
					/>
					{showMismatch && (
						<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
							<AlertCircle size={12} strokeWidth={2} />
							<Typography tag="span">
								{t("auth.resetPassword.step3.errors.mismatch")}
							</Typography>
						</Typography>
					)}
				</div>

				{apiErrorMessage && (
					<Typography
						role="alert"
						className="mb-3 flex items-center gap-1.5 text-[12px] text-red"
					>
						<AlertCircle size={12} strokeWidth={2} />
						<Typography tag="span">{apiErrorMessage}</Typography>
					</Typography>
				)}

				<button
					type="submit"
					disabled={!canSubmit}
					className="mt-1.5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[9px] bg-acc text-[13.5px] font-semibold text-white transition-opacity hover:opacity-[0.92] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
				>
					<Typography tag="span">
						{isPending
							? t("auth.resetPassword.step3.submitting")
							: t("auth.resetPassword.step3.submit")}
					</Typography>
					<Check size={14} strokeWidth={2} />
				</button>
			</form>
		</section>
	);
};
