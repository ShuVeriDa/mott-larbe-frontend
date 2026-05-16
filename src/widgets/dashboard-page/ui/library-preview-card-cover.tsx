import type { LibraryPreviewLevelStyle } from "../lib/library-preview-level-styles";
import { BookOpen } from "lucide-react";

interface LibraryPreviewCardCoverProps {
	colors: LibraryPreviewLevelStyle;
}

export const LibraryPreviewCardCover = ({
	colors,
}: LibraryPreviewCardCoverProps) => (
	<div
		className={`relative flex h-[72px] items-center justify-center ${colors.cov}`}
	>
		<div
			aria-hidden="true"
			className="absolute left-0 top-0 bottom-0 w-[3px]"
			style={{ background: colors.stripe }}
		/>
		<BookOpen
			size={26}
			aria-hidden="true"
			className="opacity-70"
			style={{ color: colors.stripe }}
		/>
	</div>
);
