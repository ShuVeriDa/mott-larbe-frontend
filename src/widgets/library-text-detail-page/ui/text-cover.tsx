import type { LibraryTextLanguage } from "@/entities/library-text";
import { cn } from "@/shared/lib/cn";
import Image from "next/image";

import { Typography } from "@/shared/ui/typography";
import { TEXT_COVER_PLACEHOLDER_LINES } from "../lib/text-cover-placeholder-lines";
import { TextCoverWordPopup } from "./text-cover-word-popup";

interface TextCoverProps {
	language: LibraryTextLanguage;
	imageUrl: string | null;
	title: string;
	priority?: boolean;
	className?: string;
}

export const TextCover = ({
	language,
	imageUrl,
	title,
	priority,
	className,
}: TextCoverProps) => (
	<div
		className={cn(
			"relative w-[140px] h-[200px] rounded-card border border-bd-2 bg-surf shrink-0 overflow-hidden",
			"max-sm:w-[110px] max-sm:h-[158px]",
			className,
		)}
	>
		{imageUrl ? (
			<Image
				src={imageUrl}
				alt={title}
				fill
				sizes="(max-width: 640px) 110px, 140px"
				quality={90}
				loading={priority ? "eager" : "lazy"}
				className="object-cover object-top"
				priority={priority}
			/>
		) : (
			<div className="relative w-full h-full flex flex-col">
				{/* Topbar: back arrow + title vs. tool icon dots */}
				<div className="flex items-center justify-between gap-1 border-b border-bd-1 px-2 py-1.5">
					<div className="flex items-center gap-1">
						<div className="h-[5px] w-[5px] rounded-[1px] bg-bd-3" />
						<div className="h-[4px] w-[22px] rounded-full bg-bd-3" />
					</div>
					<div className="flex items-center gap-[3px]">
						<div className="size-[3px] rounded-full bg-bd-3" />
						<div className="size-[3px] rounded-full bg-bd-3" />
						<div className="size-[3px] rounded-full bg-bd-3" />
						<div className="size-[3px] rounded-full bg-bd-3" />
						<div className="size-[3px] rounded-full bg-bd-3" />
						<div className="size-[3px] rounded-full bg-bd-3" />
					</div>
				</div>

				<div className="flex flex-1 flex-col px-3 pt-2.5 pb-3">
					{/* Progress bar */}
					<div className="mb-2 h-[2px] w-full overflow-hidden rounded-full bg-bd-1">
						<div className="h-full w-[38%] rounded-full bg-acc/50" />
					</div>

					{/* Meta pills */}
					<div className="mb-1.5 flex flex-wrap items-center gap-1">
						<div className="h-[4px] w-[14px] rounded-[2px] bg-bd-3" />
						<div className="h-[4px] w-[10px] rounded-[2px] bg-bd-3" />
						<div className="h-[4px] w-[16px] rounded-[2px] bg-bd-3" />
					</div>

					{/* Divider */}
					<div className="mb-1.5 h-px w-full bg-bd-2" />

					{/* Title / subtitle */}
					<div className="mb-1 h-[5px] w-[85%] rounded-[2px] bg-bd-3" />
					{/* <div className="mb-2 h-[5px] w-[55%] rounded-[2px] bg-bd-3 opacity-70" /> */}

					{/* Byline */}
					<div className="mb-4.5 flex items-center gap-1.5">
						<div className="h-[3px] w-[26px] rounded-full bg-bd-3" />
						<div className="h-1 w-px bg-bd-2" />
						<div className="h-[3px] w-[36px] rounded-full bg-bd-3" />
					</div>

					<div className="relative flex-1 w-full flex flex-col gap-[6px]">
						{TEXT_COVER_PLACEHOLDER_LINES.map(
							({ width, accent, textAlign }, index) => (
								<div
									key={index}
									className={cn(
										"h-[2.5px] rounded-full flex",
										accent ? "bg-acc/35" : "bg-bd-3",
										textAlign === "center" && "self-center",
										textAlign === "right" && "self-end",
										textAlign === "left" && "self-start",
									)}
									style={{ width: `${width}%` }}
								/>
							),
						)}
					</div>
					<TextCoverWordPopup />
				</div>
			</div>
		)}
		<Typography
			tag="span"
			className="absolute bottom-1.5 right-1.5 text-[9px] font-bold tracking-[0.06em] text-acc-t bg-acc-bg border border-acc/20 px-1.5 py-px rounded-[4px]"
		>
			{language}
		</Typography>
	</div>
);
