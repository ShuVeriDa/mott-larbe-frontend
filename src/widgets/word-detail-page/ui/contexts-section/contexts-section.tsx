"use client";

import { useState } from "react";
import Link from "next/link";
import type { DetailWordContext } from "@/entities/dictionary";
import { useDictionaryWordContexts } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { CardSection } from "../card-section";

export interface ContextsSectionProps {
	contexts: DetailWordContext[];
	word: string;
	morphForms?: string[];
	lemmaId?: string;
	lang: string;
}

const escapeRegExp = (s: string): string =>
	s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildPattern = (word: string, morphForms: string[]): RegExp => {
	const terms = [word, ...morphForms].filter(Boolean);
	const escaped = terms.map(escapeRegExp).join("|");
	return new RegExp(`(${escaped})`, "iu");
};

const renderHighlighted = (snippet: string, pattern: RegExp) => {
	const parts = snippet.split(pattern);
	return parts.map((part, idx) =>
		pattern.test(part) ? (
			<mark
				key={idx}
				className="rounded-[3px] bg-acc-bg px-0.5 text-acc-t"
			>
				{part}
			</mark>
		) : (
			<span key={idx}>{part}</span>
		),
	);
};

const ContextItem = ({
	ctx,
	pattern,
	lang,
}: {
	ctx: DetailWordContext;
	pattern: RegExp;
	lang: string;
}) => (
	<li>
		<Link
			href={`/${lang}/reader/${ctx.text.id}`}
			className="block rounded-[8px] border-hairline border-bd-1 bg-surf-2 px-3 py-2.5 transition-colors duration-150 hover:border-bd-2"
		>
			<p className="mb-1 text-[13px] leading-[1.6] text-t-2">
				«{ctx.snippet ? renderHighlighted(ctx.snippet, pattern) : pattern.source}»
			</p>
			<p className="text-[11px] text-t-3">
				{ctx.text.title}
				{ctx.text.level ? ` · ${ctx.text.level}` : ""}
			</p>
		</Link>
	</li>
);

export const ContextsSection = ({
	contexts,
	word,
	morphForms = [],
	lemmaId,
	lang,
}: ContextsSectionProps) => {
	const { t } = useI18n();
	const [expanded, setExpanded] = useState(false);
	const { data: allContexts, isFetching } = useDictionaryWordContexts(
		expanded ? lemmaId : null,
	);

	const pattern = buildPattern(word, morphForms);
	const displayed = expanded && allContexts ? allContexts : contexts;

	if (contexts.length === 0) {
		return (
			<CardSection title={t("vocabulary.wordDetail.sections.contexts")}>
				<p className="text-[12.5px] text-t-3">
					{t("vocabulary.wordDetail.contexts.empty")}
				</p>
			</CardSection>
		);
	}

		const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => setExpanded(true);
return (
		<CardSection
			title={t("vocabulary.wordDetail.sections.contexts")}
			rightSlot={
				lemmaId && !expanded ? (
					<button
						type="button"
						onClick={handleClick}
						className="border-0 bg-transparent p-0 text-[11.5px] text-acc font-[inherit] hover:underline"
					>
						{isFetching
							? "…"
							: t("vocabulary.wordDetail.sections.contextsAll")}
					</button>
				) : undefined
			}
		>
			<ul className="flex flex-col gap-1.5">
				{displayed.map((ctx) => (
					<ContextItem key={ctx.id} ctx={ctx} pattern={pattern} lang={lang} />
				))}
			</ul>
		</CardSection>
	);
};
