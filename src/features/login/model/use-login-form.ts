"use client";

import { useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useLogin } from "./use-login";

interface LoginErrors {
	email?: string;
	password?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UseLoginFormParams {
	successHref: string;
}

export const useLoginForm = ({ successHref }: UseLoginFormParams) => {
	const { t } = useI18n();
	const router = useRouter();
	const { mutateAsync, isPending, error, reset } = useLogin();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(true);
	const [showPw, setShowPw] = useState(false);
	const [errors, setErrors] = useState<LoginErrors>({});

	const validate = () => {
		const next: LoginErrors = {};
		const loginValue = email.trim();
		if (!loginValue || (!EMAIL_RE.test(loginValue) && loginValue.length < 2)) {
			next.email = t("auth.errors.loginIdentifier");
		}
		if (!password || password.length < 8) {
			next.password = t("auth.errors.password");
		}
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

	const handleEmailChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => setEmail(event.currentTarget.value);
	const handlePasswordChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) => setPassword(event.currentTarget.value);
	const handleTogglePasswordVisibility: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => setShowPw((value) => !value);
	const handleRememberChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = (event) => setRemember(event.currentTarget.checked);

	return {
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
	};
};
