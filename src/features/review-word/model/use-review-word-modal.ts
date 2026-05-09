"use client";

import { useState } from "react";
import { useRateWord } from "@/features/rate-word";
import type { DictionaryEntryDetail } from "@/entities/dictionary";
import type { ReviewQuality } from "@/entities/review";
import { useI18n } from "@/shared/lib/i18n";

interface UseReviewWordModalParams {
	onClose: () => void;
	entry: DictionaryEntryDetail;
}

export const useReviewWordModal = ({
	onClose,
	entry,
}: UseReviewWordModalParams) => {
	const { t } = useI18n();
	const { mutate: rate, isPending } = useRateWord();
	const [done, setDone] = useState(false);

	const handleRate = (quality: ReviewQuality) => {
		if (!entry.lemma) return;
		rate(
			{ lemmaId: entry.lemma.id, body: { quality } },
			{ onSuccess: () => setDone(true) },
		);
	};

	const handleClose = () => {
		setDone(false);
		onClose();
	};

	return {
		t,
		isPending,
		done,
		handleRate,
		handleClose,
	};
};
