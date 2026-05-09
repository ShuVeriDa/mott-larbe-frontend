import type { LibraryTextWordStats } from "@/entities/library-text";

import { Typography } from "@/shared/ui/typography";
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
			<Typography tag="p" className="text-[10px] font-semibold tracking-[0.1em] uppercase text-t-3 mb-3">
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

const VocabStat = ({
	dotClass,
	value,
	label,
}: {
	dotClass: string;
	value: number;
	label: string;
}) => (
	<div className="flex-1 flex flex-col items-center px-1 py-2.5 bg-surf-2 rounded-base">
		<Typography tag="span" className={`w-1.5 h-1.5 rounded-full mb-1.5 ${dotClass}`} />
		<Typography tag="span" className="font-display text-[20px] font-normal text-t-1 leading-none">
			{value}
		</Typography>
		<Typography tag="span" className="text-[10px] text-t-3 mt-0.5">{label}</Typography>
	</div>
);
