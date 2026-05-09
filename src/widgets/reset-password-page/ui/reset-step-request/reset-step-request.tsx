"use client";

import { AlertCircle, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useState, type SyntheticEvent } from "react";
import { isValidEmail } from "@/features/reset-password";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface ResetStepRequestProps {
	loginHref: string;
	isPending: boolean;
	error: string | null;
	onSubmit: (email: string) => void | Promise<void>;
}

export const ResetStepRequest = ({
	loginHref,
	isPending,
	error,
	onSubmit,
}: ResetStepRequestProps) => {
	const { t } = useI18n();
	const [email, setEmail] = useState("");
	const [localError, setLocalError] = useState<string | null>(null);

	const handleSubmit = (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		setLocalError(null);
		if (!isValidEmail(email)) {
			setLocalError(t("auth.resetPassword.step1.errors.invalidEmail"));
			return;
		}
		void onSubmit(email);
	};

	const errorMessage =
		localError ??
		(error ? t("auth.resetPassword.step1.errors.generic") : null);

		const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => {
							setEmail(e.target.value);
							if (localError) setLocalError(null);
						};
return (
		<section aria-labelledby="reset-step-request-title">
			<div className="mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-[13px] bg-acc-bg text-acc">
				<Lock size={24} strokeWidth={1.7} />
			</div>
			<Typography
				tag="h1"
				id="reset-step-request-title"
				className="mb-2 font-display text-[26px] font-medium leading-[1.2] tracking-[-0.4px] text-t-1 max-[640px]:text-[22px]"
			>
				{t("auth.resetPassword.step1.title")}{" "}
				<Typography tag="em" className="font-normal italic text-acc">
					{t("auth.resetPassword.step1.titleEm")}
				</Typography>
			</Typography>
			<Typography className="mb-6 text-[13.5px] leading-[1.55] text-t-2">
				{t("auth.resetPassword.step1.sub")}
			</Typography>

			<form onSubmit={handleSubmit} noValidate>
				<div className="mb-[14px]">
					<Typography
						tag="label"
						htmlFor="reset-email"
						className="mb-1.5 block text-[11.5px] font-medium text-t-2"
					>
						{t("auth.resetPassword.step1.emailLabel")}
					</Typography>
					<input
						id="reset-email"
						type="email"
						name="email"
						autoComplete="email"
						required
						value={email}
						onChange={handleChange}
						placeholder={t("auth.resetPassword.step1.emailPlaceholder")}
						aria-invalid={Boolean(errorMessage)}
						aria-describedby={errorMessage ? "reset-email-error" : undefined}
						className={cn(
							"h-[42px] w-full rounded-[9px] border border-bd-2 bg-panel px-[14px] text-[14px] text-t-1 outline-none transition-colors",
							"placeholder:text-t-3 hover:border-bd-3 focus:border-acc",
							errorMessage && "border-red focus:border-red",
						)}
					/>
					{errorMessage && (
						<Typography
							id="reset-email-error"
							className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red"
						>
							<AlertCircle size={12} strokeWidth={2} />
							<Typography tag="span">{errorMessage}</Typography>
						</Typography>
					)}
				</div>

				<button
					type="submit"
					disabled={isPending}
					className="mt-1.5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[9px] bg-acc text-[13.5px] font-semibold text-white transition-opacity hover:opacity-[0.92] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55"
				>
					<Typography tag="span">
						{isPending
							? t("auth.resetPassword.step1.submitting")
							: t("auth.resetPassword.step1.submit")}
					</Typography>
					<ArrowRight size={14} strokeWidth={2} />
				</button>
			</form>

			<Link
				href={loginHref}
				className="mt-[18px] inline-flex items-center gap-1.5 text-[12.5px] font-medium text-t-2 transition-colors hover:text-t-1"
			>
				<ArrowLeft size={12} strokeWidth={2} />
				<Typography tag="span">
					{t("auth.resetPassword.step1.backToLogin")}
				</Typography>
			</Link>
		</section>
	);
};
