"use client";

import { usePhrasebookCategories, type PhraseDue, type PhraseReviewStats } from "@/entities/phrasebook";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { PhraseReviewMode } from "../model";

interface PhraseReviewIntroProps {
	stats: PhraseReviewStats | undefined;
	queue: PhraseDue[];
	loading: boolean;
	error: boolean;
	mode: PhraseReviewMode;
	selectedCategoryId: string | undefined;
	onModeChange: (mode: PhraseReviewMode) => void;
	onCategoryChange: (id: string | undefined) => void;
	onStart: () => void;
}

const QUEUE_PREVIEW = 4;

const statusDotClass = (status: string) => {
	switch (status) {
		case "LEARNING": return "bg-amb";
		case "KNOWN": return "bg-grn";
		default: return "bg-acc";
	}
};

export const PhraseReviewIntro = ({
	stats,
	queue,
	loading,
	error,
	mode,
	selectedCategoryId,
	onModeChange,
	onCategoryChange,
	onStart,
}: PhraseReviewIntroProps) => {
	const { t } = useI18n();
	const dueCount = stats?.dueCount ?? 0;
	const learningCount = stats?.learningCount ?? 0;
	const knownCount = stats?.knownCount ?? 0;
	const streak = stats?.streak ?? 0;
	const remainder = Math.max(queue.length - QUEUE_PREVIEW, 0);

	return (
		<section
			className="flex flex-1 flex-col items-center justify-center px-6 py-8 max-md:justify-start max-md:px-4 max-md:pt-6"
			aria-busy={loading}
		>
			<div className="mb-5 flex gap-2 max-md:w-full">
				<StatBox value={dueCount} label={t("phrasebook.review.intro.stats.due")} tone="amb" />
				<StatBox value={learningCount} label={t("phrasebook.review.intro.stats.learning")} tone="grn" />
				<StatBox
					value={knownCount}
					label={t("phrasebook.review.intro.stats.known")}
					tone="acc"
					hint={t("phrasebook.review.intro.stats.knownHint")}
				/>
			</div>

			<Typography
				tag="h1"
				className="mb-1.5 text-center font-display text-[21px] font-normal text-t-1"
			>
				{t("phrasebook.review.intro.title")}
			</Typography>

			<ModePicker
				mode={mode}
				selectedCategoryId={selectedCategoryId}
				onModeChange={onModeChange}
				onCategoryChange={onCategoryChange}
			/>

			<Typography className="mb-5 mt-3 max-w-[340px] text-center text-[13px] leading-[1.6] text-t-3">
				{loading
					? t("phrasebook.review.intro.loading")
					: error
						? t("phrasebook.review.intro.error")
						: queue.length === 0
							? t("phrasebook.review.intro.empty")
							: mode === "category"
								? t("phrasebook.review.intro.subtitleCategory", { count: queue.length })
								: mode === "saved"
									? t("phrasebook.review.intro.subtitleSaved", { count: queue.length })
									: t("phrasebook.review.intro.subtitle", { count: queue.length })}
			</Typography>

			<Button
				variant="action"
				size="lg"
				onClick={onStart}
				disabled={loading || queue.length === 0}
			>
				{t("phrasebook.review.startReview")}
			</Button>

			{queue.length > 0 ? (
				<div className="mt-5 w-full max-w-[420px] border-t border-bd-1 pt-4 max-md:max-w-full">
					<Typography className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("phrasebook.review.intro.queue.title")}
					</Typography>
					<ul className="flex flex-col gap-1">
						{queue.slice(0, QUEUE_PREVIEW).map((phrase) => (
							<li
								key={phrase.id}
								className="flex items-center gap-2.5 rounded-base border-[0.5px] border-bd-1 bg-surf px-3 py-2"
							>
								<span
									aria-hidden="true"
									className={`size-1.5 shrink-0 rounded-full ${statusDotClass(phrase.status)}`}
								/>
								<Typography
									tag="span"
									className="flex-1 truncate text-[13px] font-medium text-t-1"
								>
									{phrase.original}
								</Typography>
								<Typography tag="span" className="max-w-[40%] shrink truncate text-[12px] text-t-3">
									{phrase.translation}
								</Typography>
							</li>
						))}
					</ul>
					{remainder > 0 ? (
						<Typography className="mt-1.5 text-center text-[11.5px] text-t-3">
							{t("phrasebook.review.intro.queue.more", { count: remainder })}
						</Typography>
					) : null}
				</div>
			) : null}
		</section>
	);
};

