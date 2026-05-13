"use client";

import { useI18n } from "@/shared/lib/i18n";
import { type CefrLevel } from "@/shared/types/cefr";
import { useRouter } from "next/navigation";
import { type ComponentProps, useState } from "react";
import { useRegister } from "./use-register";

interface RegisterErrors {
	name?: string;
	surname?: string;
	username?: string;
	email?: string;
	password?: string;
	password2?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UseRegisterFormParams {
	successHref: string;
}

export const useRegisterForm = ({ successHref }: UseRegisterFormParams) => {
	const { t } = useI18n();
	const router = useRouter();
	const { mutateAsync, isPending, error, reset } = useRegister();

	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [level, setLevel] = useState<CefrLevel>("A");
	const [showPw, setShowPw] = useState(false);
	const [errors, setErrors] = useState<RegisterErrors>({});

	const validate = () => {
		const next: RegisterErrors = {};
		if (!name.trim() || name.trim().length < 2) {
			next.name = t("auth.errors.name");
		}
		if (!surname.trim() || surname.trim().length < 2) {
			next.surname = t("auth.errors.surname");
		}
		if (
			!username.trim() ||
			username.trim().length < 2 ||
			username.trim().length > 16
		) {
			next.username = t("auth.errors.username");
		}
		if (!email || !EMAIL_RE.test(email)) {
			next.email = t("auth.errors.email");
		}
		if (!password || password.length < 8) {
			next.password = t("auth.errors.password");
		}
		if (password !== password2) {
			next.password2 = t("auth.errors.passwordMatch");
		}
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async () => {
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

	const handleNameChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = event => setName(event.currentTarget.value);
	const handleSurnameChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = event => setSurname(event.currentTarget.value);
	const handleUsernameChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = event => setUsername(event.currentTarget.value);
	const handleEmailChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = event => setEmail(event.currentTarget.value);
	const handlePasswordChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = event => setPassword(event.currentTarget.value);
	const handleTogglePasswordVisibility: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => setShowPw(value => !value);
	const handlePasswordConfirmChange: NonNullable<
		ComponentProps<"input">["onChange"]
	> = event => setPassword2(event.currentTarget.value);
	const handleLevelClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = event => {
		const nextLevel = event.currentTarget.dataset.level as
			| CefrLevel
			| undefined;
		if (!nextLevel) return;
		setLevel(nextLevel);
	};

	return {
		t,
		isPending,
		error,
		name,
		surname,
		username,
		email,
		password,
		password2,
		level,
		showPw,
		errors,
		handleSubmit,
		handleNameChange,
		handleSurnameChange,
		handleUsernameChange,
		handleEmailChange,
		handlePasswordChange,
		handleTogglePasswordVisibility,
		handlePasswordConfirmChange,
		handleLevelClick,
	};
};
