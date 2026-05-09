"use client";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { cn } from "@/shared/lib/cn";
import type { FeatureFlagItem } from "@/entities/feature-flag";

interface FlagRowActionsProps {
	flag: FeatureFlagItem;
	onEdit: (flag: FeatureFlagItem) => void;
	onDuplicate: (flag: FeatureFlagItem) => void;
	onDelete: (flag: FeatureFlagItem) => void;
	onAddOverride: (flagId: string) => void;
	t: (key: string) => string;
}

export const FlagRowActions = ({ flag, onEdit, onDuplicate, onDelete, onAddOverride, t }: FlagRowActionsProps) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node /* intentional: outside-click target */)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	const btn =
		"flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1";

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onEdit(flag);
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => setOpen((v) => !v);
	const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => { onAddOverride(flag.id); setOpen(false); };
	const handleClick4: NonNullable<ComponentProps<"button">["onClick"]> = () => { onDuplicate(flag); setOpen(false); };
	const handleClick5: NonNullable<ComponentProps<"button">["onClick"]> = () => { onDelete(flag); setOpen(false); };
return (
		<div ref={ref} className="relative flex items-center gap-0.5">
			<button type="button" className={btn} title={t("admin.featureFlags.actions.edit")} onClick={handleClick}>
				<svg className="size-3.5" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
					<path d="M10.5 2.5l2 2-7 7H3.5v-2l7-7z" strokeLinejoin="round" />
				</svg>
			</button>

			<div className="relative">
				<button
					type="button"
					className={btn}
					title={t("admin.featureFlags.actions.more")}
					onClick={handleClick2}
				>
					<svg className="size-3.5" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
						<circle cx="7.5" cy="3.5" r="0.8" fill="currentColor" />
						<circle cx="7.5" cy="7.5" r="0.8" fill="currentColor" />
						<circle cx="7.5" cy="11.5" r="0.8" fill="currentColor" />
					</svg>
				</button>

				{open && (
					<div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[190px] rounded-[9px] border border-bd-2 bg-surf p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
						<button
							type="button"
							className="flex w-full items-center gap-2 rounded-[6px] border-none bg-transparent px-2.5 py-[7px] text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							onClick={handleClick3}
						>
							<svg className="size-[13px] shrink-0 text-t-3" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
								<circle cx="6.5" cy="5" r="2" />
								<path d="M2 13c0-2.5 2-4 4.5-4" strokeLinecap="round" />
								<path d="M11 8v4M9 10h4" strokeLinecap="round" />
							</svg>
							{t("admin.featureFlags.actions.addOverride")}
						</button>
						<button
							type="button"
							className="flex w-full items-center gap-2 rounded-[6px] border-none bg-transparent px-2.5 py-[7px] text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							onClick={handleClick4}
						>
							<svg className="size-[13px] shrink-0 text-t-3" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
								<rect x="4.5" y="4.5" width="8" height="8" rx="1.2" />
								<path d="M2.5 10.5V2.5h8" strokeLinecap="round" />
							</svg>
							{t("admin.featureFlags.actions.duplicate")}
						</button>
						<div className="my-[3px] mx-0.5 h-px bg-bd-1" />
						<button
							type="button"
							className={cn(
								"flex w-full items-center gap-2 rounded-[6px] border-none bg-transparent px-2.5 py-[7px] text-left text-[12.5px] transition-colors",
								"text-red-t hover:bg-red-bg",
							)}
							onClick={handleClick5}
						>
							<svg className="size-[13px] shrink-0 text-red-400" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3">
								<path d="M2.5 4.5h10M5 4.5V3h5v1.5M6 7v4M9 7v4" strokeLinecap="round" />
								<path d="M3.5 4.5l.7 7.5h6.6l.7-7.5" />
							</svg>
							{t("admin.featureFlags.actions.delete")}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
