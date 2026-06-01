import { BookOpen } from "lucide-react";
import type { LibraryPreviewLevelStyle } from "../lib/library-preview-level-styles";

interface LibraryPreviewCardCoverProps {
	colors: LibraryPreviewLevelStyle;
}

export const LibraryPreviewCardCover = ({
	colors,
}: LibraryPreviewCardCoverProps) => (
	<div
		className={`relative flex h-[160px] items-center justify-center md:h-[190px] lg:h-[210px] xl:h-[250px] ${colors.cov}`}
	>
		<div
			aria-hidden="true"
			className="absolute left-0 top-0 bottom-0 w-[3px]"
			style={{ background: colors.stripe }}
		/>
		<BookOpen
			size={26}
			aria-hidden="true"
			className="opacity-70 md:size-7 lg:size-8 xl:size-9"
			style={{ color: colors.stripe }}
		/>
	</div>
);
