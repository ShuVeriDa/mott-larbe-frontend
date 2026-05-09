"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { Check } from "lucide-react";
import { RatingButtons } from "@/features/rate-word";
import type { DictionaryEntryDetail } from "@/entities/dictionary";
import { Modal } from "@/shared/ui/modal";
import { useReviewWordModal } from "../../model";

export interface ReviewWordModalProps {
	open: boolean;
	onClose: () => void;
	entry: DictionaryEntryDetail;
}

export const ReviewWordModal = ({
	open,
	onClose,
	entry,
}: ReviewWordModalProps) => {
	const { t, isPending, done, handleRate, handleClose } = useReviewWordModal({
		onClose,
		entry,
	});

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={t("vocabulary.wordDetail.reviewModal.title", { word: entry.word })}
		>
			{done ? (
				<div className="flex flex-col items-center gap-2 py-3">
					<Typography tag="span" className="flex size-10 items-center justify-center rounded-full bg-grn-bg text-grn">
						<Check className="size-5" strokeWidth={2} />
					</Typography>
					<Typography tag="p" className="text-center text-[13px] text-t-2">
						{t("vocabulary.wordDetail.reviewModal.done")}
					</Typography>
					<Button
						onClick={handleClose}
						className="mt-1 text-[12px] text-acc hover:underline"
					>
						{t("vocabulary.wordDetail.reviewModal.close")}
					</Button>
				</div>
			) : (
				<>
					<Typography tag="p" className="mb-1 text-center font-display text-[30px] italic leading-none text-t-1">
						{entry.word}
					</Typography>
					{entry.lemma?.transliteration ? (
						<Typography tag="p" className="mb-1 text-center text-[13px] italic text-t-3">
							{entry.lemma.transliteration}
						</Typography>
					) : null}
					<Typography tag="p" className="mb-5 text-center text-[14px] text-t-2">
						{entry.translation}
					</Typography>
					<RatingButtons visible onRate={handleRate} disabled={isPending} />
				</>
			)}
		</Modal>
	);
};
