import { Typography } from "@/shared/ui/typography";
type Translator = (key: string, vars?: Record<string, string | number>) => string;

interface TextDescriptionProps {
	description: string | null;
	t: Translator;
}

export const TextDescription = ({ description, t }: TextDescriptionProps) => {
	if (!description) return null;

	return (
		<div className="bg-surf border border-bd-1 rounded-card px-[18px] py-4 mb-4 animate-[fadeUp_0.3s_0.06s_ease_both]">
			<Typography tag="p" className="text-[10px] font-semibold tracking-[0.1em] uppercase text-t-3 mb-2.5">
				{t("library.textDetail.description")}
			</Typography>
			<Typography tag="p" className="text-[13.5px] text-t-2 leading-[1.68]">{description}</Typography>
		</div>
	);
};
