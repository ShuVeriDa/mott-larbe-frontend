"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { useLogin } from "../../model";

interface LoginFormProps {
	forgotHref: string;
	successHref: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginForm = ({ forgotHref, successHref }: LoginFormProps) => {
	const { t } = useI18n();
	const router = useRouter();
	const { mutateAsync, isPending, error, reset } = useLogin();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(true);
	const [showPw, setShowPw] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	const validate = () => {
		const next: { email?: string; password?: string } = {};
		const loginValue = email.trim();
		if (!loginValue || (!EMAIL_RE.test(loginValue) && loginValue.length < 2))
			next.email = t("auth.errors.loginIdentifier");
		if (!password || password.length < 8)
			next.password = t("auth.errors.password");
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async () => {
		reset();
		if (!validate()) return;
		try {
			await mutateAsync({ username: email.trim(), password });
			router.push(successHref);
			router.refresh();
		} catch {
			// error surfaced via mutation state
		}
	};

		const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setEmail(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setPassword(e.currentTarget.value);
	const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setShowPw((v) => !v);
	const handleChange3: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setRemember(e.currentTarget.checked);
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
				<input
					id="login-email"
					type="text"
					inputMode="email"
					autoComplete="email"
					required
					placeholder={t("auth.placeholders.loginIdentifier")}
					value={email}
					onChange={handleChange}
					className={cn(
						"h-[42px] w-full rounded-[9px] border-[0.5px] border-bd-2 bg-surf px-3.5 text-[14px] text-t-1 outline-none transition-colors hover:border-bd-3 focus:border-acc max-[640px]:h-11 max-[640px]:text-[16px]",
						errors.email && "border-red",
					)}
					aria-invalid={Boolean(errors.email)}
				/>
				{errors.email ? (
					<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
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
					<input
						id="login-password"
						type={showPw ? "text" : "password"}
						autoComplete="current-password"
						required
						placeholder="••••••••••"
						value={password}
						onChange={handleChange2}
						className={cn(
							"h-[42px] w-full rounded-[9px] border-[0.5px] border-bd-2 bg-surf px-3.5 pr-11 text-[14px] text-t-1 outline-none transition-colors hover:border-bd-3 focus:border-acc max-[640px]:h-11 max-[640px]:text-[16px]",
							errors.password && "border-red",
						)}
						aria-invalid={Boolean(errors.password)}
					/>
					<button
						type="button"
						tabIndex={-1}
						onClick={handleClick}
						aria-label={t(
							showPw ? "auth.password.hide" : "auth.password.show",
						)}
						className="absolute inset-y-1 right-1 inline-flex w-[34px] items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						{showPw ? (
							<EyeOff size={16} strokeWidth={1.8} />
						) : (
							<Eye size={16} strokeWidth={1.8} />
						)}
					</button>
				</div>
				{errors.password ? (
					<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
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
						className="peer sr-only"
						checked={remember}
						onChange={handleChange3}
					/>
					<Typography
						tag="span"
						aria-hidden="true"
						className="relative inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border-[0.5px] border-bd-3 bg-surf transition-colors peer-checked:border-acc peer-checked:bg-acc peer-checked:[&>svg]:opacity-100"
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

			<button
				type="submit"
				disabled={isPending}
				className={cn(
					"inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-[9px] bg-acc text-[13.5px] font-semibold text-white transition-opacity hover:opacity-[0.92] active:translate-y-px max-[640px]:h-[46px] max-[640px]:text-[14px]",
					isPending && "cursor-wait opacity-[0.85]",
				)}
			>
				<Typography tag="span" className={cn(isPending && "opacity-60")}>
					{t("auth.submit.login")}
				</Typography>
				<ArrowRight size={14} strokeWidth={2} />
			</button>
		</form>
	);
};
