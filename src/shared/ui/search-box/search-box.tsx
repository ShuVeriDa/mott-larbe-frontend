import type { ComponentProps } from 'react';
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export type SearchBoxVariant = "toolbar" | "panel";

export type SearchBoxProps = Omit<ComponentProps<"input">, "type"> & {
	wrapperClassName?: string;
	variant?: SearchBoxVariant;
};

export const SearchBox = ({
	className,
	wrapperClassName,
	variant = "toolbar",
	...props
}: SearchBoxProps) => (
	<div
		data-slot="search-box"
		className={cn(
			"relative flex items-center",
			variant === "toolbar" && "h-[30px]",
			variant === "panel" && "h-[30px]",
			wrapperClassName,
		)}
	>
		<Search
			className={cn(
				"pointer-events-none absolute left-2.5 size-[13px] shrink-0 text-t-3",
			)}
			strokeWidth={1.4}
			aria-hidden="true"
		/>
		<input
			data-slot="search-box-input"
			type="text"
			autoComplete="off"
			className={cn(
				"h-full w-full rounded-base border pl-[30px] pr-2.5 text-[12.5px] text-t-1 outline-none transition-colors placeholder:text-t-3",
				variant === "toolbar" && "border-bd-2 bg-surf focus:border-acc",
				variant === "panel" && "border-bd-1 bg-surf-2 focus:border-acc focus:bg-surf",
				"[&::-webkit-search-cancel-button]:appearance-none",
				className,
			)}
			{...props}
		/>
	</div>
);
