"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import { Check } from "lucide-react";

export interface ThemeCardProps {
	id: "light" | "dark" | "system";
	name: string;
	selected: boolean;
	onSelect: (id: "light" | "dark" | "system") => void;
}

const previews: Record<
	"light" | "dark" | "system",
	{ bg: string; bar: string; line1: string; line2: string; dot: string }
> = {
	light: {
		bg: "#F9F8F7",
		bar: "#ffffff",
		line1: "#d2d0c7",
		line2: "#e8e6df",
		dot: "#2254d3",
	},
	dark: {
		bg: "#121210",
		bar: "#1c1c1a",
		line1: "#2e2e2a",
		line2: "#242420",
		dot: "#4a78f5",
	},
	system: {
		bg: "linear-gradient(135deg,#F9F8F7 50%,#121210 50%)",
		bar: "linear-gradient(135deg,#ffffff 50%,#1c1c1a 50%)",
		line1: "rgba(0,0,0,0.1)",
		line2: "rgba(0,0,0,0.07)",
		dot: "#2254d3",
	},
};

export const ThemeCard = ({ id, name, selected, onSelect }: ThemeCardProps) => {
	const p = previews[id];
		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onSelect(id);
return (
		<Button
			aria-pressed={selected}
			onClick={handleClick}
			className={cn(
				"relative shrink-0 cursor-pointer overflow-hidden rounded-[9px] border-[1.5px] transition-colors",
				selected ? "border-acc" : "border-bd-2 hover:border-bd-3",
			)}
		>
			<div
				className="flex h-[72px] w-[110px] flex-col"
				style={{ background: p.bg }}
			>
				<div
					className="flex h-[18px] items-center gap-[5px] px-2"
					style={{
						background: p.bar,
						borderBottom: "0.5px solid rgba(0,0,0,0.07)",
					}}
				>
					<div className="size-1 rounded-full" style={{ background: p.dot }} />
					<div
						className="h-[3px] w-10 rounded-[2px]"
						style={{ background: p.line2 }}
					/>
				</div>
				<div className="flex flex-1 flex-col gap-[3px] px-2 py-1">
					<div
						className="h-1 w-[80%] rounded-[2px]"
						style={{ background: p.line1 }}
					/>
					<div
						className="h-[3px] w-[55%] rounded-[2px]"
						style={{ background: p.line2 }}
					/>
					<div
						className="h-[3px] w-[68%] rounded-[2px]"
						style={{ background: p.line2 }}
					/>
				</div>
			</div>
			{selected ? (
				<Typography tag="span" className="absolute right-[5px] top-[5px] flex size-4 items-center justify-center rounded-full bg-acc">
					<Check className="size-[9px] text-white" strokeWidth={2.5} />
				</Typography>
			) : null}
			<div
				className={cn(
					"py-[5px_7px] text-center text-[11px] font-medium",
					selected ? "text-t-1" : "text-t-2",
				)}
			>
				{name}
			</div>
		</Button>
	);
};
