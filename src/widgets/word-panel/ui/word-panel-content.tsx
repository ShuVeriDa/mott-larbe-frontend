"use client";

import { ReactNode } from 'react';
import type { TextToken } from "@/entities/text";
import { useWordLookup, type WordLookupResponse } from "@/entities/word";
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

const PanelHeader = ({
	word,
	baseForm,
	tags,
	baseLabel,
}: {
	word: string;
	baseForm: string;
	tags: readonly string[];
	baseLabel: string;
}) => (
	<div className="border-b border-hairline border-bd-1 px-4 py-4">
		<div className="mb-1 font-display text-[22px] font-medium tracking-[-0.3px] text-t-1">
			{word}
		</div>
		<div className="mb-2 text-[12px] text-t-3">
			{baseLabel}: <strong className="font-medium text-t-2">{baseForm}</strong>
		</div>
		{tags.length > 0 ? (
			<div className="flex flex-wrap gap-1">
				{tags.map((tag) => (
					<span
						key={tag}
						className="rounded-[5px] border-hairline border-bd-1 bg-surf-2 px-2 py-0.5 text-[10.5px] font-medium text-t-2"
					>
						{tag}
					</span>
				))}
			</div>
		) : null}
	</div>
);

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
				word={token.text}
				baseForm={lookup.baseForm}
				tags={lookup.tags}
				baseLabel={t("reader.panel.baseForm")}
			/>
			<Section title={t("reader.panel.sections.translation")}>
				<div className="mb-1.5 text-[15px] font-medium text-t-1">
					{lookup.translation}
				</div>
				{lookup.tranAlt ? (
					<div className="text-[12.5px] leading-[1.55] text-t-2">
						{lookup.tranAlt}
					</div>
				) : null}
			</Section>

			{lookup.grammar ? (
				<Section title={t("reader.panel.sections.grammar")}>
					<div className="text-[12.5px] leading-[1.55] text-t-2">
						{lookup.grammar}
					</div>
				</Section>
			) : null}

			{lookup.forms.length > 0 ? (
				<Section title={t("reader.panel.sections.forms")}>
					<WordFormsChips forms={lookup.forms} current={token.text} />
				</Section>
			) : null}

			<Section title={t("reader.panel.sections.examples")}>
				<WordExamplesList
					lemmaId={lookup.lemmaId}
					fallback={lookup.examples}
					highlight={token.text}
				/>
			</Section>

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
