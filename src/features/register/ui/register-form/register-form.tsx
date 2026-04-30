"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import { useRegister } from "../../model";
import { PasswordStrengthMeter } from "../password-strength-meter";

interface RegisterFormProps {
	successHref: string;
	termsHref: string;
	privacyHref: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterErrors {
	name?: string;
	email?: string;
	password?: string;
	password2?: string;
}

const deriveCredentials = (rawName: string, email: string) => {
	const nameValue = rawName.trim().replace(/\s+/g, " ");
	const [first, ...rest] = nameValue.split(" ");
	const surnamePart = rest.join(" ").trim();

	const localPart = email.split("@")[0] ?? "";
	const sanitized = localPart
		.toLowerCase()
		.replace(/[^a-z0-9_-]/g, "")
		.slice(0, 16);
	const username =
		sanitized.length >= 2 ? sanitized : `user${Date.now().toString(36).slice(-4)}`;

	return {
		username,
		name: first || nameValue,
		surname: surnamePart.length >= 2 ? surnamePart : first || nameValue,
	};
};

export const RegisterForm = ({
	successHref,
	termsHref,
	privacyHref,
}: RegisterFormProps) => {
	const { t } = useI18n();
	const router = useRouter();
	const { mutateAsync, isPending, error, reset } = useRegister();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [showPw, setShowPw] = useState(false);
	const [errors, setErrors] = useState<RegisterErrors>({});

	const validate = () => {
		const next: RegisterErrors = {};
		if (!name.trim() || name.trim().length < 2)
			next.name = t("auth.errors.name");
		if (!email || !EMAIL_RE.test(email)) next.email = t("auth.errors.email");
		if (!password || password.length < 8)
			next.password = t("auth.errors.password");
		if (password !== password2) next.password2 = t("auth.errors.passwordMatch");
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		reset();
		if (!validate()) return;
		try {
			const { username, name: firstName, surname } = deriveCredentials(
				name,
				email,
			);
			await mutateAsync({
				email: email.trim(),
				password,
				username,
				name: firstName,
				surname,
			});
			router.push(successHref);
			router.refresh();
		} catch {
			// surfaced via mutation state
		}
	};

	return (
		<form onSubmit={handleSubmit} noValidate autoComplete="on">
			{error ? (
				<div
					role="alert"
					className="mb-4 flex items-start gap-2.5 rounded-[8px] border-[0.5px] border-amb/25 bg-amb-bg px-3 py-2.5 text-[12px] text-amb-t"
				>
					<AlertCircle size={14} className="mt-px shrink-0" strokeWidth={2} />
					<Typography tag="span">
						{t("auth.errors.registerFailed")}
					</Typography>
				</div>
			) : null}

			<div className="mb-3.5">
				<Typography
					tag="label"
					htmlFor="register-name"
					className="mb-1.5 block text-[11.5px] font-medium text-t-2"
				>
					{t("auth.fields.name")}
				</Typography>
				<input
					id="register-name"
					type="text"
					autoComplete="name"
					required
					placeholder={t("auth.placeholders.name")}
					value={name}
					onChange={(e) => setName(e.target.value)}
					className={cn(
						"h-[42px] w-full rounded-[9px] border-[0.5px] border-bd-2 bg-surf px-3.5 text-[14px] text-t-1 outline-none transition-colors hover:border-bd-3 focus:border-acc max-[640px]:h-11 max-[640px]:text-[16px]",
						errors.name && "border-red",
					)}
					aria-invalid={Boolean(errors.name)}
				/>
				{errors.name ? (
					<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
						<AlertCircle size={12} strokeWidth={2} />
						<Typography tag="span">{errors.name}</Typography>
					</Typography>
				) : null}
			</div>

			<div className="mb-3.5">
				<Typography
					tag="label"
					htmlFor="register-email"
					className="mb-1.5 block text-[11.5px] font-medium text-t-2"
				>
					{t("auth.fields.email")}
				</Typography>
				<input
					id="register-email"
					type="email"
					inputMode="email"
					autoComplete="email"
					required
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
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
				<Typography
					tag="label"
					htmlFor="register-password"
					className="mb-1.5 block text-[11.5px] font-medium text-t-2"
				>
					{t("auth.fields.password")}
				</Typography>
				<div className="relative flex items-center">
					<input
						id="register-password"
						type={showPw ? "text" : "password"}
						autoComplete="new-password"
						required
						placeholder="••••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={cn(
							"h-[42px] w-full rounded-[9px] border-[0.5px] border-bd-2 bg-surf px-3.5 pr-11 text-[14px] text-t-1 outline-none transition-colors hover:border-bd-3 focus:border-acc max-[640px]:h-11 max-[640px]:text-[16px]",
							errors.password && "border-red",
						)}
						aria-invalid={Boolean(errors.password)}
					/>
					<button
						type="button"
						tabIndex={-1}
						onClick={() => setShowPw((v) => !v)}
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
				<PasswordStrengthMeter password={password} />
				{errors.password ? (
					<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
						<AlertCircle size={12} strokeWidth={2} />
						<Typography tag="span">{errors.password}</Typography>
					</Typography>
				) : null}
			</div>

			<div className="mb-5">
				<Typography
					tag="label"
					htmlFor="register-password2"
					className="mb-1.5 block text-[11.5px] font-medium text-t-2"
				>
					{t("auth.fields.passwordConfirm")}
				</Typography>
				<input
					id="register-password2"
					type={showPw ? "text" : "password"}
					autoComplete="new-password"
					required
					placeholder="••••••••••"
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					className={cn(
						"h-[42px] w-full rounded-[9px] border-[0.5px] border-bd-2 bg-surf px-3.5 text-[14px] text-t-1 outline-none transition-colors hover:border-bd-3 focus:border-acc max-[640px]:h-11 max-[640px]:text-[16px]",
						errors.password2 && "border-red",
					)}
					aria-invalid={Boolean(errors.password2)}
				/>
				{errors.password2 ? (
					<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
						<AlertCircle size={12} strokeWidth={2} />
						<Typography tag="span">{errors.password2}</Typography>
					</Typography>
				) : null}
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
					{t("auth.submit.register")}
				</Typography>
				<ArrowRight size={14} strokeWidth={2} />
			</button>

			<Typography className="mt-3.5 text-center text-[11.5px] leading-[1.55] text-t-3">
				{t("auth.terms.agree")}{" "}
				<Link
					href={termsHref}
					className="text-t-2 transition-colors hover:text-t-1 hover:underline"
				>
					{t("auth.terms.terms")}
				</Link>{" "}
				{t("auth.terms.and")}{" "}
				<Link
					href={privacyHref}
					className="text-t-2 transition-colors hover:text-t-1 hover:underline"
				>
					{t("auth.terms.privacy")}
				</Link>
				.
			</Typography>
		</form>
	);
};
