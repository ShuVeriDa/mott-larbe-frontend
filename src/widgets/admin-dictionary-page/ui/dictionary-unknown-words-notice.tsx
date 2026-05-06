import Link from "next/link";

interface DictionaryUnknownWordsNoticeProps {
	count: number;
	lang: string;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const DictionaryUnknownWordsNotice = ({
	count,
	lang,
	t,
}: DictionaryUnknownWordsNoticeProps) => {
	if (count === 0) return null;

	return (
		<div className="mb-4 flex items-center gap-3 rounded-[10px] border border-amber-500/30 bg-amber-500/8 px-4 py-3">
			<svg className="size-4 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="currentColor">
				<path d="M8 1.333A6.667 6.667 0 1 0 8 14.667 6.667 6.667 0 0 0 8 1.333Zm.667 10H7.333V9.333h1.334V11.333Zm0-4H7.333v-4h1.334v4Z"/>
			</svg>
			<p className="flex-1 text-[12.5px] text-t-2">
				<span className="font-semibold text-t-1">{count}</span>{" "}
				{t("admin.dictionary.notice.unknownWords")}
			</p>
			<Link
				href={`/${lang}/admin/unknown-words`}
				className="shrink-0 text-[12px] font-medium text-acc hover:underline"
			>
				{t("admin.dictionary.notice.review")}
			</Link>
		</div>
	);
};
