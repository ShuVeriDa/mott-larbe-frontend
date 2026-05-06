"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	formatNextReview,
	formatRelativeFromNow,
	formatReviewIn,
} from "@/shared/lib/format-relative-time";
import {
	CefrBadge,
	Sm2Bar,
	StatusBadge,
	StatusDot,
	type DictionaryEntry,
} from "@/entities/dictionary";
import { DeleteWordButton } from "@/features/delete-word";
import { FolderSelect, StatusButtons } from "@/features/update-word";

export interface WordCardProps {
	entry: DictionaryEntry;
	expanded: boolean;
	onToggle: () => void;
}

const getMetaSecondary = (
	entry: DictionaryEntry,
	t: (key: string, vars?: Record<string, string | number>) => string,
): string => {
	if (entry.learningLevel === "NEW") {
		const added = new Date(entry.addedAt).getTime();
		const now = Date.now();
		const diffDays = Math.floor((now - added) / (1000 * 60 * 60 * 24));
		if (diffDays < 1) return t("vocabulary.card.addedToday");
		return t("vocabulary.card.addedAgo", {
			time: formatRelativeFromNow(entry.addedAt, t),
		});
	}
	if (entry.nextReview) {
		const targetMs = new Date(entry.nextReview).getTime();
		const diff = targetMs - Date.now();
		if (diff > 0) {
			return t("vocabulary.card.reviewIn", {
				time: formatReviewIn(entry.nextReview, t),
			});
		}
		return t("vocabulary.card.reviewOn", {
			date: formatNextReview(entry.nextReview, t, "ru"),
		});
	}
	return t("vocabulary.card.addedAgo", {
		time: formatRelativeFromNow(entry.addedAt, t),
	});
};

export const WordCard = ({ entry, expanded, onToggle }: WordCardProps) => {
	const { t, lang } = useI18n();
	const sourceTitle = entry.lemma?.wordContexts?.[0]?.text?.title;
	const example = entry.lemma?.headwords?.[0]?.entry?.senses?.[0]?.examples?.[0];
	const forms = entry.lemma?.morphForms ?? [];

	return (
		<article
			role="button"
			tabIndex={0}
			aria-expanded={expanded}
			onClick={onToggle}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onToggle();
				}
			}}
			className={cn(
				"flex cursor-pointer items-center gap-3 rounded-card border-hairline border-bd-1 bg-surf p-[11px_14px]",
				"transition-[border-color,box-shadow] duration-100",
				"hover:border-bd-2 hover:shadow-sm",
				"outline-none focus-visible:border-acc focus-visible:shadow-[0_0_0_2px_var(--acc-bg)]",
				expanded && "border-acc shadow-[0_0_0_2px_var(--acc-bg)]",
			)}
		>
			<StatusDot status={entry.learningLevel} className="mt-px size-[6px]" />

			<div className="flex min-w-0 flex-1 flex-col">
				<div className="mb-[3px] flex flex-wrap items-baseline gap-2">
					<Typography
						tag="span"
						className="font-display text-[16px] tracking-[-0.2px] text-t-1"
					>
						{entry.word}
					</Typography>
					<Typography tag="span" className="text-[12.5px] text-t-2">
						{entry.translation}
					</Typography>
					{entry.lemma?.partOfSpeech ? (
						<Typography tag="span" className="text-[10.5px] italic text-t-3">
							{entry.lemma.partOfSpeech}
						</Typography>
					) : null}
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					{sourceTitle ? (
						<Typography tag="span" className="text-[11px] text-t-3">
							{t("vocabulary.card.from", { title: sourceTitle })}
						</Typography>
					) : null}
					{sourceTitle ? (
						<span aria-hidden="true" className="size-[2px] rounded-full bg-t-4" />
					) : null}
					<Typography tag="span" className="text-[11px] text-t-3">
						{getMetaSecondary(entry, t)}
					</Typography>
				</div>

				{expanded ? (
					<div className="mt-2.5 border-t border-hairline border-bd-1 pt-2.5">
						<div className="flex flex-col gap-3.5 md:flex-row md:gap-5">
							<div className="min-w-0 flex-1">
								{example ? (
									<>
										<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
											{t("vocabulary.card.example")}
										</div>
										<Typography className="mb-[3px] text-[12.5px] italic leading-[1.55] text-t-1">
											«{example.text}»
										</Typography>
										<Typography className="mb-2.5 text-xs text-t-3">
											{example.translation}
										</Typography>
									</>
								) : null}
								{forms.length > 0 ? (
									<>
										<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
											{t("vocabulary.card.forms")}
										</div>
										<div className="flex flex-wrap gap-1">
											{forms.map((f, idx) => (
												<Typography
													tag="span"
													key={`${f.form}-${idx}`}
													className="rounded-[5px] border-hairline border-bd-1 bg-surf-2 px-[7px] py-[2px] text-[11px] text-t-2"
												>
													{f.form}
												</Typography>
											))}
										</div>
									</>
								) : null}
							</div>

							<div className="w-full md:w-[160px] md:shrink-0">
								<StatusButtons
									wordId={entry.id}
									current={entry.learningLevel}
								/>
								<Typography className="mb-1.5 text-[11px] text-t-3">
									{t("vocabulary.card.nextReview")}{" "}
									<Typography tag="strong" className="text-t-2">
										{entry.nextReview
											? formatNextReview(entry.nextReview, t, lang)
											: t("vocabulary.review.notScheduled")}
									</Typography>
								</Typography>
								<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
									{t("vocabulary.card.folder")}
								</div>
								<FolderSelect
									wordId={entry.id}
									currentFolderId={entry.folderId}
								/>
								<div className="mt-2">
									<DeleteWordButton
										wordId={entry.id}
										word={entry.word}
										className="w-full"
									/>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</div>

			<div className="flex shrink-0 items-center gap-[7px]">
				<StatusBadge status={entry.learningLevel} />
				{entry.learningLevel !== "NEW" ? (
					<Sm2Bar
						percent={entry.progressPercent}
						status={entry.learningLevel}
						className="max-[380px]:hidden"
					/>
				) : null}
				{entry.cefrLevel ? <CefrBadge level={entry.cefrLevel} /> : null}
			</div>
		</article>
	);
};
