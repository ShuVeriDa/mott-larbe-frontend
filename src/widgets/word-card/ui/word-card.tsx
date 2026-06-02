"use client";

import {
	CefrBadge,
	Sm2Bar,
	StatusBadge,
	StatusDot,
	type DictionaryEntry,
} from "@/entities/dictionary";
import { DeleteWordButton } from "@/features/delete-word";
import { FolderSelect, StatusButtons } from "@/features/update-word";
import { cn } from "@/shared/lib/cn";
import {
	formatNextReview,
	formatRelativeFromNow,
	formatReviewIn,
} from "@/shared/lib/format-relative-time";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ComponentProps, MouseEvent } from "react";

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
	const example =
		entry.lemma?.headwords?.[0]?.entry?.senses?.[0]?.examples?.[0];
	const forms = entry.lemma?.morphForms ?? [];

	const handleKeyDown: NonNullable<
		ComponentProps<"article">["onKeyDown"]
	> = e => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onToggle();
		}
	};

	const handleDetailClick = (e: MouseEvent) => {
		e.stopPropagation();
	};
	return (
		<article
			role="button"
			tabIndex={0}
			aria-expanded={expanded}
			onClick={onToggle}
			onKeyDown={handleKeyDown}
			className={cn(
				"relative flex cursor-pointer gap-3 rounded-card border-[0.5px] border-bd-1 bg-surf p-[11px_14px]",
				expanded ? "items-start" : "items-center",
				"transition-[border-color,box-shadow] duration-100",
				"hover:border-bd-2 hover:shadow-sm",
				"outline-none focus-visible:border-acc focus-visible:shadow-[0_0_0_2px_var(--acc-bg)]",
				expanded && "border-acc shadow-[0_0_0_2px_var(--acc-bg)]",
			)}
		>
			<StatusDot
				status={entry.learningLevel}
				className={cn("shrink-0 size-[6px]", expanded ? "mt-[5px]" : "mt-px")}
			/>

			<div className="flex min-w-0 flex-1 flex-col">
				{/* Шапка: слово + кнопка детали (при expanded) */}
				<div className={cn("mb-[3px] flex items-start gap-2", expanded && "pr-8")}>
					<div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-2">
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
				</div>

				<div className="flex flex-wrap items-center gap-1.5">
					{sourceTitle ? (
						<Typography tag="span" className="text-[11px] text-t-3">
							{t("vocabulary.card.from", { title: sourceTitle })}
						</Typography>
					) : null}
					{sourceTitle ? (
						<Typography
							tag="span"
							aria-hidden="true"
							className="size-[2px] rounded-full bg-t-4"
						/>
					) : null}
					<Typography tag="span" className="text-[11px] text-t-3">
						{getMetaSecondary(entry, t)}
					</Typography>
				</div>

				{expanded ? (
					<div className="mt-3 border-t-[0.5px] border-bd-1 pt-3">
						<div className="flex flex-col gap-4 sm:flex-row sm:gap-5">

							{/* Левая колонка: пример + формы */}
							{(example || forms.length > 0) ? (
								<div className="flex min-w-0 flex-1 flex-col gap-3">
									{example ? (
										<div>
											<div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
												{t("vocabulary.card.example")}
											</div>
											<blockquote className="border-l-2 border-acc/30 pl-2.5">
												<Typography className="text-[12.5px] italic leading-[1.6] text-t-1">
													{example.text}
												</Typography>
												{example.translation ? (
													<Typography className="mt-0.5 text-[11.5px] text-t-3">
														{example.translation}
													</Typography>
												) : null}
											</blockquote>
										</div>
									) : null}
									{forms.length > 0 ? (
										<div>
											<div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
												{t("vocabulary.card.forms")}
											</div>
											<div className="flex flex-wrap gap-1">
												{forms.map((f, idx) => (
													<Typography
														tag="span"
														key={`${f.form}-${idx}`}
														className="rounded-[5px] border-[0.5px] border-bd-1 bg-surf-2 px-[7px] py-[3px] text-[11px] text-t-2"
													>
														{f.form}
													</Typography>
												))}
											</div>
										</div>
									) : null}
								</div>
							) : null}

							{/* Правая колонка: управление */}
							<div className={cn(
								"flex shrink-0 flex-col gap-2.5 sm:w-[190px]",
								!(example || forms.length > 0) && "flex-1",
							)}>
								{/* Статус */}
								<div>
									<div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
										{t("vocabulary.card.status")}
									</div>
									<StatusButtons wordId={entry.id} current={entry.learningLevel} />
									{entry.learningLevel !== "NEW" ? (
										<div className="mt-1.5 flex items-center gap-2">
											<Sm2Bar
												percent={entry.progressPercent}
												status={entry.learningLevel}
												className="flex-1"
											/>
											{entry.cefrLevel ? <CefrBadge level={entry.cefrLevel} /> : null}
										</div>
									) : entry.cefrLevel ? (
										<div className="mt-1.5">
											<CefrBadge level={entry.cefrLevel} />
										</div>
									) : null}
								</div>

								{/* Следующее повторение */}
								<div className="flex items-center justify-between rounded-md bg-surf-2 px-2.5 py-1.5">
									<Typography className="text-[11px] text-t-3">
										{t("vocabulary.card.nextReview")}
									</Typography>
									<Typography tag="strong" className="text-[11px] font-medium text-t-2">
										{entry.nextReview
											? formatNextReview(entry.nextReview, t, lang)
											: t("vocabulary.review.notScheduled")}
									</Typography>
								</div>

								{/* Папка */}
								<div>
									<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
										{t("vocabulary.card.folder")}
									</div>
									<FolderSelect wordId={entry.id} currentFolderId={entry.folderId} />
								</div>

								{/* Удалить */}
								<DeleteWordButton wordId={entry.id} word={entry.word} className="w-full mt-0.5" />
							</div>
						</div>
					</div>
				) : null}
			</div>

			{/* Правый блок: бейджи (свёрнуто) или только иконка перехода (раскрыто — абсолютно) */}
			{!expanded ? (
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
					<Link
						href={`/${lang}/vocabulary/${entry.id}`}
						onClick={handleDetailClick}
						aria-label={t("vocabulary.card.openDetail")}
						title={t("vocabulary.card.openDetail")}
						className="text-t-4 transition-colors hover:text-t-1 focus-visible:outline-none focus-visible:text-acc"
					>
						<ExternalLink className="size-[13px]" strokeWidth={1.8} />
					</Link>
				</div>
			) : (
				<Link
					href={`/${lang}/vocabulary/${entry.id}`}
					onClick={handleDetailClick}
					aria-label={t("vocabulary.card.openDetail")}
					title={t("vocabulary.card.openDetail")}
					className={cn(
						"absolute right-[14px] top-[11px]",
						"flex items-center gap-1.5 rounded-md border-[0.5px] border-bd-2 bg-surf-2",
						"px-2 py-1 text-[11px] font-medium text-t-3",
						"transition-colors hover:border-acc/40 hover:bg-acc-bg hover:text-acc",
						"focus-visible:outline-none focus-visible:border-acc focus-visible:text-acc",
					)}
				>
					<ExternalLink className="size-[11px]" strokeWidth={2} />
					<span className="hidden sm:inline">{t("vocabulary.card.openDetail")}</span>
				</Link>
			)}
		</article>
	);
};
