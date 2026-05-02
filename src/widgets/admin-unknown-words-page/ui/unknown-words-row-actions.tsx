"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordListItem } from "@/entities/unknown-word";
import type { useUnknownWordMutations } from "@/entities/unknown-word/model/use-unknown-word-mutations";

interface RowActionsProps {
	word: UnknownWordListItem;
	mutations: ReturnType<typeof useUnknownWordMutations>;
	onAddToDictionary: () => void;
}

export const UnknownWordRowActions = ({
	word,
	mutations,
	onAddToDictionary,
}: RowActionsProps) => {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const isDeleting = mutations.remove.isPending;

	return (
		<div className="flex items-center justify-end gap-0.5">
			{/* Quick add */}
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					onAddToDictionary();
				}}
				className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-acc-bg hover:text-acc-t"
				title={t("admin.unknownWords.row.addToDictionary")}
			>
				<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
					<path
						d="M8 3v10M3 8h10"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
					/>
				</svg>
			</button>

			{/* Dropdown */}
			<div ref={ref} className="relative">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setOpen((v) => !v);
					}}
					className="flex size-[30px] cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="4" r="1" fill="currentColor" />
						<circle cx="8" cy="8" r="1" fill="currentColor" />
						<circle cx="8" cy="12" r="1" fill="currentColor" />
					</svg>
				</button>

				{open && (
					<div className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-[190px] rounded-[9px] border border-bd-2 bg-surf p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
						<button
							type="button"
							onClick={() => {
								setOpen(false);
								onAddToDictionary();
							}}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
						>
							<svg className="size-3.5 shrink-0 text-t-3" viewBox="0 0 16 16" fill="none">
								<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							</svg>
							{t("admin.unknownWords.row.addToDictionary")}
						</button>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
						>
							<svg className="size-3.5 shrink-0 text-t-3" viewBox="0 0 16 16" fill="none">
								<circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.3" />
								<path d="M9 9.5L8 8V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							</svg>
							{t("admin.unknownWords.row.linkToLemma")}
						</button>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
						>
							<svg className="size-3.5 shrink-0 text-t-3" viewBox="0 0 16 16" fill="none">
								<rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
								<path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							</svg>
							{t("admin.unknownWords.row.allContexts")}
						</button>
						<div className="my-1 h-px bg-bd-1" />
						<button
							type="button"
							disabled={isDeleting}
							onClick={() => {
								setOpen(false);
								mutations.remove.mutate(word.id);
							}}
							className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] text-red-t transition-colors hover:bg-red-bg disabled:opacity-50"
						>
							<svg className="size-3.5 shrink-0 text-red-t" viewBox="0 0 16 16" fill="none">
								<path
									d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4"
									stroke="currentColor"
									strokeWidth="1.3"
									strokeLinecap="round"
								/>
								<path
									d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5"
									stroke="currentColor"
									strokeWidth="1.3"
									strokeLinecap="round"
								/>
							</svg>
							{t("admin.unknownWords.row.delete")}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
