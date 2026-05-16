import type { LibraryTextListItem } from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";
import { LANG_TAG } from "@/shared/lib/lang-tag/lang-tag";
import { Typography } from "@/shared/ui/typography";
import type { LibraryPreviewLevelStyle } from "../lib/library-preview-level-styles";

interface LibraryPreviewCardMetaProps {
	item: Pick<LibraryTextListItem, "level" | "language" | "title" | "author">;
	colors: LibraryPreviewLevelStyle;
}

export const LibraryPreviewCardMeta = ({
	item,
	colors,
}: LibraryPreviewCardMetaProps) => {
	const { t } = useI18n();

	return (
		<>
			<div className="mb-1.5 flex items-center gap-[5px]">
				{item.level ? (
					<Typography
						tag="span"
						className={`inline-flex items-center rounded-[4px] px-1.5 py-[2px] text-[10px] font-bold ${colors.badge}`}
					>
						{t(`shared.cefrLevel.${item.level}`)}
					</Typography>
				) : null}
				<Typography tag="span" className="text-[10px] font-medium text-t-3">
					{LANG_TAG[item.language] ?? item.language}
				</Typography>
			</div>

			<div className="mb-0.5 line-clamp-2 text-[12.5px] font-semibold leading-[1.35] text-t-1">
				{item.title}
			</div>
			{item.author ? (
				<div className="mb-2 truncate text-[11px] text-t-3">{item.author}</div>
			) : (
				<div className="mb-2" />
			)}
		</>
	);
};
