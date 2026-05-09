import type { ComponentProps } from 'react';
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type SearchBoxProps = Omit<ComponentProps<"input">, "type"> & {
	wrapperClassName?: string;
};

export const SearchBox = ({
	className,
	wrapperClassName,
	...props
}: SearchBoxProps) => (
	<div
		data-slot="search-box"
		className={cn(
			"flex items-center gap-[7px] h-8 px-[10px]",
			"bg-surf-2 border-hairline border-bd-2 rounded-base",
			"transition-colors duration-150",
			"focus-within:border-acc",
			wrapperClassName,
		)}
	>
		<Search
			className="size-[13px] shrink-0 text-t-3"
			strokeWidth={2}
			aria-hidden="true"
		/>
		<input
			data-slot="search-box-input"
			type="search"
			className={cn(
				"flex-1 min-w-0 bg-transparent border-0 outline-none",
				"text-[12.5px] text-t-1 font-[inherit]",
				"placeholder:text-t-3",
				"[&::-webkit-search-cancel-button]:appearance-none",
				className,
			)}
			{...props}
		/>
	</div>
);
