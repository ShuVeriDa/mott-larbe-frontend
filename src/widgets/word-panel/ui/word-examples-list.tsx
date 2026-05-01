"use client";

import { useWordExamples, type WordLookupExample } from "@/entities/word";
import { useI18n } from "@/shared/lib/i18n";

export interface WordExamplesListProps {
	lemmaId: string;
	fallback: readonly WordLookupExample[];
	highlight: string;
}

export const WordExamplesList = ({
	lemmaId,
	fallback,
	highlight,
}: WordExamplesListProps) => {
	const { t } = useI18n();
	const { data, isLoading } = useWordExamples(lemmaId);

	const examples = (data && data.length > 0)
		? data.map((d) => ({ text: d.snippet, translation: d.textTitle }))
		: fallback.map((e) => ({ text: e.text, translation: e.translation }));

	if (!examples.length && !isLoading) return null;

	return (
		<div className="space-y-2.5">
			{isLoading && examples.length === 0 ? (
				<p className="text-[12px] text-t-3">{t("reader.panel.examplesLoading")}</p>
			) : null}
			{examples.map((example, idx) => (
				<div key={idx}>
					<div
						className="text-[13px] leading-[1.6] text-t-1"
						dangerouslySetInnerHTML={{
							__html: example.text.replace(
								new RegExp(escapeRegExp(highlight), "gi"),
								(match) =>
									`<span class="text-acc font-medium">${match}</span>`,
							),
						}}
					/>
					{example.translation ? (
						<div className="text-[12px] italic text-t-3">
							{example.translation}
						</div>
					) : null}
				</div>
			))}
		</div>
	);
};

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
