import { ImageIcon } from "lucide-react";
import Image from "next/image";
import type { CefrLevel } from "@/shared/types";

const COVER_COLORS: Record<string, { bg: string; stroke: string }> = {
	A: { bg: "bg-grn-bg", stroke: "text-grn-t" },
	B: { bg: "bg-pur-bg", stroke: "text-pur-t" },
	C: { bg: "bg-red-bg", stroke: "text-red-t" },
};

interface RelatedCoverProps {
	level: CefrLevel | null;
	imageUrl: string | null;
	title: string;
}

export const RelatedCover = ({ level, imageUrl, title }: RelatedCoverProps) => {
	const colors = level
		? (COVER_COLORS[level] ?? COVER_COLORS.A)
		: COVER_COLORS.A;
	return (
		<div
			className={`w-[26px] h-[36px] rounded-[4px] border border-bd-1 shrink-0 overflow-hidden flex items-center justify-center ${imageUrl ? "" : colors.bg}`}
		>
			{imageUrl ? (
				<Image
					src={imageUrl}
					alt={title}
					width={26}
					height={36}
					className="object-cover object-top w-full h-full"
				/>
			) : (
				<ImageIcon className={`size-3 ${colors.stroke}`} />
			)}
		</div>
	);
};
