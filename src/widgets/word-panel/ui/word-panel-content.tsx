"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";

import { useSettings } from "@/entities/settings";
import type { TextToken } from "@/entities/text";
import {
	useWordLookup,
	type WordLookupGrammar,
	type WordLookupMeaning,
	type WordLookupResponse,
} from "@/entities/word";
import { EntrySuggestModal } from "@/features/entry-suggest";
import { LearnStatusRow } from "@/features/learn-status";
import { useWordLookupStore } from "@/features/word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Pencil } from "lucide-react";
import { ReactNode, useState } from "react";
import { AiWordPanelBody } from "./ai-word-panel-body";
import { AddToDictionaryButton } from "./add-to-dictionary-button";
import { WordExamplesList } from "./word-examples-list";
import { WordFormsChips } from "./word-forms-chips";
import { WordPanelLoader } from "./word-panel-loader";

export interface WordPanelContentProps {
	token: TextToken;
	textId: string;
	compact?: boolean;
}

const Section = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<div className="border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
		<SectionLabel>
			{title}
		</SectionLabel>
		{children}
	</div>
);

const WORD_LEVEL_COLORS: Record<string, string> = {
	A: "bg-grn/15 text-grn border-grn/30",
	B: "bg-acc/15 text-acc border-acc/30",
	C: "bg-red/15 text-red border-red/30",
};

const PanelHeader = ({
	word,
	wordModern,
	baseForm,
	wordLevel,
	grammar,
	nounClass,
	nounClassPlural,
	baseLabel,
	posLabel,
	nounClassLabel,
}: {
	word: string;
	wordModern: string | null;
	baseForm: string;
	wordLevel: string | null;
	grammar: string | null;
	nounClass: string | null;
	nounClassPlural: string | null;
	baseLabel: string;
	posLabel: string;
	nounClassLabel: string;
}) => {
	const { t } = useI18n();
	return (
		<div className="border-b-[0.5px] border-bd-1 px-4 py-4">
			<div className="mb-1 flex items-start gap-2">
				<div className="font-display text-[22px] font-medium tracking-[-0.3px] text-t-1">
					{word}
					{wordModern ? (
						<span className="ml-2 text-[15px] font-normal text-t-3">
							{wordModern}
						</span>
					) : null}
				</div>
				{wordLevel ? (
					<Typography
						tag="span"
						className={`mt-1.5 shrink-0 rounded-[4px] border-[0.5px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.4px] ${WORD_LEVEL_COLORS[wordLevel] ?? "bg-surf-2 text-t-3 border-bd-1"}`}
					>
						{wordLevel}
					</Typography>
				) : null}
			</div>
			<div className="mb-1 text-[12px] text-t-3">
				{baseLabel}:{" "}
				<Typography tag="strong" className="font-medium text-t-2">
					{baseForm}
				</Typography>
			</div>
			{grammar ? (() => {
				const key = grammar.replace(/\.$/, "");
				const nah = t(`posNah.${key}`);
				const label = t(`posLabel.${key}`);
				const display = nah !== `posNah.${key}`
					? `${nah} / ${label !== `posLabel.${key}` ? label : grammar}`
					: grammar;
				return (
					<div className="mb-1 text-[12px] text-t-3">
						{posLabel}:{" "}
						<span className="font-medium text-t-2">{display}</span>
					</div>
				);
			})() : null}
			{(nounClass ?? nounClassPlural) ? (
				<div className="text-[12px] text-t-3">
					{nounClassLabel}:{" "}
					<span className="font-medium text-t-2">
						{nounClass ?? "—"} / {nounClassPlural ?? "—"}
					</span>
				</div>
			) : null}
		</div>
	);
};

const MeaningsList = ({
	meanings,
}: {
	meanings: readonly WordLookupMeaning[];
}) => (
	<div className="space-y-3">
		{meanings.map((meaning, idx) => (
			<div key={idx} className="flex gap-2">
				{meanings.length > 1 ? (
					<Typography
						tag="span"
						className="mt-0.5 shrink-0 text-[11px] font-semibold tabular-nums text-t-3"
					>
						{idx + 1}.
					</Typography>
				) : null}
				<div className="flex-1">
					<div className="text-[14px] font-medium leading-snug text-t-1">
						{meaning.translation}
					</div>
					{meaning.note ? (
						<div className="mt-0.5 text-[12px] italic text-t-3">
							{meaning.note}
						</div>
					) : null}
					{meaning.examples.length > 0 ? (
						<div className="mt-1.5 space-y-1.5">
							{meaning.examples.map((ex, exIdx) => (
								<div key={exIdx}>
									<div className="text-[12.5px] leading-[1.55] text-t-2">
										{ex.text}
									</div>
									{ex.translation ? (
										<div className="text-[11.5px] italic text-t-3">
											{ex.translation}
										</div>
									) : null}
								</div>
							))}
						</div>
					) : null}
				</div>
			</div>
		))}
	</div>
);

const GRAMMAR_LABELS: Record<string, string> = {
	nominative: "ЦIерниг",
	genitive: "Доланиг",
	dative: "Лерг",
	ergative: "Дийриг",
	instrumental: "Коьчалниг",
	substantive: "Хотталург",
	locative: "Меттигниг",
	comparative: "Дустург",
	plural: "Мн.ч.",
	obliqueStem: "Косв.",
	verbPresent: "Наст.",
	verbPast: "Прош.",
	verbParticiple: "Прич.",
};

