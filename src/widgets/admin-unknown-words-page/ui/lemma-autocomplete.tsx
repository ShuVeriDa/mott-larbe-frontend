"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useLemmaSearch } from "@/entities/admin-unknown-word";

const inputCls =
	"h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc focus:bg-surf transition-colors";

interface Props {
	value: { id: string; label: string } | null;
	placeholder: string;
	onSelect: (id: string, label: string) => void;
}

export const LemmaAutocomplete = ({
	value,
	onSelect,
	placeholder,
}: Props) => {
	const [q, setQ] = useState(value?.label ?? "");
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const { data, isFetching } = useLemmaSearch(q);

	useEffect(() => {
		if (!value) {
			setQ("");
		}
	}, [value]);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => {
		setQ(e.currentTarget.value);
		setOpen(true);
	};
	const handleFocus: NonNullable<ComponentProps<"input">["onFocus"]> = () => q && setOpen(true);

	return (
		<div ref={ref} className="relative">
			<input
				type="text"
				value={q}
				onChange={handleChange}
				onFocus={handleFocus}
				placeholder={placeholder}
				className={inputCls}
				autoComplete="off"
			/>
			{open && q.length >= 1 && (
				<div className="absolute left-0 top-[calc(100%+4px)] z-30 w-full max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:w-0 rounded-[9px] border border-bd-2 bg-surf shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
					{isFetching && !data?.length ? (
						<div className="px-3 py-2.5 text-[12px] text-t-3">…</div>
					) : data?.length ? (
						data.map((item) => {
							const handleMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = (e) => {
								e.preventDefault();
								onSelect(item.id, item.headword);
								setQ(
									item.translation
										? `${item.headword} — ${item.translation}`
										: item.headword,
								);
								setOpen(false);
							};
							return (
								<Button
									key={item.id}
									onMouseDown={handleMouseDown}
									className="flex w-full flex-col gap-0.5 px-3 py-2 text-left transition-colors hover:bg-surf-2"
								>
									<Typography tag="span" className="text-[13px] font-medium text-t-1">{item.headword}</Typography>
									{item.translation && (
										<Typography tag="span" className="text-[11px] text-t-3">{item.translation}</Typography>
									)}
								</Button>
							);
						})
					) : (
						<div className="px-3 py-2.5 text-[12px] text-t-3">—</div>
					)}
				</div>
			)}
		</div>
	);
};
