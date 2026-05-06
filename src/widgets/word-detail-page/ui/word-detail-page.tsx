"use client";

import { useDictionaryDetail } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { ContextsSection } from "./contexts-section";
import { HistoryCard } from "./history-card";
import { MorphologySection } from "./morphology-section";
import { RelatedSection } from "./related-section";
import { SensesSection } from "./senses-section";
import { Sm2Card } from "./sm2-card";
import { StatusCard } from "./status-card";
import { WordDetailTopbar } from "./word-detail-topbar";
import { WordHero } from "./word-hero";

export interface WordDetailPageProps {
	id: string;
}

export const WordDetailPage = ({ id }: WordDetailPageProps) => {
	const { t, lang } = useI18n();
	const { data, isLoading, isError } = useDictionaryDetail(id);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-10 text-sm text-t-3">
				{t("vocabulary.wordDetail.states.loading")}
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex flex-1 items-center justify-center p-10 text-sm text-red">
				{t("vocabulary.wordDetail.states.error")}
			</div>
		);
	}

	return (
		<>
			<WordDetailTopbar entry={data} />

			<article
				className="flex-1 overflow-y-auto px-7 pt-6 pb-10 max-md:overflow-visible max-md:px-3.5 max-md:pt-3.5 max-md:pb-7 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4"
				aria-labelledby="word-hero-title"
			>
				<WordHero entry={data} />

				<div className="grid grid-cols-[1fr_280px] items-start gap-3.5 max-lg:grid-cols-[1fr_240px] max-md:grid-cols-1 max-md:gap-0">
					<div className="min-w-0">
						<SensesSection senses={data.senses} />
						<MorphologySection
							forms={data.lemma?.morphForms ?? []}
							declensionClass={data.lemma?.declensionClass ?? null}
						/>
						<ContextsSection
							contexts={data.lemma?.wordContexts ?? []}
							word={data.word}
							morphForms={data.lemma?.morphForms.map((f) => f.form) ?? []}
							lemmaId={data.lemma?.id}
							lang={lang}
						/>
						<RelatedSection related={data.related} lang={lang} />
					</div>
					<aside className="min-w-0">
						<StatusCard
							wordId={data.id}
							learningLevel={data.learningLevel}
							folderId={data.folder?.id ?? null}
						/>
						<Sm2Card sm2={data.sm2} reviewHistory={data.reviewHistory} />
						<HistoryCard logs={data.reviewHistory.logs} />
					</aside>
				</div>
			</article>
		</>
	);
};