const GrammarFormsList = ({ forms }: { forms: WordLookupGrammar }) => {
	const entries = Object.entries(forms).filter(
		([k, v]) => v != null && v !== "" && k !== "pluralClass",
	);
	if (!entries.length) return null;
	return (
		<div className="grid grid-cols-2 gap-x-3 gap-y-1">
			{entries.map(([key, value]) => (
				<div key={key} className="flex gap-1.5">
					<Typography tag="span" className="shrink-0 text-[10.5px] text-t-3">
						{GRAMMAR_LABELS[key] ?? key}
					</Typography>
					<Typography tag="span" className="text-[11.5px] text-t-1">
						{value as string}
					</Typography>
				</div>
			))}
		</div>
	);
};

const PanelBody = ({
	token,
	lookup,
	textId,
	showGrammar,
	showExamples,
	compact = false,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	textId: string;
	showGrammar: boolean;
	showExamples: boolean;
	compact?: boolean;
}) => {
	const { t } = useI18n();
	const [suggestOpen, setSuggestOpen] = useState(false);

	const handleSuggestChange = (open: boolean) => setSuggestOpen(open);
	const handleSuggestOpen = () => setSuggestOpen(true);

	return (
		<div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
			<PanelHeader
				word={token.original}
				wordModern={lookup.wordModern ?? null}
				baseForm={lookup.baseForm ?? token.original}
				wordLevel={lookup.wordLevel}
				grammar={showGrammar ? lookup.grammar : null}
				nounClass={showGrammar ? lookup.nounClass : null}
				nounClassPlural={showGrammar ? lookup.nounClassPlural : null}
				baseLabel={t("reader.panel.baseForm")}
				posLabel={t("aiTranslation.popup.partOfSpeech")}
				nounClassLabel={t("reader.popup.nounClass")}
			/>
			<Section title={t("reader.panel.sections.translation")}>
				{lookup.meanings.length > 0 ? (
					<MeaningsList meanings={lookup.meanings} />
				) : (
					<>
						<div className="mb-1.5 text-[15px] font-medium text-t-1">
							{lookup.translation}
						</div>
						{lookup.tranAlt ? (
							<div className="text-[12.5px] leading-[1.55] text-t-2">
								{lookup.tranAlt}
							</div>
						) : null}
					</>
				)}
			</Section>

			{showGrammar && lookup.grammarForms ? (
				<Section title={t("reader.panel.sections.grammar")}>
					<GrammarFormsList forms={lookup.grammarForms} />
				</Section>
			) : showGrammar && lookup.grammar ? (
				<Section title={t("reader.panel.sections.grammar")}>
					<div className="text-[12.5px] leading-[1.55] text-t-2">
						{lookup.grammar}
					</div>
				</Section>
			) : null}

			{lookup.forms.length > 0 ? (
				<Section title={t("reader.panel.sections.forms")}>
					<WordFormsChips forms={lookup.forms} current={token.original} />
				</Section>
			) : null}

			{showExamples && lookup.lemmaId ? (
				<Section title={t("reader.panel.sections.examples")}>
					<WordExamplesList
						fallback={lookup.meanings.flatMap(m => m.examples)}
						highlight={token.original}
					/>
				</Section>
			) : null}

			{lookup.lemmaId ? (
				<Section title={t("reader.panel.sections.level")}>
					<div className={compact ? "space-y-2" : "space-y-2.5"}>
						<LearnStatusRow
							lemmaId={lookup.lemmaId}
							tokenId={token.id}
							textId={textId}
							current={lookup.userStatus}
							compact={compact}
						/>
						<AddToDictionaryButton
							tokenId={token.id}
							word={token.original}
							translation={lookup.translation}
							inDictionary={lookup.inDictionary}
							dictionaryEntryId={lookup.dictionaryEntryId}
							currentFolderId={lookup.dictionaryFolder?.id ?? null}
							currentFolderName={lookup.dictionaryFolder?.name ?? null}
							className={compact ? "h-8 text-[12px]" : undefined}
						/>
						<Button
							onClick={handleSuggestOpen}
							variant="ghost"
							className={cn(
								"flex w-full items-center justify-center gap-1.5 text-t-3",
								compact ? "h-7 text-[11.5px]" : "text-[12px]",
							)}
							title={t("suggest.button")}
						>
							<Pencil className="size-3" strokeWidth={1.5} />
							{t("suggest.button")}
						</Button>
					</div>
				</Section>
			) : null}
			<EntrySuggestModal
				open={suggestOpen}
				onOpenChange={handleSuggestChange}
				normalized={token.normalized}
				rawWord={token.original}
				currentTranslation={lookup.translation ?? ""}
			/>
		</div>
	);
};

export const WordPanelContent = ({ token, textId, compact = false }: WordPanelContentProps) => {
	const { data, isLoading, isError } = useWordLookup(token.id);
	const { t, lang } = useI18n();
	const contextSentence = useWordLookupStore(s => s.contextSentence);
	const { data: settings } = useSettings();
	const showGrammar = settings?.preferences.showGrammar ?? true;
	const showExamples = settings?.preferences.showExamples ?? true;
	if (isLoading) return <WordPanelLoader />;
	if (isError || !data) {
		return (
			<div className="flex flex-1 items-center justify-center p-6 text-center text-[12px] text-red">
				{t("reader.panel.error")}
			</div>
		);
	}

	if (!data.translation) {
		return (
			<AiWordPanelBody
				word={token.original}
				normalized={token.normalized}
				contextSentence={contextSentence}
				lang={lang}
				tokenId={token.id}
				inDictionary={data.inDictionary}
				dictionaryEntryId={data.dictionaryEntryId}
				currentFolderId={data.dictionaryFolder?.id ?? null}
				currentFolderName={data.dictionaryFolder?.name ?? null}
			/>
		);
	}

	return <PanelBody token={token} lookup={data} textId={textId} showGrammar={showGrammar} showExamples={showExamples} compact={compact} />;
};
