"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLoginForm } from "../../model";

interface LoginFormProps {
	forgotHref: string;
	successHref: string;
}

export const LoginForm = ({ forgotHref, successHref }: LoginFormProps) => {
	const {
		t,
		isPending,
		error,
		email,
		password,
		remember,
		showPw,
		errors,
		handleSubmit,
		handleEmailChange,
		handlePasswordChange,
		handleTogglePasswordVisibility,
		handleRememberChange,
	} = useLoginForm({ successHref });

	return (
		<form action={handleSubmit} noValidate autoComplete="on">
			{error ? (
				<div
					role="alert"
					className="mb-4 flex items-start gap-2.5 rounded-[8px] border-[0.5px] border-amb/25 bg-amb-bg px-3 py-2.5 text-[12px] text-amb-t"
				>
					<AlertCircle size={14} className="mt-px shrink-0" strokeWidth={2} />
					<Typography tag="span">{t("auth.errors.loginFailed")}</Typography>
				</div>
			) : null}

			<div className="mb-3.5">
				<div className="mb-1.5 flex items-center justify-between text-[11.5px] font-medium text-t-2">
					<Typography tag="label" htmlFor="login-email">
						{t("auth.fields.loginIdentifier")}
					</Typography>
				</div>
				<Input
					id="login-email"
					type="text"
					inputMode="email"
					autoComplete="email"
					required
					placeholder={t("auth.placeholders.loginIdentifier")}
					value={email}
					onChange={handleEmailChange}
					className={cn(
						"h-[42px] rounded-[9px] border-[0.5px] bg-surf px-3.5 text-[14px] hover:border-bd-3 max-[640px]:h-11 max-[640px]:text-[16px]",
						errors.email && "border-red",
					)}
					aria-invalid={Boolean(errors.email)}
					aria-describedby={errors.email ? "login-email-error" : undefined}
				/>
				{errors.email ? (
					<Typography id="login-email-error" className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
						<AlertCircle size={12} strokeWidth={2} />
						<Typography tag="span">{errors.email}</Typography>
					</Typography>
				) : null}
			</div>

			<div className="mb-3.5">
				<div className="mb-1.5 flex items-center justify-between text-[11.5px] font-medium text-t-2">
					<Typography tag="label" htmlFor="login-password">
						{t("auth.fields.password")}
					</Typography>
					<Link
						href={forgotHref}
						className="text-[12.5px] font-medium text-acc-t transition-colors hover:text-acc hover:underline"
					>
						{t("auth.fields.forgot")}
					</Link>
				</div>
				<div className="relative flex items-center">
					<Input
						id="login-password"
						type={showPw ? "text" : "password"}
						autoComplete="current-password"
						required
						placeholder="••••••••••"
						value={password}
						onChange={handlePasswordChange}
						className={cn(
							"h-[42px] rounded-[9px] border-[0.5px] bg-surf px-3.5 pr-11 text-[14px] hover:border-bd-3 max-[640px]:h-11 max-[640px]:text-[16px]",
							errors.password && "border-red",
						)}
						aria-invalid={Boolean(errors.password)}
						aria-describedby={errors.password ? "login-password-error" : undefined}
					/>
					<Button
						tabIndex={-1}
						variant="bare"
						onClick={handleTogglePasswordVisibility}
						aria-label={t(showPw ? "auth.password.hide" : "auth.password.show")}
						className="absolute inset-y-1 right-1 inline-flex w-[34px] items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						{showPw ? (
							<EyeOff size={16} strokeWidth={1.8} />
						) : (
							<Eye size={16} strokeWidth={1.8} />
						)}
					</Button>
				</div>
				{errors.password ? (
					<Typography id="login-password-error" className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
						<AlertCircle size={12} strokeWidth={2} />
						<Typography tag="span">{errors.password}</Typography>
					</Typography>
				) : null}
			</div>

			<div className="mb-5 mt-1.5 flex items-center justify-between max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-3">
				<Typography
					tag="label"
					className="inline-flex cursor-pointer select-none items-center gap-2 text-[12.5px] text-t-2"
				>
					<input
						type="checkbox"
						className="peer absolute size-4 opacity-0"
						checked={remember}
						onChange={handleRememberChange}
					/>
					<Typography
						tag="span"
						aria-hidden="true"
						className="relative inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[0.5px] border-bd-3 bg-surf transition-colors peer-checked:border-acc peer-checked:bg-acc peer-focus-visible:ring-2 peer-focus-visible:ring-acc peer-focus-visible:ring-offset-1 peer-checked:[&>svg]:opacity-100"
					>
						<svg
							viewBox="0 0 12 8"
							className="h-2.5 w-3 text-white opacity-0 transition-opacity"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="1 4 4.5 7 11 1" />
						</svg>
					</Typography>
					{t("auth.fields.remember")}
				</Typography>
			</div>

			<Button
				type="submit"
				disabled={isPending}
				title={t("auth.submit.login")}
				className={cn(
					"inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[9px] bg-acc text-[13.5px] font-semibold text-white transition-opacity hover:opacity-[0.92] active:translate-y-px max-[640px]:h-[46px] max-[640px]:text-[14px]",
					isPending && "cursor-wait opacity-[0.85]",
				)}
			>
				<Typography tag="span" className={cn(isPending && "opacity-60")}>
					{t("auth.submit.login")}
				</Typography>
				<ArrowRight size={14} strokeWidth={2} />
			</Button>
		</form>
	);
};