interface ModePickerProps {
	mode: PhraseReviewMode;
	selectedCategoryId: string | undefined;
	onModeChange: (mode: PhraseReviewMode) => void;
	onCategoryChange: (id: string | undefined) => void;
}

const ModePicker = ({ mode, selectedCategoryId, onModeChange, onCategoryChange }: ModePickerProps) => {
	const { t } = useI18n();
	const { data: categories } = usePhrasebookCategories();

	const handleAll = () => {
		onModeChange("all");
		onCategoryChange(undefined);
	};
	const handleCategory = () => {
		onModeChange("category");
		if (!selectedCategoryId && categories?.[0]) {
			onCategoryChange(categories[0].id);
		}
	};
	const handleSaved = () => {
		onModeChange("saved");
		onCategoryChange(undefined);
	};

	return (
		<div className="flex w-full max-w-[340px] flex-col items-center gap-2 max-md:max-w-full">
			<div className="flex w-full gap-1 rounded-base border-[0.5px] border-bd-2 bg-surf-2 p-0.5">
				<ModeTab
					label={t("phrasebook.review.startReview")}
					shortLabel={t("phrasebook.review.startReviewShort")}
					active={mode === "all"}
					onClick={handleAll}
				/>
				<ModeTab
					label={t("phrasebook.review.startCategory")}
					shortLabel={t("phrasebook.review.startCategoryShort")}
					active={mode === "category"}
					onClick={handleCategory}
				/>
				<ModeTab
					label={t("phrasebook.review.startSaved")}
					shortLabel={t("phrasebook.review.startSavedShort")}
					active={mode === "saved"}
					onClick={handleSaved}
				/>
			</div>

			{mode === "category" && categories && categories.length > 0 ? (
				<select
					value={selectedCategoryId ?? ""}
					onChange={(e) => onCategoryChange(e.currentTarget.value || undefined)}
					className="w-full rounded-base border-[0.5px] border-bd-2 bg-surf px-3 py-2 text-[13px] text-t-1 cursor-pointer outline-none focus:border-acc"
				>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.emoji} {cat.name} ({cat.phraseCount})
						</option>
					))}
				</select>
			) : null}
		</div>
	);
};

interface ModeTabProps {
	label: string;
	shortLabel: string;
	active: boolean;
	onClick: () => void;
}

const ModeTab = ({ label, shortLabel, active, onClick }: ModeTabProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"min-w-0 flex-1 rounded-[6px] px-1.5 py-1.5 text-[11.5px] font-medium transition-colors duration-150 cursor-pointer border-0 leading-tight text-center",
			active
				? "bg-surf font-semibold text-t-1 shadow-sm"
				: "bg-transparent text-t-3 hover:text-t-2",
		)}
	>
		<span className="max-md:hidden">{label}</span>
		<span className="md:hidden">{shortLabel}</span>
	</button>
);

interface StatBoxProps {
	value: number;
	label: string;
	tone: "amb" | "acc" | "grn";
	hint?: string;
}

const toneClasses: Record<NonNullable<StatBoxProps["tone"]>, string> = {
	amb: "text-amb",
	acc: "text-acc",
	grn: "text-grn",
};

const StatBox = ({ value, label, tone, hint }: StatBoxProps) => (
	<div
		title={hint}
		className="min-w-0 flex-1 rounded-card border-[0.5px] border-bd-2 bg-surf px-3 py-3 text-center shadow-sm md:min-w-[80px] md:flex-none md:px-4"
	>
		<div className={`font-display text-[22px] font-semibold leading-[1.1] tabular-nums max-md:text-[20px] ${toneClasses[tone]}`}>
			{value}
		</div>
		<div className="mt-1 flex items-center justify-center gap-0.5 text-[11px] text-t-3">
			{label}
			{hint ? (
				<svg viewBox="0 0 12 12" fill="none" className="size-3 shrink-0 text-t-4 opacity-60">
					<circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.1" />
					<path d="M6 5.5v3M6 4h.01" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
				</svg>
			) : null}
		</div>
	</div>
);
