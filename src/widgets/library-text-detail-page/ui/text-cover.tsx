import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import type { LibraryTextLanguage } from "@/entities/library-text";

interface TextCoverProps {
	language: LibraryTextLanguage;
	imageUrl: string | null;
	className?: string;
}

export const TextCover = ({ language, imageUrl, className }: TextCoverProps) => (
	<div
		className={cn(
			"relative w-[88px] h-[126px] rounded-card border border-bd-2 bg-surf shrink-0 overflow-hidden",
			"max-sm:w-[72px] max-sm:h-[104px]",
			className,
		)}
	>
		{imageUrl ? (
			<Image
				src={imageUrl}
				alt=""
				fill
				sizes="88px"
				className="object-cover"
				unoptimized
			/>
		) : (
			<div className="px-2.5 pt-2.5 w-full flex flex-col gap-1">
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[88%]" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[70%]" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[88%]" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[45%]" />
				<div className="h-1" />
				<div className="h-[2.5px] rounded-full bg-acc/35 w-[88%]" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[70%]" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[88%]" />
				<div className="h-[2.5px] rounded-full bg-acc/35 w-[45%]" />
				<div className="h-1" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[88%]" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[45%]" />
				<div className="h-[2.5px] rounded-full bg-bd-3 w-[70%]" />
			</div>
		)}
		<span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold tracking-[0.06em] text-acc-t bg-acc-bg border border-acc/20 px-1.5 py-[1px] rounded-[4px]">
			{language}
		</span>
	</div>
);
