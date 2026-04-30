"use client";

import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { useDeleteWord } from "../../model";

export interface DeleteWordButtonProps {
	wordId: string;
	className?: string;
}

export const DeleteWordButton = ({
	wordId,
	className,
}: DeleteWordButtonProps) => {
	const { t } = useI18n();
	const { mutate, isPending } = useDeleteWord();

	return (
		<Button
			variant="danger"
			size="default"
			disabled={isPending}
			onClick={(e) => {
				e.stopPropagation();
				mutate(wordId);
			}}
			className={className}
		>
			{t("vocabulary.card.delete")}
		</Button>
	);
};
