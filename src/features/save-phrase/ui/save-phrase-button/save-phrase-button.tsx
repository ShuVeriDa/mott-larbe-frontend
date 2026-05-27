"use client";

import { BookmarkIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { useSavePhrase } from "../../model/use-save-phrase";

interface SavePhraseButtonProps {
	phraseId: string;
	saved: boolean;
	size?: "sm" | "md";
	className?: string;
}

export const SavePhraseButton = ({
	phraseId,
	saved,
	size = "md",
	className,
}: SavePhraseButtonProps) => {
	const { t } = useI18n();
	const { mutate, isPending } = useSavePhrase();

	const handleClick = () => mutate(phraseId);

	return (
		<Button
			variant="bare"
			size={null}
			disabled={isPending}
			onClick={handleClick}
			title={saved ? t("phrasebook.unsave") : t("phrasebook.save")}
			aria-label={saved ? t("phrasebook.unsave") : t("phrasebook.save")}
			className={cn(
				"flex items-center justify-center rounded-full transition-colors duration-150",
				size === "sm"
					? "h-7 w-7 text-[14px]"
					: "h-8 w-8 text-[16px]",
				saved
					? "text-acc hover:text-acc/70"
					: "text-t-3 hover:text-t-1",
				className,
			)}
		>
			<BookmarkIcon
				className={cn(
					"transition-all duration-150",
					size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
					saved && "fill-current",
				)}
			/>
		</Button>
	);
};
