import { Typography } from "@/shared/ui/typography";

export interface SectionHeaderProps {
	title: string;
	subtitle: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
	<div>
		<Typography tag="h2" className="text-[15px] font-semibold text-t-1">
			{title}
		</Typography>
		<Typography tag="p" className="mt-0.5 text-[12px] text-t-3">
			{subtitle}
		</Typography>
	</div>
);
