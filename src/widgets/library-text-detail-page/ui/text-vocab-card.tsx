import type { LibraryTextWordStats } from "@/entities/library-text";
import { Typography } from "@/shared/ui/typography";
import { VocabStat } from "./vocab-stat";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

interface TextVocabCardProps {
	wordStats: LibraryTextWordStats;
	t: Translator;
}

export const TextVocabCard = ({ wordStats, t }: TextVocabCardProps) => {
	const { total, known, learning } = wordStats;
	const knownPct = total > 0 ? (known / total) * 100 : 0;
	const learningPct = total > 0 ? (learning / total) * 100 : 0;

	return (
		<div className="bg-surf border border-bd-1 rounded-card px-[17px] py-[15px]">
			<Typography tag="h2" className="text-[10px] font-semibold tracking-widest uppercase text-t-3 mb-3">
				{t("library.textDetail.vocab.label")}
			</Typography>

			<div className="flex gap-2 mb-2.5">
				<VocabStat
					dotClass="bg-grn"
					value={known}
					label={t("library.textDetail.vocab.known")}
				/>
				<VocabStat
					dotClass="bg-amb"
					value={learning}
					label={t("library.textDetail.vocab.learning")}
				/>
				<VocabStat
					dotClass="bg-t-4"
					value={wordStats.new}
					label={t("library.textDetail.vocab.new")}
				/>
			</div>

			<Typography tag="p" className="text-[11px] text-t-3 mb-2">
				{t("library.textDetail.vocab.unique", { count: total })}
			</Typography>

			<div className="h-1 bg-surf-3 rounded-full overflow-hidden flex">
				<div
					className="h-full bg-grn"
					style={{ width: `${knownPct}%` }}
				/>
				<div
					className="h-full bg-amb"
					style={{ width: `${learningPct}%` }}
				/>
			</div>
		</div>
	);
};

