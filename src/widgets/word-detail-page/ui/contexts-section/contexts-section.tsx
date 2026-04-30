"use client";

import Link from "next/link";
import type { DetailWordContext } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { CardSection } from "../card-section";

export interface ContextsSectionProps {
	contexts: DetailWordContext[];
	word: string;
	lang: string;
	allHref?: string;
}

const renderHighlighted = (snippet: string, word: string) => {
	if (!word) return snippet;
	const parts = snippet.split(new RegExp(`(${escapeRegExp(word)})`, "iu"));
	return parts.map((part, idx) =>
		part.toLowerCase() === word.toLowerCase() ? (
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

const escapeRegExp = (s: string): string =>
	s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const ContextsSection = ({
	contexts,
	word,
	lang,
	allHref,
}: ContextsSectionProps) => {
	const { t } = useI18n();

	if (contexts.length === 0) {
		return (
			<CardSection title={t("vocabulary.wordDetail.sections.contexts")}>
				<p className="text-[12.5px] text-t-3">
					{t("vocabulary.wordDetail.contexts.empty")}
				</p>
			</CardSection>
		);
	}

	return (
		<CardSection
			title={t("vocabulary.wordDetail.sections.contexts")}
			rightSlot={
				allHref ? (
					<Link
						href={allHref}
						className="border-0 bg-transparent p-0 text-[11.5px] text-acc font-[inherit] hover:underline"
					>
						{t("vocabulary.wordDetail.sections.contextsAll")}
					</Link>
				) : undefined
			}
		>
			<ul className="flex flex-col gap-1.5">
				{contexts.map((ctx) => (
					<li key={ctx.id}>
						<Link
							href={`/${lang}/reader/${ctx.text.id}`}
							className="block rounded-[8px] border-hairline border-bd-1 bg-surf-2 px-3 py-2.5 transition-colors duration-150 hover:border-bd-2"
						>
							<p className="mb-1 text-[13px] leading-[1.6] text-t-2">
								«{ctx.snippet ? renderHighlighted(ctx.snippet, word) : word}»
							</p>
							<p className="text-[11px] text-t-3">
								{ctx.text.title}
								{ctx.text.level ? ` · ${ctx.text.level}` : ""}
							</p>
						</Link>
					</li>
				))}
			</ul>
		</CardSection>
	);
};
