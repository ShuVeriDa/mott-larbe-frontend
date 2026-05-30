import { BookOpen } from "lucide-react";
import type { LibraryPreviewLevelStyle } from "../lib/library-preview-level-styles";

interface LibraryPreviewCardCoverProps {
	colors: LibraryPreviewLevelStyle;
}

export const LibraryPreviewCardCover = ({
	colors,
}: LibraryPreviewCardCoverProps) => (
	<div
		className={`relative flex h-[180px] items-center justify-center md:h-[217px] lg:h-[290px] ${colors.cov}`}
	>
		<div
			aria-hidden="true"
			className="absolute left-0 top-0 bottom-0 w-[3px]"
			style={{ background: colors.stripe }}
		/>
		<BookOpen
			size={26}
			aria-hidden="true"
			className="opacity-70 md:size-8 lg:size-10"
			style={{ color: colors.stripe }}
		/>
	</div>
);
