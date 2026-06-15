import type { InputHTMLAttributes } from "react";

export const FieldInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
	<input
		{...props}
		className="h-[34px] w-full rounded-base border border-bd-2 bg-surf px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
	/>
);
