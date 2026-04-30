"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { AuthLang } from "@/entities/auth";
import { useI18n } from "@/shared/lib/i18n";
import {
	extractResetErrorReason,
	type ResetErrorReason,
} from "../lib/extract-error-reason";
import { useConfirmReset } from "./use-confirm-reset";
import { useRequestReset } from "./use-request-reset";
import { useResendTimer } from "./use-resend-timer";
import { useValidateResetToken } from "./use-validate-token";

export type ResetStep = 1 | 2 | 3 | 4;

const toAuthLang = (lang: string): AuthLang => {
	if (lang === "ru" || lang === "en" || lang === "che" || lang === "ar") {
		return lang;
	}
	return "ru";
};

export const useResetFlow = () => {
	const { lang } = useI18n();
	const authLang = useMemo(() => toAuthLang(lang), [lang]);

	const searchParams = useSearchParams();
	const tokenFromUrl = searchParams.get("token");

	const [step, setStep] = useState<ResetStep>(tokenFromUrl ? 3 : 1);
	const [email, setEmail] = useState("");
	const [requestError, setRequestError] = useState<string | null>(null);
	const [confirmError, setConfirmError] = useState<ResetErrorReason | null>(
		null,
	);

	const tokenValidation = useValidateResetToken(tokenFromUrl);
	const requestMutation = useRequestReset();
	const confirmMutation = useConfirmReset();
	const resendTimer = useResendTimer({ durationSeconds: 60 });

	const submitEmail = useCallback(
		async (rawEmail: string) => {
			setRequestError(null);
			const trimmed = rawEmail.trim();
			try {
				await requestMutation.mutateAsync({
					email: trimmed,
					lang: authLang,
				});
				setEmail(trimmed);
				setStep(2);
				resendTimer.start();
			} catch {
				setRequestError("generic");
			}
		},
		[authLang, requestMutation, resendTimer],
	);

	const resend = useCallback(async () => {
		if (!email || resendTimer.isActive) return;
		try {
			await requestMutation.mutateAsync({ email, lang: authLang });
			resendTimer.start();
		} catch {
			setRequestError("generic");
		}
	}, [authLang, email, requestMutation, resendTimer]);

	const changeEmail = useCallback(() => {
		setRequestError(null);
		setStep(1);
	}, []);

	const submitNewPassword = useCallback(
		async (password: string) => {
			if (!tokenFromUrl) return;
			setConfirmError(null);
			try {
				await confirmMutation.mutateAsync({
					body: { token: tokenFromUrl, password },
					lang: authLang,
				});
				setStep(4);
			} catch (error) {
				setConfirmError(extractResetErrorReason(error));
			}
		},
		[authLang, confirmMutation, tokenFromUrl],
	);

	return {
		step,
		email,
		tokenFromUrl,
		tokenValidation,
		requestState: {
			isPending: requestMutation.isPending,
			error: requestError,
		},
		confirmState: {
			isPending: confirmMutation.isPending,
			error: confirmError,
		},
		resendTimer: {
			secondsLeft: resendTimer.secondsLeft,
			isActive: resendTimer.isActive,
		},
		submitEmail,
		resend,
		changeEmail,
		submitNewPassword,
	};
};
