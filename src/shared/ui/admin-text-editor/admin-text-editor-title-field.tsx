"use client";

import type { ChangeEvent, ComponentProps } from "react";
import { useEffect, useRef } from "react";

interface AdminTextEditorTitleFieldProps {
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
	maxLength?: number;
	warningFromLength?: number;
}

export const AdminTextEditorTitleField = ({
	value,
	placeholder,
	onChange,
	maxLength = 200,
	warningFromLength = 160,
}: AdminTextEditorTitleFieldProps) => {
	const titleRef = useRef<HTMLTextAreaElement>(null);

	const adjustTitleHeight = () => {
		if (!titleRef.current) return;
		titleRef.current.style.height = "auto";
		titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
	};

	useEffect(() => {
		adjustTitleHeight();
	}, [value]);

	const handleTitleInput: NonNullable<ComponentProps<"textarea">["onChange"]> = (
		e: ChangeEvent<HTMLTextAreaElement>,
	) => {
		onChange(e.currentTarget.value);
	};

	const titleLen = value.length;
	const titleWarn = titleLen > warningFromLength;

	return (
		<div className="border-b border-bd-1 bg-surf px-[22px] pt-5 max-sm:px-4 max-sm:pt-4">
			<textarea
				ref={titleRef}
				value={value}
				onChange={handleTitleInput}
				placeholder={placeholder}
				rows={1}
				maxLength={maxLength}
				className="w-full resize-none overflow-hidden border-none bg-transparent font-display text-[22px] font-normal leading-[1.35] text-t-1 outline-none placeholder:text-t-4 max-sm:text-[18px]"
			/>
			<div
				className={`pb-2.5 pt-1 text-right text-[10.5px] ${titleWarn ? "text-amb" : "text-t-4"}`}
			>
				{titleLen} / {maxLength}
			</div>
		</div>
	);
};
