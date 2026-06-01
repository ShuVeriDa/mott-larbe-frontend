import type { TextTagDto } from "@/entities/library-text";
import { Typography } from "@/shared/ui/typography";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

interface TextTagsCardProps {
	tags: TextTagDto[];
	t: Translator;
}

export const TextTagsCard = ({ tags, t }: TextTagsCardProps) => {
	if (tags.length === 0) return null;

	return (
		<div className="bg-surf border border-bd-1 rounded-card px-[17px] py-[15px] animate-[fadeUp_0.3s_0.12s_ease_both]">
			<Typography
				tag="h2"
				className="text-[10px] font-semibold tracking-widest uppercase text-t-3 mb-3"
			>
				{t("library.textDetail.tags.label")}
			</Typography>
			<div className="flex flex-wrap gap-1.5">
				{tags.map((tag) => (
					<span
						key={tag.id}
						className="inline-flex items-center h-[22px] px-2.5 rounded-full bg-surf-2 border border-bd-1 text-[11.5px] font-medium text-t-2 hover:bg-surf-3 hover:text-t-1 hover:border-bd-2 transition-colors cursor-default select-none"
					>
						{tag.name}
					</span>
				))}
			</div>
		</div>
	);
};
