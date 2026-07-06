import { Typography } from "@/shared/ui/typography";

export const TextCoverWordPopup = () => (
	<div className="absolute left-[73%] top-[49%] w-[62px] -translate-x-1/2 overflow-hidden rounded-[6px] border-[0.5px] border-bd-2 bg-surf shadow-lg">
		<div className="flex items-center gap-1 border-b-[0.5px] border-bd-1 px-1.5 pt-1.5 pb-1">
			<div className="h-[3px] w-[26px] rounded-full bg-t-4/60" />
			<Typography
				tag="span"
				className="ml-auto h-[6px] w-[10px] shrink-0 rounded-[2px] bg-grn/40"
			/>
		</div>
		<div className="px-1.5 py-1.5">
			<div className="h-[2.5px] w-[36px] rounded-full bg-acc/35" />
		</div>
		<div className="flex items-center justify-between border-t-[0.5px] border-bd-1 px-1.5 py-1">
			<Typography
				tag="span"
				className="h-[8px] w-[20px] rounded-[2px] bg-grn/40"
			/>
			<Typography
				tag="span"
				className="size-[8px] rounded-[2px] border-[0.5px] border-bd-1 bg-surf-2"
			/>
		</div>
	</div>
);
