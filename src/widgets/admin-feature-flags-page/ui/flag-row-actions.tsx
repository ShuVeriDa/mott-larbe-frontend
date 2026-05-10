"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Pencil, MoreVertical, UserPlus, Copy, Trash2 } from "lucide-react";
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
			<Button className={btn} title={t("admin.featureFlags.actions.edit")} onClick={handleClick}>
				<Pencil className="size-3.5" />
			</Button>

			<div className="relative">
				<Button
					className={btn}
					title={t("admin.featureFlags.actions.more")}
					onClick={handleClick2}
				>
					<MoreVertical className="size-3.5" />
				</Button>

				{open && (
					<div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[190px] rounded-[9px] border border-bd-2 bg-surf p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
						<Button
							className="flex w-full items-center gap-2 rounded-[6px] border-none bg-transparent px-2.5 py-[7px] text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							onClick={handleClick3}
						>
							<UserPlus className="size-[13px] shrink-0 text-t-3" />
							{t("admin.featureFlags.actions.addOverride")}
						</Button>
						<Button
							className="flex w-full items-center gap-2 rounded-[6px] border-none bg-transparent px-2.5 py-[7px] text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							onClick={handleClick4}
						>
							<Copy className="size-[13px] shrink-0 text-t-3" />
							{t("admin.featureFlags.actions.duplicate")}
						</Button>
						<div className="my-[3px] mx-0.5 h-px bg-bd-1" />
						<Button
							className={cn(
								"flex w-full items-center gap-2 rounded-[6px] border-none bg-transparent px-2.5 py-[7px] text-left text-[12.5px] transition-colors",
								"text-red-t hover:bg-red-bg",
							)}
							onClick={handleClick5}
						>
							<Trash2 className="size-[13px] shrink-0 text-red-400" />
							{t("admin.featureFlags.actions.delete")}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
