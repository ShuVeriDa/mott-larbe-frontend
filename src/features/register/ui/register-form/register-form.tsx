"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SyntheticEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { CEFR_LEVELS, type CefrLevel } from "@/shared/types/cefr";
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
	surname?: string;
	username?: string;
	email?: string;
	password?: string;
	password2?: string;
}

export const RegisterForm = ({
	successHref,
	termsHref,
	privacyHref,
}: RegisterFormProps) => {
	const { t } = useI18n();
	const router = useRouter();
	const { mutateAsync, isPending, error, reset } = useRegister();

	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [level, setLevel] = useState<CefrLevel>("A2");
	const [showPw, setShowPw] = useState(false);
	const [errors, setErrors] = useState<RegisterErrors>({});

	const validate = () => {
		const next: RegisterErrors = {};
		if (!name.trim() || name.trim().length < 2)
			next.name = t("auth.errors.name");
		if (!surname.trim() || surname.trim().length < 2)
			next.surname = t("auth.errors.surname");
		if (!username.trim() || username.trim().length < 2 || username.trim().length > 16)
			next.username = t("auth.errors.username");
		if (!email || !EMAIL_RE.test(email)) next.email = t("auth.errors.email");
		if (!password || password.length < 8)
			next.password = t("auth.errors.password");
		if (password !== password2) next.password2 = t("auth.errors.passwordMatch");
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		reset();
		if (!validate()) return;
		try {
			await mutateAsync({
				email: email.trim(),
				password,
				username: username.trim(),
				name: name.trim(),
				surname: surname.trim(),
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

			<div className="mb-3.5 grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
				<div>
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
						autoComplete="given-name"
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
				<div>
					<Typography
						tag="label"
						htmlFor="register-surname"
						className="mb-1.5 block text-[11.5px] font-medium text-t-2"
					>
						{t("auth.fields.surname")}
					</Typography>
					<input
						id="register-surname"
						type="text"
						autoComplete="family-name"
						required
						placeholder={t("auth.placeholders.surname")}
						value={surname}
						onChange={(e) => setSurname(e.target.value)}
						className={cn(
							"h-[42px] w-full rounded-[9px] border-[0.5px] border-bd-2 bg-surf px-3.5 text-[14px] text-t-1 outline-none transition-colors hover:border-bd-3 focus:border-acc max-[640px]:h-11 max-[640px]:text-[16px]",
							errors.surname && "border-red",
						)}
						aria-invalid={Boolean(errors.surname)}
					/>
					{errors.surname ? (
						<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
							<AlertCircle size={12} strokeWidth={2} />
							<Typography tag="span">{errors.surname}</Typography>
						</Typography>
					) : null}
				</div>
			</div>

			<div className="mb-3.5">
				<Typography
					tag="label"
					htmlFor="register-username"
					className="mb-1.5 block text-[11.5px] font-medium text-t-2"
				>
					{t("auth.fields.username")}
				</Typography>
				<input
					id="register-username"
					type="text"
					autoComplete="username"
					required
					placeholder={t("auth.placeholders.username")}
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className={cn(
						"h-[42px] w-full rounded-[9px] border-[0.5px] border-bd-2 bg-surf px-3.5 text-[14px] text-t-1 outline-none transition-colors hover:border-bd-3 focus:border-acc max-[640px]:h-11 max-[640px]:text-[16px]",
						errors.username && "border-red",
					)}
					aria-invalid={Boolean(errors.username)}
				/>
				{errors.username ? (
					<Typography className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-red">
						<AlertCircle size={12} strokeWidth={2} />
						<Typography tag="span">{errors.username}</Typography>
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

			<div className="mb-5">
				<Typography className="mb-1.5 block text-[11.5px] font-medium text-t-2">
					{t("auth.fields.level")}
				</Typography>
				<div className="grid grid-cols-3 gap-2">
					{CEFR_LEVELS.map((cefrLevel) => (
						<button
							key={cefrLevel}
							type="button"
							onClick={() => setLevel(cefrLevel)}
							className={cn(
								"h-9 rounded-[9px] border-[0.5px] text-[12.5px] font-semibold transition-colors",
								level === cefrLevel
									? "border-acc bg-acc text-white"
									: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:text-t-1",
							)}
							aria-pressed={level === cefrLevel}
						>
							{cefrLevel}
						</button>
					))}
				</div>
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
