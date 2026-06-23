import { BookOpen } from "lucide-react";
import Image from "next/image";
import type { LibraryPreviewLevelStyle } from "../lib/library-preview-level-styles";

interface LibraryPreviewCardCoverProps {
	colors: LibraryPreviewLevelStyle;
	imageUrl: string | null;
	title: string;
}

export const LibraryPreviewCardCover = ({
	colors,
	imageUrl,
	title,
}: LibraryPreviewCardCoverProps) => (
	<div
		className={`relative flex w-full aspect-3/4 items-center justify-center overflow-hidden ${imageUrl ? "bg-surf-2" : colors.cov}`}
	>
		{imageUrl ? (
			<Image
				src={imageUrl}
				alt={title}
				fill
				sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
				quality={90}
				className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
			/>
		) : (
			<>
				<div
					aria-hidden="true"
					className="absolute left-0 top-0 bottom-0 w-[3px]"
					style={{ background: colors.stripe }}
				/>
				<BookOpen
					size={26}
					aria-hidden="true"
					className="opacity-70 transition-transform duration-200 ease-out group-hover:scale-110 md:size-7 lg:size-8 xl:size-9"
					style={{ color: colors.stripe }}
				/>
			</>
		)}
	</div>
);
