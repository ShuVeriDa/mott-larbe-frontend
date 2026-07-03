"use client";

import { Typography } from "@/shared/ui/typography";
import { AdminCard } from "@/shared/ui/admin-card";
import { Badge } from "@/shared/ui/badge";
import { useI18n } from "@/shared/lib/i18n";
import { parseCorrectForm } from "@/entities/spelling-dictionary";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";

interface SpellingEntryHeaderCardProps {
	wrongForm: string;
	correctForm: string;
	matchType: SpellingMatchType;
	total: number;
	isLoading: boolean;
}

const MATCH_TYPE_LABEL_KEYS: Record<SpellingMatchType, string> = {
	substring: "admin.spellingDictionaryDetail.matchType.substring",
	whole_word: "admin.spellingDictionaryDetail.matchType.wholeWord",
	prefix: "admin.spellingDictionaryDetail.matchType.prefix",
	suffix: "admin.spellingDictionaryDetail.matchType.suffix",
};

const renderCorrectForm = (value: string) =>
	parseCorrectForm(value).map((node, i) =>
		node.superscript ? <sup key={i}>{node.text}</sup> : <span key={i}>{node.text}</span>,
	);

export const SpellingEntryHeaderCard = ({
	wrongForm,
	correctForm,
	matchType,
	total,
	isLoading,
}: SpellingEntryHeaderCardProps) => {
	const { t } = useI18n();

	return (
		<AdminCard className="px-4 py-3.5">
			<div className="flex flex-wrap items-center gap-3">
				<Typography tag="p" className="font-mono text-[15px] font-medium text-t-1">
					<span className="rounded-[5px] bg-red-bg px-1.5 py-0.5 text-red-t line-through">
						{wrongForm}
					</span>
					<span className="mx-1.5 text-t-3">→</span>
					<span className="rounded-[5px] bg-green-50 px-1.5 py-0.5 text-green-700">
						{renderCorrectForm(correctForm)}
					</span>
				</Typography>
				<Badge variant="neu">{t(MATCH_TYPE_LABEL_KEYS[matchType])}</Badge>
				{!isLoading && (
					<Typography tag="span" className="ml-auto text-[12px] text-t-3">
						{t("admin.spellingDictionaryDetail.occurrencesCount", { count: total })}
					</Typography>
				)}
			</div>
		</AdminCard>
	);
};
