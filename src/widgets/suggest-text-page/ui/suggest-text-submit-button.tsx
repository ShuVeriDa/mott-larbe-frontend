"use client";

import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";

interface SuggestTextSubmitButtonProps {
	isPending: boolean;
}

export const SuggestTextSubmitButton = ({ isPending }: SuggestTextSubmitButtonProps) => {
	const { t } = useI18n();

	return (
		<Button
			type="submit"
			variant="action"
			disabled={isPending}
			className="h-[34px] px-5 rounded-lg text-[13px]"
		>
			{isPending ? t("suggestTextPage.form.submitting") : t("suggestTextPage.form.submit")}
		</Button>
	);
};
