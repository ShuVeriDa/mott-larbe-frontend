"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { ComponentProps, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, Trash2 } from "lucide-react";
import {
	useDictionaryNeighbors,
	type DictionaryEntryDetail,
} from "@/entities/dictionary";
import { useDeleteWord } from "@/features/delete-word";
import { ReviewWordModal } from "@/features/review-word";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

const tbBtnClass = cn(
	"inline-flex h-7 items-center gap-[5px] whitespace-nowrap rounded-base px-2.5",
	"border-hairline border-bd-2 bg-surf-2 text-[12px] text-t-2 font-[inherit]",
	"transition-[color,border-color] duration-150 hover:text-t-1",
	"disabled:opacity-40 disabled:cursor-not-allowed",
);

export interface WordDetailTopbarProps {
	entry: DictionaryEntryDetail;
}

export const WordDetailTopbar = ({ entry }: WordDetailTopbarProps) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { data: neighbors } = useDictionaryNeighbors(entry.id);
	const { mutate: removeEntry, isPending: isDeleting } = useDeleteWord();
	const [reviewOpen, setReviewOpen] = useState(false);

	const onDelete = () => {
		const ok = window.confirm(
			t("vocabulary.wordDetail.deleteConfirm", { word: entry.word }),
		);
		if (!ok) return;
		removeEntry(entry.id, {
			onSuccess: () => router.push(`/${lang}/vocabulary`),
		});
	};

	const buildHref = (id: string) => `/${lang}/vocabulary/${id}`;

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setReviewOpen(true);
	const handleClose: NonNullable<ComponentProps<typeof ReviewWordModal>["onClose"]> = () => setReviewOpen(false);
return (
		<>
			<header className="flex shrink-0 items-center gap-2.5 border-b border-hairline border-bd-1 bg-surf px-[22px] py-3 max-md:gap-2 max-md:px-[14px] max-md:py-2.5">
				<Link
					href={`/${lang}/vocabulary`}
					className="inline-flex items-center gap-1.5 whitespace-nowrap p-0 text-[12.5px] text-t-3 transition-colors duration-150 hover:text-t-1 max-md:text-[12px]"
				>
					<ChevronLeft className="size-3" strokeWidth={1.8} />
					{t("vocabulary.wordDetail.back")}
				</Link>
				<Typography tag="span" aria-hidden="true" className="text-[12px] text-t-4">
					·
				</Typography>
				<Typography tag="span"
					className={cn(
						"min-w-0 truncate font-display text-[13px] font-semibold italic text-t-1",
						"max-md:max-w-[120px]",
					)}
				>
					{entry.word}
				</Typography>

				<div className="ml-auto flex shrink-0 items-center gap-1.5">
					{neighbors?.prev ? (
						<Link
							href={buildHref(neighbors.prev.id)}
							aria-label={t("vocabulary.wordDetail.prev")}
							className={cn(tbBtnClass, "max-md:hidden")}
						>
							<ChevronLeft className="size-3" strokeWidth={1.8} />
						</Link>
					) : null}
					{neighbors?.next ? (
						<Link
							href={buildHref(neighbors.next.id)}
							aria-label={t("vocabulary.wordDetail.next")}
							className={cn(tbBtnClass, "max-md:hidden")}
						>
							<ChevronRight className="size-3" strokeWidth={1.8} />
						</Link>
					) : null}
					<Button
						onClick={handleClick}
						disabled={!entry.lemma}
						className={cn(tbBtnClass, "ml-0.5")}
					>
						<RefreshCw className="size-3" strokeWidth={1.8} />
						<Typography tag="span" className="max-md:hidden">
							{t("vocabulary.wordDetail.review")}
						</Typography>
					</Button>
					<Button
						onClick={onDelete}
						disabled={isDeleting}
						className={cn(tbBtnClass, "border-red/20 text-red hover:text-red")}
					>
						<Trash2 className="size-3" strokeWidth={1.8} />
						<Typography tag="span" className="max-md:hidden">{t("vocabulary.card.delete")}</Typography>
					</Button>
				</div>
			</header>

			{entry.lemma ? (
				<ReviewWordModal
					open={reviewOpen}
					onClose={handleClose}
					entry={entry}
				/>
			) : null}
		</>
	);
};
