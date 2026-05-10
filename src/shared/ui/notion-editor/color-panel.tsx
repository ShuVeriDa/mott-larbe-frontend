"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { Editor } from "@tiptap/react";
import type { ComponentProps } from "react";
import { useState } from "react";

export const TEXT_COLORS = [
	{ label: "Default", value: null, tw: "bg-t-1" },
	{ label: "Gray", value: "#6b6a62", tw: "bg-[#6b6a62]" },
	{ label: "Brown", value: "#7c4b2a", tw: "bg-[#7c4b2a]" },
	{ label: "Orange", value: "#d97706", tw: "bg-[#d97706]" },
	{ label: "Yellow", value: "#ca8a04", tw: "bg-[#ca8a04]" },
	{ label: "Green", value: "#1a9e52", tw: "bg-[#1a9e52]" },
	{ label: "Blue", value: "#2254d3", tw: "bg-[#2254d3]" },
	{ label: "Purple", value: "#6d4ed4", tw: "bg-[#6d4ed4]" },
	{ label: "Pink", value: "#db2777", tw: "bg-[#db2777]" },
	{ label: "Red", value: "#dc2626", tw: "bg-[#dc2626]" },
] as const;

export const BG_COLORS = [
	{ label: "Default", value: null, tw: "bg-surf" },
	{ label: "Gray bg", value: "rgba(0,0,0,0.06)", tw: "bg-[rgba(0,0,0,0.06)]" },
	{
		label: "Brown bg",
		value: "rgba(124,75,42,0.12)",
		tw: "bg-[rgba(124,75,42,0.12)]",
	},
	{
		label: "Orange bg",
		value: "rgba(217,119,6,0.12)",
		tw: "bg-[rgba(217,119,6,0.12)]",
	},
	{
		label: "Yellow bg",
		value: "rgba(202,138,4,0.12)",
		tw: "bg-[rgba(202,138,4,0.12)]",
	},
	{
		label: "Green bg",
		value: "rgba(26,158,82,0.12)",
		tw: "bg-[rgba(26,158,82,0.12)]",
	},
	{
		label: "Blue bg",
		value: "rgba(34,84,211,0.12)",
		tw: "bg-[rgba(34,84,211,0.12)]",
	},
	{
		label: "Purple bg",
		value: "rgba(109,78,212,0.12)",
		tw: "bg-[rgba(109,78,212,0.12)]",
	},
	{
		label: "Pink bg",
		value: "rgba(219,39,119,0.12)",
		tw: "bg-[rgba(219,39,119,0.12)]",
	},
	{
		label: "Red bg",
		value: "rgba(220,38,38,0.12)",
		tw: "bg-[rgba(220,38,38,0.12)]",
	},
] as const;

export const ColorPanel = ({
	editor,
	onClose,
}: {
	editor: Editor;
	onClose: () => void;
}) => {
	const [tab, setTab] = useState<"text" | "bg">("text");

	const activeTextColor =
		TEXT_COLORS.find(
			c => c.value && editor.isActive("textStyle", { color: c.value }),
		)?.value ?? null;
	const activeHighlight =
		BG_COLORS.find(
			c => c.value && editor.isActive("highlight", { color: c.value }),
		)?.value ?? null;

	const handlePanelMouseDown: NonNullable<
		ComponentProps<"div">["onMouseDown"]
	> = e => e.preventDefault();

	return (
		<div
			className="w-[212px] overflow-hidden rounded-[12px] border border-bd-2 bg-surf shadow-lg"
			onMouseDown={handlePanelMouseDown}
		>
			<div className="flex border-b border-bd-1">
				{(["text", "bg"] as const).map(t => {
					const handleTabMouseDown: NonNullable<
						ComponentProps<"button">["onMouseDown"]
					> = e => {
						e.preventDefault();
						setTab(t);
					};
					return (
						<Button
							key={t}
							onMouseDown={handleTabMouseDown}
							className={`flex-1 py-2 text-[11.5px] rounded-b-none font-medium transition-colors
								${tab === t ? "text-t-1 border-b-2 border-acc -mb-px" : "text-t-3 hover:text-t-2"}`}
						>
							{t === "text" ? "Text color" : "Background"}
						</Button>
					);
				})}
			</div>

			<div className="p-2.5">
				{tab === "text" ? (
					<div className="grid grid-cols-5 gap-1.5">
						{TEXT_COLORS.map(c => {
							const isActive =
								c.value === null
									? activeTextColor === null
									: activeTextColor === c.value;
							const handleMouseDown: NonNullable<
								ComponentProps<"button">["onMouseDown"]
							> = e => {
								e.preventDefault();
								if (c.value === null) {
									editor.chain().focus().unsetColor().run();
								} else {
									editor.chain().focus().setColor(c.value).run();
								}
								onClose();
							};
							return (
								<Button
									key={c.label}
									title={c.label}
									onMouseDown={handleMouseDown}
									className={`relative flex h-[34px] w-full flex-col items-center justify-center gap-0.5 rounded-[7px] transition-all
										${isActive ? "bg-surf-3 ring-1.5 ring-acc" : "hover:bg-surf-2"}`}
								>
									<Typography
										tag="span"
										className="text-[13px] font-bold leading-none"
										style={{ color: c.value ?? "var(--t-1)" }}
									>
										A
									</Typography>
									<Typography
										tag="span"
										className="h-[3px] w-[14px] rounded-full"
										style={{ background: c.value ?? "var(--t-1)" }}
									/>
									{isActive && (
										<Typography
											tag="span"
											className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-acc"
										>
											<svg width="6" height="5" viewBox="0 0 6 5" fill="none">
												<path
													d="M1 2.5l1.5 1.5 2.5-3"
													stroke="white"
													strokeWidth="1.2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</Typography>
									)}
								</Button>
							);
						})}
					</div>
				) : (
					<div className="grid grid-cols-5 gap-1.5">
						{BG_COLORS.map(c => {
							const isActive =
								c.value === null
									? activeHighlight === null
									: activeHighlight === c.value;
							const handleMouseDown: NonNullable<
								ComponentProps<"button">["onMouseDown"]
							> = e => {
								e.preventDefault();
								if (c.value === null) {
									editor.chain().focus().unsetHighlight().run();
								} else {
									editor.chain().focus().setHighlight({ color: c.value }).run();
								}
								onClose();
							};
							return (
								<Button
									key={c.label}
									title={c.label}
									onMouseDown={handleMouseDown}
									className={`relative flex h-[34px] w-full items-center justify-center rounded-[7px] border transition-all
										${isActive ? "border-acc ring-1.5 ring-acc" : "border-bd-1 hover:border-bd-2 hover:bg-surf-2"}`}
									style={{ background: c.value ?? undefined }}
								>
									{c.value === null && (
										<svg
											width="10"
											height="10"
											viewBox="0 0 10 10"
											fill="none"
											className="text-t-3"
										>
											<path
												d="M1 1l8 8M9 1L1 9"
												stroke="currentColor"
												strokeWidth="1.3"
												strokeLinecap="round"
											/>
										</svg>
									)}
									{isActive && (
										<Typography
											tag="span"
											className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-acc"
										>
											<svg width="6" height="5" viewBox="0 0 6 5" fill="none">
												<path
													d="M1 2.5l1.5 1.5 2.5-3"
													stroke="white"
													strokeWidth="1.2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</Typography>
									)}
								</Button>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
