import type { CefrLevel } from "@/shared/types";
import type { LibraryTextLanguage } from "@/entities/library-text";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

interface TextInfoCardProps {
	level: CefrLevel | null;
	language: LibraryTextLanguage;
	author: string | null;
	source: string | null;
	publishedAt: string | null;
	totalPages: number;
	wordCount: number;
	lang: string;
	t: Translator;
}

const formatPublishedDate = (iso: string | null, lang: string) => {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString(
		lang === "che" || lang === "ru" ? "ru-RU" : "en-US",
		{ day: "numeric", month: "short", year: "numeric" },
	);
};

export const TextInfoCard = ({
	level,
	language,
	author,
	source,
	publishedAt,
	totalPages,
	wordCount,
	lang,
	t,
}: TextInfoCardProps) => {
	const rows: { label: string; value: string }[] = [
		{
			label: t("library.textDetail.info.level"),
			value: level ? t(`library.textDetail.level.${level}`) : "—",
		},
		{
			label: t("library.textDetail.info.language"),
			value: t(`library.textDetail.lang.${language}`),
		},
		{
			label: t("library.textDetail.info.author"),
			value: author ?? t("library.textDetail.info.noAuthor"),
		},
		{
			label: t("library.textDetail.info.source"),
			value: source ?? t("library.textDetail.info.noSource"),
		},
		{
			label: t("library.textDetail.info.added"),
			value: formatPublishedDate(publishedAt, lang),
		},
		{
			label: t("library.textDetail.info.pages"),
			value: `${totalPages} / ${wordCount.toLocaleString()} ${t("library.card.wordsUnit")}`,
		},
	];

	return (
		<div className="bg-surf border border-bd-1 rounded-card px-[17px] py-[15px]">
			<p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-t-3 mb-3">
				{t("library.textDetail.info.label")}
			</p>
			<div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
				{rows.map(({ label, value }) => (
					<div key={label} className="flex flex-col gap-0.5">
						<span className="text-[11px] text-t-3">{label}</span>
						<span className="text-[13px] font-medium text-t-1 truncate">{value}</span>
					</div>
				))}
			</div>
		</div>
	);
};
