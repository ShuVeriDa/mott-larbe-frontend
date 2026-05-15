import type { ComponentProps } from 'react';
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Input } from "@/shared/ui/input";

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
		<Input
			data-slot="search-box-input"
			type="text"
			autoComplete="off"
			variant={variant === "toolbar" ? "search-toolbar" : "search-panel"}
			className={className}
			{...props}
		/>
	</div>
);
