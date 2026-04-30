import type { LucideIcon } from "lucide-react";
import { Typography } from "@/shared/ui/typography";

interface FeatureItemProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

export const FeatureItem = ({
	icon: Icon,
	title,
	description,
}: FeatureItemProps) => (
	<Typography
		tag="li"
		className="flex items-start gap-3 max-[900px]:min-w-[200px] max-[900px]:flex-1 max-[900px]:rounded-[10px] max-[900px]:border-[0.5px] max-[900px]:border-bd-1 max-[900px]:bg-surf max-[900px]:px-3.5 max-[900px]:py-3 max-[640px]:min-w-full max-[640px]:px-3 max-[640px]:py-2.5"
	>
		<Typography
			tag="span"
			className="flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-acc-bg text-acc max-[640px]:size-[26px]"
		>
			<Icon size={14} strokeWidth={1.8} aria-hidden="true" />
		</Typography>
		<Typography className="pt-1 text-[13px] leading-normal text-t-1 max-[900px]:text-[12.5px] max-[640px]:pt-0 max-[640px]:text-[12px]">
			<Typography tag="strong" className="font-semibold">
				{title}
			</Typography>{" "}
			<Typography tag="span" className="text-t-2">
				{description}
			</Typography>
		</Typography>
	</Typography>
);
