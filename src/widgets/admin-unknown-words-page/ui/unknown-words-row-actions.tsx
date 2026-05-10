"use client";

import { Button } from "@/shared/ui/button";
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { Plus, MoreVertical, Clock, FileText, Trash2 } from "lucide-react";
import type { UnknownWordItem } from "@/entities/admin-unknown-word";
import type { useAdminUnknownWordMutations } from "@/entities/admin-unknown-word/model/use-admin-unknown-word-mutations";

interface RowActionsProps {
	word: UnknownWordItem;
	mutations: ReturnType<typeof useAdminUnknownWordMutations>;
	onAddToDictionary: () => void;
	onLinkToLemma: () => void;
	onViewContexts: () => void;
}

export const UnknownWordRowActions = ({
	word,
	mutations,
	onAddToDictionary,
	onLinkToLemma,
	onViewContexts,
}: RowActionsProps) => {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node /* intentional: outside-click target */)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const isDeleting = mutations.remove.isPending;

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = (e) => {
					e.stopPropagation();
					onAddToDictionary();
				};
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = (e) => {
						e.stopPropagation();
						setOpen((v) => !v);
					};
	const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => { setOpen(false); onAddToDictionary(); };
	const handleClick4: NonNullable<ComponentProps<"button">["onClick"]> = () => { setOpen(false); onLinkToLemma(); };
	const handleClick5: NonNullable<ComponentProps<"button">["onClick"]> = () => { setOpen(false); onViewContexts(); };
	const handleClick6: NonNullable<ComponentProps<"button">["onClick"]> = () => {
								setOpen(false);
								mutations.remove.mutate(word.id);
							};
return (
		<div className="flex items-center justify-end gap-0.5">
			{/* Quick add */}
			<Button
				onClick={handleClick}
				className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-acc-bg hover:text-acc-t"
				title={t("admin.unknownWords.row.addToDictionary")}
			>
				<Plus className="size-3.5" />
			</Button>

			{/* Dropdown */}
			<div ref={ref} className="relative">
				<Button
					onClick={handleClick2}
					className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
				>
					<MoreVertical className="size-3.5" />
				</Button>

				{open && (
					<div className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-[190px] rounded-[9px] border border-bd-2 bg-surf p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
						<Button
							onClick={handleClick3}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
						>
							<Plus className="size-3.5 shrink-0 text-t-3" />
							{t("admin.unknownWords.row.addToDictionary")}
						</Button>
						<Button
							onClick={handleClick4}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
						>
							<Clock className="size-3.5 shrink-0 text-t-3" />
							{t("admin.unknownWords.row.linkToLemma")}
						</Button>
						<Button
							onClick={handleClick5}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
						>
							<FileText className="size-3.5 shrink-0 text-t-3" />
							{t("admin.unknownWords.row.allContexts")}
						</Button>
						<div className="my-1 h-px bg-bd-1" />
						<Button
							disabled={isDeleting}
							onClick={handleClick6}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
						>
							<Trash2 className="size-3.5 shrink-0 text-red-t" />
							{t("admin.unknownWords.row.delete")}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
