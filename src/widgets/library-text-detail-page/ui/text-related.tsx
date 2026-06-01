import type { LibraryRelatedText } from "@/entities/library-text";
import { CefrBadge } from "@/shared/ui/cefr-badge";
import Link from "next/link";
import { Typography } from "@/shared/ui/typography";
import { RelatedCover } from "./related-cover";

type Translator = (
	key: string,
	vars?: Record<string, string | number>,
) => string;

interface TextRelatedProps {
	items: LibraryRelatedText[];
	lang: string;
	t: Translator;
}

export const TextRelated = ({ items, lang, t }: TextRelatedProps) => {
	if (!items.length) return null;

	return (
		<div className="bg-surf border border-bd-1 rounded-card px-[17px] py-[15px] animate-[fadeUp_0.3s_0.15s_ease_both]">
			<Typography
				tag="h2"
				className="text-[10px] font-semibold tracking-widest uppercase text-t-3 mb-3"
			>
				{t("library.textDetail.related.label")}
			</Typography>
			<div className="flex flex-col gap-1">
				{items.map(item => (
					<Link
						key={item.id}
						href={`/${lang}/texts/${item.id}`}
						className="flex items-center gap-2.5 px-2 py-2 rounded-base hover:bg-surf-2 transition-colors group"
					>
						<RelatedCover level={item.level} />
						<div className="flex-1 min-w-0">
							<Typography
								tag="p"
								className="text-[12.5px] text-t-1 truncate group-hover:text-acc-t transition-colors"
							>
								{item.title}
							</Typography>
							<Typography tag="p" className="text-[11px] text-t-3 mt-0.5">
								{item.language} · {item.totalPages}{" "}
								{t("library.textDetail.related.pages")} ·{" "}
								{item.wordCount.toLocaleString()}{" "}
								{t("library.textDetail.related.words")}
							</Typography>
						</div>
						<CefrBadge level={item.level} />
					</Link>
				))}
			</div>
		</div>
	);
};

