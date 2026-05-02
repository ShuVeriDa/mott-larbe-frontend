"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminTextListItem } from "@/entities/admin-text";
import type { useAdminTextMutations } from "@/entities/admin-text/model/use-admin-text-mutations";

interface TextRowActionsProps {
	text: AdminTextListItem;
	mutations: ReturnType<typeof useAdminTextMutations>;
}

export const TextRowActions = ({ text, mutations }: TextRowActionsProps) => {
	const { t, lang } = useI18n();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const isPublished = text.status === "published";
	const isRunning = text.processingStatus === "RUNNING";
	const isError = text.processingStatus === "ERROR";
	const notProcessed = text.processingStatus === "IDLE" && text.tokenCount === 0;

	const btnClass =
		"flex size-7 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1 [&_svg]:size-[14px]";

	return (
		<div className="flex items-center gap-1">
			{/* Edit */}
			<Link
				href={`/${lang}/admin/texts/${text.id}/edit`}
				className={btnClass}
				title={t("admin.texts.actions.edit")}
			>
				<svg viewBox="0 0 16 16" fill="none">
					<path
						d="M10.5 3.5l2 2L5 13H3v-2l7.5-7.5z"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Link>

			{/* Tokenize — shown if not yet processed or has error */}
			{(notProcessed || isError) && !isRunning && (
				<button
					type="button"
					onClick={() => mutations.tokenize.mutate(text.id)}
					disabled={mutations.tokenize.isPending}
					className={`${btnClass} text-acc`}
					title={t("admin.texts.actions.tokenize")}
				>
					<svg viewBox="0 0 16 16" fill="none">
						<path
							d="M5 3.5l8 4.5-8 4.5V3.5z"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			)}

			{/* Retry — shown for errors */}
			{isError && (
				<button
					type="button"
					onClick={() => mutations.tokenize.mutate(text.id)}
					disabled={mutations.tokenize.isPending}
					className={`${btnClass} text-amb`}
					title={t("admin.texts.actions.retry")}
				>
					<svg viewBox="0 0 16 16" fill="none">
						<path
							d="M13 8A5 5 0 013.5 11M3 8a5 5 0 019.5-3"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
						<path
							d="M13 5v3h-3"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			)}

			{/* Versions link — shown for processed texts */}
			{!notProcessed && !isError && (
				<Link
					href={`/${lang}/admin/texts/${text.id}/versions`}
					className={btnClass}
					title={t("admin.texts.actions.versions")}
				>
					<svg viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
						<path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					</svg>
				</Link>
			)}

			{/* Dropdown */}
			<div ref={ref} className="relative">
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className={btnClass}
				>
					<svg viewBox="0 0 16 16" fill="none">
						<circle cx="8" cy="4" r="1" fill="currentColor" />
						<circle cx="8" cy="8" r="1" fill="currentColor" />
						<circle cx="8" cy="12" r="1" fill="currentColor" />
					</svg>
				</button>

				{open && (
					<div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[180px] rounded-[10px] border border-bd-2 bg-surf p-1 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]">
						<Link
							href={`/${lang}/admin/texts/${text.id}/versions`}
							className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
							onClick={() => setOpen(false)}
						>
							{t("admin.texts.actions.versions")}
						</Link>

						<button
							type="button"
							onClick={() => { mutations.tokenize.mutate(text.id); setOpen(false); }}
							className="flex w-full cursor-pointer items-center gap-2 rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
						>
							{t("admin.texts.actions.tokenize")}
						</button>

						<div className="my-[3px] h-px bg-bd-1" />

						{isPublished ? (
							<button
								type="button"
								onClick={() => { mutations.unpublish.mutate(text.id); setOpen(false); }}
								className="flex w-full cursor-pointer items-center gap-2 rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
							>
								{t("admin.texts.actions.unpublish")}
							</button>
						) : (
							<button
								type="button"
								onClick={() => { mutations.publish.mutate(text.id); setOpen(false); }}
								className="flex w-full cursor-pointer items-center gap-2 rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
							>
								{t("admin.texts.actions.publish")}
							</button>
						)}

						<div className="my-[3px] h-px bg-bd-1" />

						<button
							type="button"
							onClick={() => { mutations.remove.mutate(text.id); setOpen(false); }}
							className="flex w-full cursor-pointer items-center gap-2 rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] text-red-t transition-colors hover:bg-red-bg"
						>
							{t("admin.texts.actions.delete")}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
