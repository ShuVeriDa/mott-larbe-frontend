"use client";

import { Button } from "@/shared/ui/button";

import { Check, Plus } from "lucide-react";
import {
	useAddToVocabulary,
	useRemoveFromVocabulary,
} from "@/features/add-to-vocabulary";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";

export interface AddToDictionaryButtonProps {
	tokenId: string;
	inDictionary: boolean;
	dictionaryEntryId: string | null;
	className?: string;
}

export const AddToDictionaryButton = ({
	tokenId,
	inDictionary,
	dictionaryEntryId,
	className,
}: AddToDictionaryButtonProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutate: add, isPending: adding } = useAddToVocabulary();
	const { mutate: remove, isPending: removing } = useRemoveFromVocabulary();

	const isPending = adding || removing;

	const onClick = () => {
		if (inDictionary && dictionaryEntryId) {
			remove(
				{ dictionaryEntryId, tokenId },
				{
					onSuccess: () => success(t("reader.toasts.removedFromDict")),
					onError: () => error(t("reader.toasts.dictFailed")),
				},
			);
			return;
		}
		add(
			{ tokenId },
			{
				onSuccess: () => success(t("reader.toasts.addedToDict")),
				onError: () => error(t("reader.toasts.dictFailed")),
			},
		);
	};

	return (
		<Button
			onClick={onClick}
			disabled={isPending}
			className={cn(
				"flex h-9 w-full items-center justify-center gap-1.5",
				"rounded-base text-[12px] font-semibold transition-opacity duration-150",
				"disabled:opacity-60 hover:opacity-90",
				inDictionary
					? "bg-grn text-white"
					: "bg-acc text-white",
				className,
			)}
		>
			{inDictionary ? (
				<>
					<Check className="size-3.5" strokeWidth={1.8} />
					{t("reader.panel.inDictionary")}
				</>
			) : (
				<>
					<Plus className="size-3.5" strokeWidth={1.8} />
					{t("reader.panel.addToDictionary")}
				</>
			)}
		</Button>
	);
};
