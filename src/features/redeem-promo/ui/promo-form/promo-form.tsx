"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { useRedeemPromo } from "../../model";

interface FeedbackState {
	tone: "success" | "error";
	message: string;
}

export const PromoForm = () => {
	const { t } = useI18n();
	const [code, setCode] = useState("");
	const [feedback, setFeedback] = useState<FeedbackState | null>(null);
	const { mutateAsync, isPending } = useRedeemPromo();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const value = code.trim();
		if (!value) {
			setFeedback({
				tone: "error",
				message: t("subscription.promo.empty"),
			});
			return;
		}
		try {
			await mutateAsync(value);
			setFeedback({
				tone: "success",
				message: t("subscription.promo.success"),
			});
			setCode("");
		} catch {
			setFeedback({
				tone: "error",
				message: t("subscription.promo.error"),
			});
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-2 px-4 py-3.5 max-md:px-3"
		>
			<div className="flex gap-2">
				<Input
					value={code}
					onChange={(e) => setCode(e.target.value.toUpperCase())}
					placeholder={t("subscription.promo.placeholder")}
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					className="flex-1 uppercase tracking-[0.5px] placeholder:normal-case placeholder:tracking-normal max-md:text-base"
				/>
				<Button type="submit" variant="action" disabled={isPending}>
					{isPending
						? t("subscription.promo.submitting")
						: t("subscription.promo.submit")}
				</Button>
			</div>
			{feedback ? (
				<Typography
					tag="span"
					className={
						feedback.tone === "success"
							? "text-[11.5px] text-grn-t"
							: "text-[11.5px] text-red-t"
					}
				>
					{feedback.message}
				</Typography>
			) : null}
		</form>
	);
};
