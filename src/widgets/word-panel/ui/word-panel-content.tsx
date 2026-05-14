"use client";

import { Typography } from "@/shared/ui/typography";

import { ReactNode } from 'react';
import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupMeaning, type WordLookupGrammar, type WordLookupResponse } from "@/entities/word";
import { LearnStatusRow } from "@/features/learn-status";
import { useI18n } from "@/shared/lib/i18n";
import { AddToDictionaryButton } from "./add-to-dictionary-button";
import { WordExamplesList } from "./word-examples-list";
import { WordFormsChips } from "./word-forms-chips";
import { WordPanelLoader } from "./word-panel-loader";

export interface WordPanelContentProps {
	token: TextToken;
	textId: string;
}

const Section = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<div className="border-b border-hairline border-bd-1 px-4 py-3 last:border-b-0">
		<div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3">
			{title}
		</div>
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
	baseForm,
	tags,
	wordLevel,
	baseLabel,
}: {
	word: string;
	baseForm: string;
	tags: readonly string[];
	wordLevel: string | null;
	baseLabel: string;
}) => (
	<div className="border-b border-hairline border-bd-1 px-4 py-4">
		<div className="mb-1 flex items-start gap-2">
			<div className="font-display text-[22px] font-medium tracking-[-0.3px] text-t-1">
				{word}
			</div>
			{wordLevel ? (
				<Typography
					tag="span"
					className={`mt-1.5 shrink-0 rounded-[4px] border-hairline px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.4px] ${WORD_LEVEL_COLORS[wordLevel] ?? "bg-surf-2 text-t-3 border-bd-1"}`}
				>
					{wordLevel}
				</Typography>
			) : null}
		</div>
		<div className="mb-2 text-[12px] text-t-3">
			{baseLabel}: <Typography tag="strong" className="font-medium text-t-2">{baseForm}</Typography>
		</div>
		{tags.length > 0 ? (
			<div className="flex flex-wrap gap-1">
				{tags.map((tag) => (
					<Typography tag="span"
						key={tag}
						className="rounded-[5px] border-hairline border-bd-1 bg-surf-2 px-2 py-0.5 text-[10.5px] font-medium text-t-2"
					>
						{tag}
					</Typography>
				))}
			</div>
		) : null}
	</div>
);

const MeaningsList = ({ meanings }: { meanings: readonly WordLookupMeaning[] }) => (
	<div className="space-y-3">
		{meanings.map((meaning, idx) => (
			<div key={idx} className="flex gap-2">
				{meanings.length > 1 ? (
					<Typography tag="span" className="mt-0.5 shrink-0 text-[11px] font-semibold tabular-nums text-t-3">
						{idx + 1}.
					</Typography>
				) : null}
				<div className="flex-1">
					<div className="text-[14px] font-medium leading-snug text-t-1">
						{meaning.translation}
					</div>
					{meaning.note ? (
						<div className="mt-0.5 text-[12px] italic text-t-3">{meaning.note}</div>
					) : null}
					{meaning.examples.length > 0 ? (
						<div className="mt-1.5 space-y-1.5">
							{meaning.examples.map((ex, exIdx) => (
								<div key={exIdx}>
									<div className="text-[12.5px] leading-[1.55] text-t-2">{ex.text}</div>
									{ex.translation ? (
										<div className="text-[11.5px] italic text-t-3">{ex.translation}</div>
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
	genitive: "Род.",
	dative: "Дат.",
	ergative: "Эрг.",
	instrumental: "Инстр.",
	plural: "Мн.ч.",
	obliqueStem: "Косв.",
	verbPresent: "Наст.",
	verbPast: "Прош.",
	verbParticiple: "Прич.",
};

const GrammarFormsList = ({ forms }: { forms: WordLookupGrammar }) => {
	const entries = Object.entries(forms).filter(([, v]) => v != null && v !== "");
	if (!entries.length) return null;
	return (
		<div className="grid grid-cols-2 gap-x-3 gap-y-1">
			{entries.map(([key, value]) => (
				<div key={key} className="flex gap-1.5">
					<span className="shrink-0 text-[10.5px] text-t-3">{GRAMMAR_LABELS[key] ?? key}</span>
					<span className="text-[11.5px] text-t-1">{value}</span>
				</div>
			))}
		</div>
	);
};

const PanelBody = ({
	token,
	lookup,
	textId,
}: {
	token: TextToken;
	lookup: WordLookupResponse;
	textId: string;
}) => {
	const { t } = useI18n();

	return (
		<div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
			<PanelHeader
				word={token.original}
				baseForm={lookup.baseForm ?? token.original}
				tags={lookup.tags}
				wordLevel={lookup.wordLevel}
				baseLabel={t("reader.panel.baseForm")}
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

			{lookup.grammarForms ? (
				<Section title={t("reader.panel.sections.grammar")}>
					<GrammarFormsList forms={lookup.grammarForms} />
				</Section>
			) : lookup.grammar ? (
				<Section title={t("reader.panel.sections.grammar")}>
					<div className="text-[12.5px] leading-[1.55] text-t-2">{lookup.grammar}</div>
				</Section>
			) : null}

			{lookup.forms.length > 0 ? (
				<Section title={t("reader.panel.sections.forms")}>
					<WordFormsChips forms={lookup.forms} current={token.original} />
				</Section>
			) : null}

			{lookup.lemmaId ? (
				<Section title={t("reader.panel.sections.examples")}>
					<WordExamplesList
						lemmaId={lookup.lemmaId}
						fallback={lookup.meanings.flatMap((m) => m.examples)}
						highlight={token.original}
					/>
				</Section>
			) : null}

			{lookup.lemmaId ? (
				<Section title={t("reader.panel.sections.level")}>
					<div className="space-y-2.5">
						<LearnStatusRow
							lemmaId={lookup.lemmaId}
							tokenId={token.id}
							textId={textId}
							current={lookup.userStatus}
						/>
						<AddToDictionaryButton
							tokenId={token.id}
							inDictionary={lookup.inDictionary}
							dictionaryEntryId={lookup.dictionaryEntryId}
						/>
					</div>
				</Section>
			) : null}
		</div>
	);
};

export const WordPanelContent = ({ token, textId }: WordPanelContentProps) => {
	const { data, isLoading, isError } = useWordLookup(token.id);
	const { t } = useI18n();

	if (isLoading) return <WordPanelLoader />;
	if (isError || !data) {
		return (
			<div className="flex flex-1 items-center justify-center p-6 text-center text-[12px] text-red">
				{t("reader.panel.error")}
			</div>
		);
	}

	return <PanelBody token={token} lookup={data} textId={textId} />;
};
