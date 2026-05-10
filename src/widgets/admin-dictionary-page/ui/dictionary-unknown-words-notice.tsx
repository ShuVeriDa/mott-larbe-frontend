import Link from "next/link";

import { Typography } from "@/shared/ui/typography";
import { AlertCircle } from "lucide-react";
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
			<AlertCircle className="size-4 shrink-0 text-amber-500" />
			<Typography tag="p" className="flex-1 text-[12.5px] text-t-2">
				<Typography tag="span" className="font-semibold text-t-1">{count}</Typography>{" "}
				{t("admin.dictionary.notice.unknownWords")}
			</Typography>
			<Link
				href={`/${lang}/admin/unknown-words`}
				className="shrink-0 text-[12px] font-medium text-acc hover:underline"
			>
				{t("admin.dictionary.notice.review")}
			</Link>
		</div>
	);
};
